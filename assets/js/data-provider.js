// ==========================================
// STOCK DATA PROVIDER - PART 3
// Reads real Yahoo Finance CSV data
// ==========================================

import {
    NIFTY50_STOCKS
} from "./nifty50.js";
console.log("Data Provider - Part 3 loaded");


// ==========================================
// CSV FILE PATHS
// ==========================================

const STOCK_FILES = {};

NIFTY50_STOCKS.forEach(symbol => {

    STOCK_FILES[symbol] =
        `data/${symbol}.NS.csv`;

});

// ==========================================
// LOAD CSV FILE
// ==========================================

async function loadStockCSV(symbol) {

    const filePath = STOCK_FILES[symbol];

    if (!filePath) {
        throw new Error(`No CSV file configured for ${symbol}`);
    }

    console.log(`Loading CSV for ${symbol}:`, filePath);

    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(
            `Unable to load ${filePath}. HTTP ${response.status}`
        );
    }

    const csvText = await response.text();

    return parseCSV(csvText);
}

// ==========================================
// CHECK ALL NIFTY 50 CSV FILES
// ==========================================

async function checkAllStockData() {

    const results = [];

    console.log("Checking NIFTY 50 CSV files...");

    for (const symbol of NIFTY50_STOCKS) {

        try {

            const data =
                await loadStockCSV(symbol);

            const validation =
                validateHistoricalData(data);

            if (validation.valid) {

                results.push({
                    symbol: symbol,
                    status: "OK",
                    records: data.length
                });

                console.log(
                    `✅ ${symbol}: ${data.length} records`
                );

            } else {

                results.push({
                    symbol: symbol,
                    status: "INVALID",
                    records: data.length
                });

                console.warn(
                    `⚠️ ${symbol}: invalid data`
                );
            }

        } catch (error) {

            results.push({
                symbol: symbol,
                status: "MISSING",
                records: 0
            });

            console.warn(
                `❌ ${symbol}: CSV missing`
            );
        }
    }

    const successful =
        results.filter(
            item => item.status === "OK"
        ).length;

    const missing =
        results.filter(
            item => item.status === "MISSING"
        ).length;

    const invalid =
        results.filter(
            item => item.status === "INVALID"
        ).length;

    console.log("================================");
    console.log("NIFTY 50 DATA CHECK COMPLETE");
    console.log("================================");

    console.log(
        "Successful:",
        successful
    );

    console.log(
        "Missing:",
        missing
    );

    console.log(
        "Invalid:",
        invalid
    );

    console.table(results);

    return results;
}

// ==========================================
// CSV PARSER
// ==========================================

function parseCSV(csvText) {

    const lines = csvText
        .trim()
        .split(/\r?\n/);

    if (lines.length < 2) {
        throw new Error("CSV file contains no data.");
    }

    // Remove BOM
    lines[0] = lines[0].replace(/^\uFEFF/, "");

    const headers = lines[0]
        .split(",")
        .map(header =>
            header.trim().replace(/^"|"$/g, "")
        );

    console.log("CSV headers:", headers);

    const data = [];

    for (let i = 1; i < lines.length; i++) {

        if (!lines[i].trim()) {
            continue;
        }

        let values = lines[i]
            .split(",")
            .map(value =>
                value.trim().replace(/^"|"$/g, "")
            );

        if (values.length < headers.length) {
            console.warn(
                "Skipping row because column count is wrong:",
                lines[i]
            );
            continue;
        }

        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index];
        });

        const record = {

            date: normalizeDate(row["Date"]),

            open: Number(row["Open"]),

            high: Number(row["High"]),

            low: Number(row["Low"]),

            close: Number(row["Close"]),

            adjustedClose: Number(
                row["Adjusted Close"] ||
                row["Adj Close"]
            ),

            volume: Number(
                String(row["Volume"]).replace(/,/g, "")
            )

        };

        if (
            !record.date ||
            !Number.isFinite(record.open) ||
            !Number.isFinite(record.high) ||
            !Number.isFinite(record.low) ||
            !Number.isFinite(record.close) ||
            !Number.isFinite(record.volume)
        ) {

            console.warn(
                "Skipping invalid row:",
                row
            );

            continue;
        }

        data.push(record);
    }

    // Oldest → newest
    data.sort(
        (a, b) =>
            a.date.localeCompare(b.date)
    );

    console.log(
        `Parsed ${data.length} valid records`
    );

    return data;
}


// ==========================================
// DATE NORMALIZATION
// ==========================================

function normalizeDate(dateString) {

    if (!dateString) {
        return null;
    }

    dateString = String(dateString)
        .trim()
        .replace(/^"|"$/g, "");

    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    // DD-MM-YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {

        const parts = dateString.split("-");

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {

        const parts = dateString.split("/");

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return null;
}

// ==========================================
// VALIDATE HISTORICAL DATA
// ==========================================

function validateHistoricalData(data) {

    if (!Array.isArray(data)) {
        return {
            valid: false,
            message: "Data is not an array."
        };
    }

    if (data.length === 0) {
        return {
            valid: false,
            message: "No valid historical records found."
        };
    }

    for (const row of data) {

        if (
            !row.date ||
            !Number.isFinite(row.open) ||
            !Number.isFinite(row.high) ||
            !Number.isFinite(row.low) ||
            !Number.isFinite(row.close) ||
            !Number.isFinite(row.volume)
        ) {

            return {
                valid: false,
                message: "Invalid record found."
            };
        }

        if (
            row.high < row.low ||
            row.high < row.open ||
            row.high < row.close ||
            row.low > row.open ||
            row.low > row.close
        ) {

            return {
                valid: false,
                message: `Invalid OHLC values on ${row.date}.`
            };
        }
    }

    return {
        valid: true,
        message: "Historical data is valid."
    };
}


// ==========================================
// GET LATEST SESSION
// ==========================================

function getLatestSession(data) {

    if (!data || data.length === 0) {
        return null;
    }

    return data[data.length - 1];
}

function getLatestTradingDay(data) {

    return getLatestSession(data);
}
// ==========================================
// GET LAST N SESSIONS
// ==========================================

function getLastSessions(data, count = 5) {

    if (!data || data.length === 0) {
        return [];
    }

    return data.slice(-count);
}


// ==========================================
// DAILY CHANGE
// ==========================================

function calculateDailyChange(data) {

    if (!data || data.length < 2) {
        return null;
    }

    const previous = data[data.length - 2];
    const latest = data[data.length - 1];

    const change =
        ((latest.close - previous.close) /
            previous.close) * 100;

    return Number(change.toFixed(2));
}

function percentageChange(oldValue, newValue) {

    if (
        !Number.isFinite(oldValue) ||
        !Number.isFinite(newValue) ||
        oldValue === 0
    ) {
        return 0;
    }

    return (
        ((newValue - oldValue) / oldValue) * 100
    );
}

// ==========================================
// EXPORT FUNCTIONS
// ==========================================

export {
    loadStockCSV,
    validateHistoricalData,
    getLatestSession,
    getLatestTradingDay,
    getLastSessions,
    calculateDailyChange,
    percentageChange
};

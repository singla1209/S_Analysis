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

    let invalidOHLC = 0;

    for (const row of data) {

        // Check required numeric values
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
                message: "Invalid numeric record found."
            };
        }

        // Count unusual OHLC records
        if (
            row.high < row.low ||
            row.high < row.open ||
            row.high < row.close ||
            row.low > row.open ||
            row.low > row.close
        ) {

            invalidOHLC++;
        }
    }

    return {
        valid: true,
        message:
            `Historical data is valid. ` +
            `Found ${invalidOHLC} unusual OHLC records.`
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


function calculateReturn(data, days) {

    if (!Array.isArray(data) || data.length <= days) {
        return null;
    }

    const latest = data[data.length - 1];
    const previous = data[data.length - 1 - days];

    if (
        !Number.isFinite(latest.close) ||
        !Number.isFinite(previous.close) ||
        previous.close === 0
    ) {
        return null;
    }

    return (
        (latest.close - previous.close) /
        previous.close
    ) * 100;
}


function calculateMovingAverage(data, days) {

    if (!Array.isArray(data) || data.length < days) {
        return null;
    }

    const recent = data.slice(-days);

    const sum = recent.reduce(
        (total, row) => total + row.close,
        0
    );

    return sum / days;
}


function calculateRSI(data, period = 14) {

    if (!Array.isArray(data) || data.length <= period) {
        return null;
    }

    let gains = 0;
    let losses = 0;

    // First period
    for (let i = 1; i <= period; i++) {

        const change =
            data[i].close - data[i - 1].close;

        if (change > 0) {
            gains += change;
        } else {
            losses += Math.abs(change);
        }
    }

    let averageGain =
        gains / period;

    let averageLoss =
        losses / period;

    // Remaining periods — Wilder's smoothing
    for (let i = period + 1; i < data.length; i++) {

        const change =
            data[i].close - data[i - 1].close;

        const gain =
            change > 0 ? change : 0;

        const loss =
            change < 0 ? Math.abs(change) : 0;

        averageGain =
            ((averageGain * (period - 1)) + gain)
            / period;

        averageLoss =
            ((averageLoss * (period - 1)) + loss)
            / period;
    }

    if (averageLoss === 0) {
        return 100;
    }

    const relativeStrength =
        averageGain / averageLoss;

    return (
        100 -
        (100 / (1 + relativeStrength))
    );
}

function calculateAverageVolume(data, days = 20) {

    if (!Array.isArray(data) || data.length < days) {
        return null;
    }

    const recent = data.slice(-days);

    const total = recent.reduce(
        (sum, row) => sum + row.volume,
        0
    );

    return total / days;
}


function calculateVolumeRatio(data, days = 20) {

    if (!Array.isArray(data) || data.length < days + 1) {
        return null;
    }

    const latest = data[data.length - 1];

    const previous = data.slice(
        -(days + 1),
        -1
    );

    const averageVolume =
        previous.reduce(
            (sum, row) => sum + row.volume,
            0
        ) / days;

    if (averageVolume === 0) {
        return null;
    }

    return latest.volume / averageVolume;
}


function calculateRecentHigh(data, days = 20) {

    if (!Array.isArray(data) || data.length < days) {
        return null;
    }

    const recent = data.slice(-days);

    return Math.max(
        ...recent.map(row => row.high)
    );
}


function calculatePriceVsMA(price, movingAverage) {

    if (
        !Number.isFinite(price) ||
        !Number.isFinite(movingAverage) ||
        movingAverage === 0
    ) {
        return null;
    }

    return (
        (price - movingAverage) /
        movingAverage
    ) * 100;
}
// ==========================================
// EXPORT FUNCTIONS
// ==========================================

export {
    loadStockCSV,
    validateHistoricalData,
    getLatestSession,
    getLastSessions,
    calculateDailyChange,
    percentageChange,
    checkAllStockData,
    calculateReturn,
    calculateMovingAverage,
    calculateRSI,
    calculateAverageVolume,
    calculateVolumeRatio,
    calculateRecentHigh,
    calculatePriceVsMA
};

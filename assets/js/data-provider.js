// ==========================================
// STOCK DATA PROVIDER - PART 3
// Reads real Yahoo Finance CSV data
// ==========================================

console.log("Data Provider - Part 3 loaded");


// ==========================================
// CSV FILE PATHS
// ==========================================

const STOCK_FILES = {
    TCS: "data/TCS.NS.csv"
};


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
// CSV PARSER
// ==========================================

function parseCSV(csvText) {

    const lines = csvText
        .trim()
        .split(/\r?\n/);

    if (lines.length < 2) {
        throw new Error("CSV file contains no data.");
    }

    // Remove BOM if present
    lines[0] = lines[0].replace(/^\uFEFF/, "");

    const headers = lines[0]
        .split(",")
        .map(header => header.trim());

    console.log("CSV headers:", headers);

    const data = [];

    for (let i = 1; i < lines.length; i++) {

        if (!lines[i].trim()) {
            continue;
        }

        const values = lines[i].split(",");

        if (values.length < headers.length) {
            continue;
        }

        const row = {};

        headers.forEach((header, index) => {
            row[header] = values[index].trim();
        });

        const record = {

            date: normalizeDate(row["Date"]),

            open: Number(row["Open"]),

            high: Number(row["High"]),

            low: Number(row["Low"]),

            close: Number(row["Close"]),

            adjustedClose: Number(
                row["Adjusted Close"] ?? row["Adj Close"]
            ),

            volume: Number(row["Volume"])

        };

        // Validate numeric data
        if (
            !record.date ||
            !Number.isFinite(record.open) ||
            !Number.isFinite(record.high) ||
            !Number.isFinite(record.low) ||
            !Number.isFinite(record.close) ||
            !Number.isFinite(record.volume)
        ) {
            continue;
        }

        data.push(record);
    }

    // Sort oldest → newest
    data.sort(
        (a, b) => a.date.localeCompare(b.date)
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

    // Yahoo normally uses YYYY-MM-DD.
    // Your Excel example displays DD-MM-YYYY.
    // Handle both formats.

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {

        const parts = dateString.split("-");

        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        return `${year}-${month}-${day}`;
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


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

export {
    loadStockCSV,
    validateHistoricalData,
    getLatestSession,
    getLastSessions,
    calculateDailyChange
};

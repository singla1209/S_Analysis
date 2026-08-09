
// ==========================================
// Stock Analysis - Data Provider
// Part 2
// ==========================================
//
// IMPORTANT:
// This file creates a standard format for our
// historical stock data.
//
// The analysis engine will NOT depend directly
// on any particular API.
//
// Standard format:
//
// {
//     symbol: "TCS",
//     date: "2026-08-07",
//     open: 3000,
//     high: 3050,
//     low: 2980,
//     close: 3035,
//     volume: 1234567
// }
//
// ==========================================


/**
 * Convert one raw price record into our
 * standard OHLCV format.
 *
 * We will connect the actual free data source
 * in the next step.
 */
export function normalizePriceRecord(record) {

    return {
        symbol: record.symbol || "",
        date: record.date || "",

        open: Number(record.open) || 0,
        high: Number(record.high) || 0,
        low: Number(record.low) || 0,
        close: Number(record.close) || 0,
        volume: Number(record.volume) || 0
    };
}


/**
 * Normalize an entire historical dataset.
 */
export function normalizeHistoricalData(records) {

    if (!Array.isArray(records)) {
        return [];
    }

    return records
        .map(normalizePriceRecord)
        .filter(item => item.date && item.close > 0)
        .sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
}


/**
 * Get the latest completed trading day.
 */
export function getLatestTradingDay(records) {

    if (!records || records.length === 0) {
        return null;
    }

    return records[records.length - 1];
}


/**
 * Get the last N trading sessions.
 */
export function getLastSessions(records, numberOfDays) {

    if (!Array.isArray(records)) {
        return [];
    }

    return records.slice(-numberOfDays);
}


/**
 * Calculate percentage change between
 * two closing prices.
 */
export function percentageChange(oldPrice, newPrice) {

    if (!oldPrice || oldPrice === 0) {
        return 0;
    }

    return ((newPrice - oldPrice) / oldPrice) * 100;
}


/**
 * Basic data validation.
 *
 * This prevents bad/incomplete API data
 * from entering our analysis engine.
 */
export function validateHistoricalData(records) {

    if (!Array.isArray(records) || records.length === 0) {
        return {
            valid: false,
            message: "No historical data available."
        };
    }

    for (const row of records) {

        if (!row.date) {
            return {
                valid: false,
                message: "Missing date in historical data."
            };
        }

        if (
            row.open <= 0 ||
            row.high <= 0 ||
            row.low <= 0 ||
            row.close <= 0
        ) {
            return {
                valid: false,
                message: `Invalid price data for ${row.date}.`
            };
        }

        if (row.high < row.low) {
            return {
                valid: false,
                message: `High is lower than Low on ${row.date}.`
            };
        }
    }

    return {
        valid: true,
        message: "Historical data is valid."
    };
}


/**
 * Temporary test data.
 *
 * This is ONLY for checking that Part 2 works.
 * It is NOT real market data.
 *
 * We will remove this after connecting
 * the actual historical-data source.
 */
export function getDemoData(symbol = "TCS") {

    return normalizeHistoricalData([

        {
            symbol,
            date: "2026-08-03",
            open: 2975,
            high: 3015,
            low: 2960,
            close: 3000,
            volume: 1000000
        },

        {
            symbol,
            date: "2026-08-04",
            open: 3005,
            high: 3030,
            low: 2990,
            close: 3020,
            volume: 1200000
        },

        {
            symbol,
            date: "2026-08-05",
            open: 3025,
            high: 3040,
            low: 3000,
            close: 3010,
            volume: 1100000
        },

        {
            symbol,
            date: "2026-08-06",
            open: 3015,
            high: 3045,
            low: 3005,
            close: 3030,
            volume: 1350000
        },

        {
            symbol,
            date: "2026-08-07",
            open: 3035,
            high: 3060,
            low: 3020,
            close: 3050,
            volume: 1600000
        }

    ]);
}


console.log("Data Provider - Part 2 loaded");
```

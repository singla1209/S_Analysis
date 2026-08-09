
// ==========================================
// Stock Analysis - Main JavaScript
// Part 2
// ==========================================

import {
    loadStockCSV,
    validateHistoricalData,
    getLatestSession,
    getLatestTradingDay,
    getLastSessions,
    calculateDailyChange,
    percentageChange
} from "./data-provider.js";


console.log("Stock Analysis - Part 2 loaded");


// ==========================================
// HEADER DATE
// ==========================================

const analysisDate = document.getElementById("analysisDate");

if (analysisDate) {

    const today = new Date();

    analysisDate.textContent =
        today.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
}


// ==========================================
// ANALYSIS DATE INPUT
// ==========================================

const analysisDateInput =
    document.getElementById("analysisDateInput");

if (analysisDateInput) {

    const today = new Date();

    const yyyy = today.getFullYear();

    const mm = String(
        today.getMonth() + 1
    ).padStart(2, "0");

    const dd = String(
        today.getDate()
    ).padStart(2, "0");

    analysisDateInput.value =
        `${yyyy}-${mm}-${dd}`;
}


// ==========================================
// TEST DATA
// ==========================================

async function testDataLayer() {

const data = await loadStockCSV("TCS");

    console.log("Historical data:", data);


    // Validate data

    const validation =
        validateHistoricalData(data);

    console.log("Validation:", validation);


    if (!validation.valid) {

        console.error(
            "Data validation failed:",
            validation.message
        );

        return;
    }


    // Latest trading session

    const latest =
        getLatestTradingDay(data);

    console.log(
        "Latest trading session:",
        latest
    );


    // Last 5 sessions

    const lastFive =
        getLastSessions(data, 5);

    console.log(
        "Last 5 sessions:",
        lastFive
    );


    // Example price change

    if (data.length >= 2) {

        const previous =
            data[data.length - 2];

        const change =
            percentageChange(
                previous.close,
                latest.close
            );

        console.log(
            "Latest daily change:",
            change.toFixed(2) + "%"
        );
    }


    // Show basic result on page

    const stocksAnalysed =
        document.getElementById("stocksAnalysed");

    if (stocksAnalysed) {
        stocksAnalysed.textContent = "1";
    }
}


// ==========================================
// RUN ANALYSIS BUTTON
// ==========================================

const runAnalysisBtn =
    document.getElementById("runAnalysisBtn");


if (runAnalysisBtn) {

    runAnalysisBtn.addEventListener(
        "click",
        () => {

            console.log(
                "Starting historical data test..."
            );

            testDataLayer();

        }
    );
}


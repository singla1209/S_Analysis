
// ==========================================
// Stock Analysis - Main JavaScript
// Part 2
// ==========================================

import {
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
} from "./data-provider.js";
import {
    NIFTY50_STOCKS
} from "./nifty50.js";


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

      console.log("Starting historical data test...");

    console.log(
        "NIFTY 50 stocks:",
        NIFTY50_STOCKS
    );

    console.log(
        "Total NIFTY 50 stocks:",
        NIFTY50_STOCKS.length
    );

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
    getLatestSession(data);

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

    const return5 =
    calculateReturn(data, 5);

const return20 =
    calculateReturn(data, 20);

const ma20 =
    calculateMovingAverage(data, 20);

const ma50 =
    calculateMovingAverage(data, 50);

console.log(
    "5-day return:",
    return5?.toFixed(2) + "%"
);

console.log(
    "20-day return:",
    return20?.toFixed(2) + "%"
);

console.log(
    "MA20:",
    ma20?.toFixed(2)
);

console.log(
    "MA50:",
    ma50?.toFixed(2)
);
   // 6. FOR RSI Calculation (14)
const rsi =
    calculateRSI(data, 14);

console.log(
    "RSI (14):",
    rsi?.toFixed(2)
);

  // 7. averate Volumen Calculation
    const averageVolume =
    calculateAverageVolume(data, 20);

const volumeRatio =
    calculateVolumeRatio(data, 20);

const recentHigh =
    calculateRecentHigh(data, 20);

const priceVsMA20 =
    calculatePriceVsMA(
        latest.close,
        ma20
    );

const priceVsMA50 =
    calculatePriceVsMA(
        latest.close,
        ma50
    );

console.log(
    "Average Volume (20):",
    averageVolume?.toFixed(0)
);

console.log(
    "Volume Ratio:",
    volumeRatio?.toFixed(2) + "x"
);

console.log(
    "20-day High:",
    recentHigh?.toFixed(2)
);

console.log(
    "Price vs MA20:",
    priceVsMA20?.toFixed(2) + "%"
);

console.log(
    "Price vs MA50:",
    priceVsMA50?.toFixed(2) + "%"
);

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

checkAllStockData();


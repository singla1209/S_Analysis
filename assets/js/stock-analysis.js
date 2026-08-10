
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


async function analyzeStock(symbol) {

    console.log(`Analyzing ${symbol}...`);

    try {

        // Load historical data
        const data =
            await loadStockCSV(symbol);

        // Validate
        const validation =
            validateHistoricalData(data);

        if (!validation.valid) {

            return {
                symbol,
                valid: false,
                message: validation.message
            };
        }

        // Latest session
        const latest =
            getLatestSession(data);

        const price =
            latest.close;

        // Returns
        const return5 =
            calculateReturn(data, 5);

        const return20 =
            calculateReturn(data, 20);

        // Moving averages
        const ma20 =
            calculateMovingAverage(data, 20);

        const ma50 =
            calculateMovingAverage(data, 50);

        // RSI
        const rsi =
            calculateRSI(data, 14);

        // Volume
        const volumeRatio =
            calculateVolumeRatio(data, 20);

        // Price position
        const priceVsMA20 =
            calculatePriceVsMA(price, ma20);

        const priceVsMA50 =
            calculatePriceVsMA(price, ma50);

        // Daily change
        const dailyChange =
            calculateDailyChange(data);

        return {

            symbol,
            valid: true,

            date: latest.date,
            price,

            dailyChange,

            return5,
            return20,

            ma20,
            ma50,

            rsi,

            volumeRatio,

            priceVsMA20,
            priceVsMA50
        };

    } catch (error) {

        console.error(
            `Error analyzing ${symbol}:`,
            error
        );

        return {
            symbol,
            valid: false,
            message: error.message
        };
    }
}


async function analyzeAllStocks() {

    console.log("================================");
    console.log("STARTING NIFTY 50 ANALYSIS");
    console.log("================================");

    const results = [];

    for (const symbol of NIFTY50_STOCKS) {

        console.log(`Analyzing ${symbol}...`);

        const result =
            await analyzeStock(symbol);

        results.push(result);
    }

    console.log("================================");
    console.log("NIFTY 50 ANALYSIS COMPLETE");
    console.log("================================");

    console.table(results);

    return results;
}

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

// ==========================================
// RUN ANALYSIS BUTTON
// ==========================================

// ==========================================
// NIFTY 50 MAIN PAGE ANALYSIS
// ==========================================

const runAnalysisBtn =
    document.getElementById("runAnalysisBtn");

const stockAnalysisBody =
    document.getElementById("stockAnalysisBody");

const stocksAnalysed =
    document.getElementById("stocksAnalysed");


// ------------------------------------------
// Format number
// ------------------------------------------

function formatNumber(value, decimals = 2) {

    if (!Number.isFinite(value)) {
        return "--";
    }

    return Number(value).toFixed(decimals);
}


// ------------------------------------------
// Format percentage
// ------------------------------------------

function formatPercent(value) {

    if (!Number.isFinite(value)) {
        return "--";
    }

    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}


// ------------------------------------------
// Percentage class
// ------------------------------------------

function percentageClass(value) {

    if (!Number.isFinite(value)) {
        return "";
    }

    if (value > 0) {
        return "text-success fw-semibold";
    }

    if (value < 0) {
        return "text-danger fw-semibold";
    }

    return "";
}


// ------------------------------------------
// RSI class
// ------------------------------------------

function rsiClass(value) {

    if (!Number.isFinite(value)) {
        return "";
    }

    if (value >= 70) {
        return "text-danger fw-bold";
    }

    if (value <= 30) {
        return "text-success fw-bold";
    }

    return "";
}


// ------------------------------------------
// Render results
// ------------------------------------------

function renderStockAnalysis(results) {

    if (!stockAnalysisBody) {
        return;
    }

    stockAnalysisBody.innerHTML = "";


    if (!results || results.length === 0) {

        stockAnalysisBody.innerHTML = `

            <tr>

                <td
                    colspan="13"
                    class="text-center text-muted py-4">

                    No analysis results available.

                </td>

            </tr>

        `;

        return;
    }


    results.forEach((result, index) => {

        if (!result.valid) {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${index + 1}</td>

                <td class="fw-semibold">
                    ${result.symbol}
                </td>

                <td colspan="11"
                    class="text-danger">

                    Analysis failed:
                    ${result.message || "Unknown error"}

                </td>

            `;

            stockAnalysisBody.appendChild(row);

            return;
        }


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td class="text-muted">
                ${index + 1}
            </td>


            <td>
                <strong>
                    ${result.symbol}
                </strong>
            </td>


            <td>
                ${result.date}
            </td>


            <td>
                ₹${formatNumber(result.price)}
            </td>


            <td class="${percentageClass(result.dailyChange)}">
                ${formatPercent(result.dailyChange)}
            </td>


            <td class="${percentageClass(result.return5)}">
                ${formatPercent(result.return5)}
            </td>


            <td class="${percentageClass(result.return20)}">
                ${formatPercent(result.return20)}
            </td>


            <td>
                ${formatNumber(result.ma20)}
            </td>


            <td>
                ${formatNumber(result.ma50)}
            </td>


            <td class="${rsiClass(result.rsi)}">
                ${formatNumber(result.rsi)}
            </td>


            <td>
                ${formatNumber(result.volumeRatio, 2)}x
            </td>


            <td class="${percentageClass(result.priceVsMA20)}">
                ${formatPercent(result.priceVsMA20)}
            </td>


            <td class="${percentageClass(result.priceVsMA50)}">
                ${formatPercent(result.priceVsMA50)}
            </td>

        `;


        stockAnalysisBody.appendChild(row);

    });


    if (stocksAnalysed) {

        const successful =
            results.filter(
                result => result.valid
            ).length;

        stocksAnalysed.textContent =
            successful;

    }

}


// ------------------------------------------
// Run all NIFTY 50 analysis
// ------------------------------------------

async function runNifty50Analysis() {

    if (!stockAnalysisBody) {
        console.error(
            "stockAnalysisBody not found."
        );

        return;
    }


    if (runAnalysisBtn) {

        runAnalysisBtn.disabled = true;

        runAnalysisBtn.innerHTML = `

            <span
                class="spinner-border spinner-border-sm me-1">
            </span>

            Analyzing...

        `;

    }


    stockAnalysisBody.innerHTML = `

        <tr>

            <td
                colspan="13"
                class="text-center py-4">

                <div
                    class="spinner-border text-primary mb-2">
                </div>

                <div>
                    Loading NIFTY 50 analysis...
                </div>

            </td>

        </tr>

    `;


    try {

        const results = [];


        for (const symbol of NIFTY50_STOCKS) {

            try {

                const result =
                    await analyzeStock(symbol);

                results.push(result);

            } catch (error) {

                console.error(
                    `Failed to analyze ${symbol}:`,
                    error
                );

                results.push({

                    symbol,

                    valid: false,

                    message: error.message

                });

            }

        }


        renderStockAnalysis(results);


        console.log(
            "===== NIFTY 50 ANALYSIS COMPLETE ====="
        );

        console.log(
            "Total stocks analyzed:",
            results.length
        );


        console.table(results);


    } catch (error) {

        console.error(
            "NIFTY 50 analysis failed:",
            error
        );


        stockAnalysisBody.innerHTML = `

            <tr>

                <td
                    colspan="13"
                    class="text-center text-danger py-4">

                    Unable to load stock analysis.

                </td>

            </tr>

        `;

    } finally {

        if (runAnalysisBtn) {

            runAnalysisBtn.disabled = false;

            runAnalysisBtn.innerHTML = `

                <i class="bi bi-bar-chart-line me-1"></i>

                Run Analysis

            `;

        }

    }

}


// ------------------------------------------
// Button
// ------------------------------------------

if (runAnalysisBtn) {

    runAnalysisBtn.addEventListener(
        "click",
        runNifty50Analysis
    );

}
//checkAllStockData();


// ==========================================
// TEST ALL NIFTY 50 STOCKS
// ==========================================




analyzeAllStocks()
    .then(results => {

        console.log(
            "Total stocks analyzed:",
            results.length
        );

    })
    .catch(error => {

        console.error(
            "NIFTY 50 ANALYSIS ERROR:",
            error
        );

    });

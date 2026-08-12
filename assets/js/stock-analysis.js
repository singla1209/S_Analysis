// ==========================================
// Stock Analysis - Main JavaScript
// ==========================================

import {
    loadStockCSV,
    validateHistoricalData,
    getLatestSession,
    getLastSessions,
    calculateDailyChange,
    calculateReturn,
    calculateMovingAverage,
    calculateRSI,
    calculateAverageVolume,
    calculateVolumeRatio,
    calculateRecentHigh,
    calculatePriceVsMA,
     loadIndexCSV,
    loadFNOCSV,
    calculateIndexDailyChange
} from "./data-provider.js";

import {
    getStockSector,
    getSectorIndexFile
} from "./sector-map.js";

import {
    NIFTY50_STOCKS
} from "./nifty50.js";

import {
    addFactorScores,
    displayFactorScores,
    rankStocksByFactorScore
} from "./factor-analysis.js";

console.log("Stock Analysis - Part 2 loaded");


// ==========================================
// HEADER DATE
// ==========================================

const analysisDate =
    document.getElementById("analysisDate");

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

    const yyyy =
        today.getFullYear();

    const mm =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const dd =
        String(today.getDate())
            .padStart(2, "0");

    analysisDateInput.value =
        `${yyyy}-${mm}-${dd}`;
}


// ==========================================
// PAGE ELEMENTS
// ==========================================

const runAnalysisBtn =
    document.getElementById("runAnalysisBtn");

const stockAnalysisBody =
    document.getElementById("stockAnalysisBody");

const stocksAnalysed =
    document.getElementById("stocksAnalysed");

const bullishCount =
    document.getElementById("bullishCount");

const neutralCount =
    document.getElementById("neutralCount");

const bearishCount =
    document.getElementById("bearishCount");

const stockSelector =
    document.getElementById("stockSelector");


// ==========================================
// FORMAT HELPERS
// ==========================================

function formatNumber(
    value,
    decimals = 2
) {

    if (!Number.isFinite(value)) {
        return "--";
    }

    return Number(value)
        .toFixed(decimals);
}


function formatPercent(value) {

    if (!Number.isFinite(value)) {
        return "--";
    }

    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}


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


// ==========================================
// ANALYZE ONE STOCK
// ==========================================

async function analyzeStock(symbol) {

    console.log(`Analyzing ${symbol}...`);

    try {

        const data =
            await loadStockCSV(symbol);

        // ----------------------------------
// F&O DATA
// ----------------------------------

let fnoData = [];

try {

    fnoData =
        await loadFNOCSV(symbol);

} catch (error) {

    console.warn(
        `F&O data unavailable for ${symbol}:`,
        error.message
    );

    fnoData = [];
}


        const validation =
            validateHistoricalData(data);


        if (!validation.valid) {

            return {
                symbol,
                valid: false,
                message: validation.message
            };
        }


        const latest =
            getLatestSession(data);


        if (!latest) {

            return {
                symbol,
                valid: false,
                message: "No latest trading session found."
            };
        }


        const price =
            latest.close;


        // ----------------------------------
        // Returns
        // ----------------------------------

        const return5 =
            calculateReturn(data, 5);

        const return20 =
            calculateReturn(data, 20);


        // ----------------------------------
        // Moving averages
        // ----------------------------------

        const ma20 =
            calculateMovingAverage(data, 20);

        const ma50 =
            calculateMovingAverage(data, 50);


        // ----------------------------------
        // RSI
        // ----------------------------------

        const rsi =
            calculateRSI(data, 14);


        // ----------------------------------
        // Volume
        // ----------------------------------

        const averageVolume =
            calculateAverageVolume(data, 20);

        const volumeRatio =
            calculateVolumeRatio(data, 20);


        // ----------------------------------
        // Recent high
        // ----------------------------------

        const recentHigh =
            calculateRecentHigh(data, 20);


        // ----------------------------------
        // Price vs MA
        // ----------------------------------

        const priceVsMA20 =
            calculatePriceVsMA(
                price,
                ma20
            );

        const priceVsMA50 =
            calculatePriceVsMA(
                price,
                ma50
            );


        // ----------------------------------
        // Daily change
        // ----------------------------------

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

            averageVolume,

            volumeRatio,

            recentHigh,

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


// ==========================================
// ANALYZE ALL NIFTY 50
// ==========================================

async function analyzeAllStocks() {

    console.log(
        "================================"
    );

    console.log(
        "STARTING NIFTY 50 ANALYSIS"
    );

    console.log(
        "================================"
    );


  const results = [];


// ==========================================
// LOAD NIFTY 50 INDEX
// ==========================================

const niftyData =
    await loadIndexCSV("NIFTY50.csv");

const niftyChange =
    calculateIndexDailyChange(niftyData);

console.log(
    "NIFTY 50 daily change:",
    niftyChange
);


// ==========================================
// ANALYZE 50 STOCKS
// ==========================================

for (const symbol of NIFTY50_STOCKS) {

    const result =
        await analyzeStock(symbol);

    if (result.valid) {

        // NIFTY factor input
        result.niftyChange =
            niftyChange;


        // Sector factor input
        const sector =
            getStockSector(symbol);

        const sectorFile =
            getSectorIndexFile(sector);


        if (sectorFile) {

            const sectorData =
                await loadIndexCSV(sectorFile);

            result.sectorChange =
                calculateIndexDailyChange(
                    sectorData
                );

        } else {

            result.sectorChange = null;

        }
    }

    results.push(result);
}

    console.log(
        "================================"
    );

    console.log(
        "NIFTY 50 ANALYSIS COMPLETE"
    );

    console.log(
        "================================"
    );


    return results;
}


// ==========================================
// UPDATE SUMMARY CARDS
// ==========================================

function updateSummary(results) {

    const validResults =
        results.filter(
            result => result.valid
        );


    if (stocksAnalysed) {

        stocksAnalysed.textContent =
            validResults.length;
    }


    /*
     * Basic direction classification
     *
     * Bullish:
     * price above MA20 AND MA50
     *
     * Bearish:
     * price below MA20 AND MA50
     *
     * Otherwise:
     * Neutral
     */

    let bullish = 0;

    let neutral = 0;

    let bearish = 0;


    validResults.forEach(result => {

        const aboveMA20 =
            result.priceVsMA20 > 0;

        const aboveMA50 =
            result.priceVsMA50 > 0;


        if (
            aboveMA20 &&
            aboveMA50 &&
            result.return5 > 0
        ) {

            bullish++;

        } else if (
            !aboveMA20 &&
            !aboveMA50 &&
            result.return5 < 0
        ) {

            bearish++;

        } else {

            neutral++;
        }

    });


    if (bullishCount) {
        bullishCount.textContent =
            bullish;
    }


    if (neutralCount) {
        neutralCount.textContent =
            neutral;
    }


    if (bearishCount) {
        bearishCount.textContent =
            bearish;
    }
}


// ==========================================
// RENDER 50 STOCK TABLE
// ==========================================

function renderStockAnalysis(results) {

    if (!stockAnalysisBody) {
        return;
    }


    stockAnalysisBody.innerHTML = "";


    if (
        !results ||
        results.length === 0
    ) {

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


    results.forEach(
        (result, index) => {

            const row =
                document.createElement("tr");


            if (!result.valid) {

                row.innerHTML = `

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        <strong>
                            ${result.symbol}
                        </strong>
                    </td>

                    <td
                        colspan="11"
                        class="text-danger">

                        Analysis failed:
                        ${result.message || "Unknown error"}

                    </td>

                `;

                stockAnalysisBody
                    .appendChild(row);

                return;
            }


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


            stockAnalysisBody
                .appendChild(row);

        }
    );
}




function renderFactorRanking(rankedResults) {

    const tableBody = document.getElementById("topStocksBody");

    if (!tableBody) {
        console.error("topStocksBody not found");
        return;
    }

    const top10 = rankedResults.slice(0, 10);

    tableBody.innerHTML = top10.map((stock, index) => {

        const score = Number(stock.finalFactorScore ?? 0);

        let direction = "Neutral";

        if (score >= 7) {
            direction = "Bullish";
        } else if (score <= 4) {
            direction = "Bearish";
        }

        let confidence = "Low";

        if (score >= 8) {
            confidence = "High";
        } else if (score >= 6) {
            confidence = "Medium";
        }

        return `
            <tr>
                <td>
                    <strong>${index + 1}</strong>
                </td>

                <td>
                    <strong>${stock.symbol}</strong>
                </td>

                <td>
                    ₹${Number(stock.price ?? 0).toFixed(2)}
                </td>

                <td>
                    <strong>${score.toFixed(1)}</strong>
                </td>

                <td>
                    ${direction}
                </td>

                <td>
                    ${confidence}
                </td>

                <td>
                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="showStockDetails('${stock.symbol}')">
                        View
                    </button>
                </td>
            </tr>
        `;

    }).join("");
}

function renderTop10Stocks(rankedResults) {
    const tableBody = document.getElementById("topStocksBody");

    if (!tableBody) {
        console.error("topStocksBody not found");
        return;
    }

    const top10 = rankedResults.slice(0, 10);

    tableBody.innerHTML = top10.map((stock, index) => `
        <tr>
            <td><strong>${index + 1}</strong></td>

            <td>
                <strong>${stock.symbol}</strong>
            </td>

            <td>
                ₹${Number(stock.price ?? 0).toFixed(2)}
            </td>

            <td>
                <strong>${Number(stock.finalFactorScore ?? 0).toFixed(1)}</strong>
            </td>

            <td>
                ${stock.finalFactorScore >= 6 ? "Bullish" : "Neutral"}
            </td>

            <td>
                ${Number(stock.finalFactorScore ?? 0) >= 7 ? "High" :
                  Number(stock.finalFactorScore ?? 0) >= 5 ? "Medium" : "Low"}
            </td>

            <td>
                <button class="btn btn-sm btn-outline-primary">
                    View
                </button>
            </td>
        </tr>
    `).join("");
}
// ==========================================
// UPDATE INDIVIDUAL STOCK CARDS
// ==========================================

function renderSelectedStock(result) {

    if (!result) {
        return;
    }


    const price =
        document.getElementById(
            "analysisPrice"
        );

    const dailyChange =
        document.getElementById(
            "analysisDailyChange"
        );

    const return5 =
        document.getElementById(
            "analysisReturn5"
        );

    const return20 =
        document.getElementById(
            "analysisReturn20"
        );

    const ma20 =
        document.getElementById(
            "analysisMA20"
        );

    const ma50 =
        document.getElementById(
            "analysisMA50"
        );

    const rsi =
        document.getElementById(
            "analysisRSI"
        );

    const volumeRatio =
        document.getElementById(
            "analysisVolumeRatio"
        );

    const priceVsMA20 =
        document.getElementById(
            "analysisPriceVsMA20"
        );

    const priceVsMA50 =
        document.getElementById(
            "analysisPriceVsMA50"
        );

    const status =
        document.getElementById(
            "analysisStatus"
        );


    if (!result.valid) {

        if (status) {

            status.innerHTML = `

                <div class="alert alert-danger">
                    ${result.symbol}: 
                    ${result.message}
                </div>

            `;
        }

        return;
    }


    if (price) {
        price.textContent =
            `₹${formatNumber(result.price)}`;
    }


    if (dailyChange) {

        dailyChange.textContent =
            formatPercent(
                result.dailyChange
            );

        dailyChange.className =
            percentageClass(
                result.dailyChange
            );
    }


    if (return5) {

        return5.textContent =
            formatPercent(
                result.return5
            );

        return5.className =
            percentageClass(
                result.return5
            );
    }


    if (return20) {

        return20.textContent =
            formatPercent(
                result.return20
            );

        return20.className =
            percentageClass(
                result.return20
            );
    }


    if (ma20) {
        ma20.textContent =
            formatNumber(result.ma20);
    }


    if (ma50) {
        ma50.textContent =
            formatNumber(result.ma50);
    }


    if (rsi) {

        rsi.textContent =
            formatNumber(result.rsi);

        rsi.className =
            rsiClass(result.rsi);
    }


    if (volumeRatio) {

        volumeRatio.textContent =
            `${formatNumber(
                result.volumeRatio,
                2
            )}x`;
    }


    if (priceVsMA20) {

        priceVsMA20.textContent =
            formatPercent(
                result.priceVsMA20
            );

        priceVsMA20.className =
            percentageClass(
                result.priceVsMA20
            );
    }


    if (priceVsMA50) {

        priceVsMA50.textContent =
            formatPercent(
                result.priceVsMA50
            );

        priceVsMA50.className =
            percentageClass(
                result.priceVsMA50
            );
    }


    if (status) {

        status.innerHTML = `

            <div class="alert alert-success">
                ${result.symbol} analysis loaded
                for ${result.date}.
            </div>

        `;
    }
}


// ==========================================
// RUN COMPLETE NIFTY 50 ANALYSIS
// ==========================================

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

       const results =
    await analyzeAllStocks();

const resultsWithFactors =
    results.map(
        result => addFactorScores(result)
    );


      


const rankedResults =
    rankStocksByFactorScore(resultsWithFactors);
const top10Stocks = rankedResults.slice(0, 10);

console.table(
    top10Stocks.map((stock, index) => ({
        rank: index + 1,
        symbol: stock.symbol,
        trend: stock.factorTrend,
        volume: stock.factorVolume,
        support: stock.factorSupport,
        technical: stock.factorTechnical,
        candle: stock.factorCandle,
        nifty: stock.factorNifty,
        sector: stock.factorSector,
        news: stock.factorNews,
        fno: stock.factorFno,
        sentiment: stock.factorSentiment,
        finalScore: stock.finalFactorScore
    }))
);
 console.log("ONE RANKED STOCK FULL:", JSON.stringify(rankedResults[0], null, 2));

renderFactorRanking(rankedResults);

// NEW — render Top 10 table
renderTop10Stocks(rankedResults);

// Render table
renderStockAnalysis(
    resultsWithFactors
);


// Update summary
updateSummary(
    resultsWithFactors
);


        // ----------------------------------
        // Load selected stock
        // ----------------------------------

        const selectedSymbol =
            stockSelector
                ? stockSelector.value
                : "TCS";


        const selectedResult =
    resultsWithFactors.find(
        result =>
            result.symbol === selectedSymbol
    );


        if (selectedResult) {

            renderSelectedStock(
                selectedResult
            );
            displayFactorScores(selectedResult);

     } else if (resultsWithFactors.length > 0) {

    renderSelectedStock(
        resultsWithFactors[0]
    );

    displayFactorScores(
        resultsWithFactors[0]
    );
}


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


// ==========================================
// RUN ANALYSIS BUTTON
// ==========================================

if (runAnalysisBtn) {

    runAnalysisBtn.addEventListener(
        "click",
        runNifty50Analysis
    );
}


// ==========================================
// STOCK SELECTOR
// ==========================================

if (stockSelector) {

    stockSelector.addEventListener(
        "change",
        async () => {

            const symbol =
                stockSelector.value;


            const result =
                await analyzeStock(symbol);


            renderSelectedStock(result);
        }
    );
}


// ==========================================
// POPULATE STOCK SELECTOR WITH 50 STOCKS
// ==========================================

if (stockSelector) {

    stockSelector.innerHTML = "";


    NIFTY50_STOCKS.forEach(
        symbol => {

            const option =
                document.createElement("option");

            option.value =
                symbol;

            option.textContent =
                symbol;

            stockSelector.appendChild(
                option
            );
        }
    );


    // Default
    if (
        NIFTY50_STOCKS.includes("TCS")
    ) {

        stockSelector.value =
            "TCS";
    }
}


// ==========================================
// IMPORTANT
// ==========================================
//
// NO analysis runs automatically here.
//
// User must click:
// "Run Analysis"
//
// ==========================================


// ==========================================
// Factor Analysis - Factors 1 to 4
// ==========================================

console.log("Factor Analysis - Factors 1-4 loaded");

// ==========================================
// COMMON HELPERS
// ==========================================

function clampScore(value) {

    if (!Number.isFinite(value)) {
        return 5;
    }

    return Math.max(0, Math.min(10, value));

}


// ==========================================
// FACTOR 1
// PRICE TREND
// ==========================================

function calculateTrendScore(result) {

    let score = 5;

    // 5-day return
    if (result.return5 >= 3) {
        score += 1.5;
    } else if (result.return5 >= 1) {
        score += 1;
    } else if (result.return5 >= 0) {
        score += 0.5;
    } else if (result.return5 <= -3) {
        score -= 1.5;
    } else if (result.return5 <= -1) {
        score -= 1;
    } else {
        score -= 0.5;
    }


    // 20-day return
    if (result.return20 >= 8) {
        score += 1.5;
    } else if (result.return20 >= 3) {
        score += 1;
    } else if (result.return20 >= 0) {
        score += 0.5;
    } else if (result.return20 <= -8) {
        score -= 1.5;
    } else if (result.return20 <= -3) {
        score -= 1;
    } else {
        score -= 0.5;
    }


    // Price vs MA20
    if (result.priceVsMA20 >= 5) {
        score += 1;
    } else if (result.priceVsMA20 >= 0) {
        score += 0.5;
    } else if (result.priceVsMA20 <= -5) {
        score -= 1;
    } else {
        score -= 0.5;
    }


    // Price vs MA50
    if (result.priceVsMA50 >= 5) {
        score += 1;
    } else if (result.priceVsMA50 >= 0) {
        score += 0.5;
    } else if (result.priceVsMA50 <= -5) {
        score -= 1;
    } else {
        score -= 0.5;
    }


    return Math.round(clampScore(score));
}


// ==========================================
// FACTOR 2
// VOLUME
// ==========================================

function calculateVolumeScore(result) {

    const ratio = result.volumeRatio;

    if (!Number.isFinite(ratio)) {
        return 5;
    }


    if (ratio >= 2.0) {
        return 10;
    }

    if (ratio >= 1.5) {
        return 9;
    }

    if (ratio >= 1.25) {
        return 8;
    }

    if (ratio >= 1.0) {
        return 7;
    }

    if (ratio >= 0.8) {
        return 6;
    }

    if (ratio >= 0.6) {
        return 5;
    }

    if (ratio >= 0.4) {
        return 4;
    }

    if (ratio >= 0.2) {
        return 3;
    }

    return 2;
}


// ==========================================
// FACTOR 3
// SUPPORT & RESISTANCE
// ==========================================

function calculateSupportScore(result) {

    const price = result.price;
    const recentHigh = result.recentHigh;

    if (
        !Number.isFinite(price) ||
        !Number.isFinite(recentHigh) ||
        recentHigh <= 0
    ) {
        return 5;
    }


    // Distance from 20-day high
    const distanceFromHigh =
        ((recentHigh - price) / recentHigh) * 100;


    /*
        Interpretation:

        Very close to high:
        Strong momentum / breakout potential.

        Moderate distance:
        Neutral.

        Far below high:
        Weakness.
    */


    if (distanceFromHigh <= 1) {
        return 10;
    }

    if (distanceFromHigh <= 2) {
        return 9;
    }

    if (distanceFromHigh <= 4) {
        return 8;
    }

    if (distanceFromHigh <= 6) {
        return 7;
    }

    if (distanceFromHigh <= 8) {
        return 6;
    }

    if (distanceFromHigh <= 10) {
        return 5;
    }

    if (distanceFromHigh <= 15) {
        return 4;
    }

    if (distanceFromHigh <= 20) {
        return 3;
    }

    return 2;
}


// ==========================================
// FACTOR 4
// TECHNICAL INDICATORS
// ==========================================

function calculateTechnicalScore(result) {

    let score = 5;


    // --------------------------------------
    // RSI
    // --------------------------------------

    const rsi = result.rsi;

    if (Number.isFinite(rsi)) {

        if (rsi >= 50 && rsi < 65) {
            score += 1.5;
        }

        else if (rsi >= 65 && rsi < 70) {
            score += 1;
        }

        else if (rsi >= 70) {
            // Overbought
            score -= 1;
        }

        else if (rsi >= 40) {
            score += 0.5;
        }

        else if (rsi >= 30) {
            score -= 0.5;
        }

        else {
            // Oversold
            score -= 1;
        }
    }


    // --------------------------------------
    // PRICE vs MA20
    // --------------------------------------

    if (Number.isFinite(result.priceVsMA20)) {

        if (result.priceVsMA20 >= 5) {
            score += 1;
        }

        else if (result.priceVsMA20 >= 0) {
            score += 0.5;
        }

        else if (result.priceVsMA20 <= -5) {
            score -= 1;
        }

        else {
            score -= 0.5;
        }
    }


    // --------------------------------------
    // PRICE vs MA50
    // --------------------------------------

    if (Number.isFinite(result.priceVsMA50)) {

        if (result.priceVsMA50 >= 5) {
            score += 1;
        }

        else if (result.priceVsMA50 >= 0) {
            score += 0.5;
        }

        else if (result.priceVsMA50 <= -5) {
            score -= 1;
        }

        else {
            score -= 0.5;
        }
    }


    return Math.round(clampScore(score));
}


// ==========================================
// FACTOR 5
// CANDLESTICK PATTERN
// ==========================================

function calculateCandleScore(result) {

    /*
     * Current stock result contains dailyChange,
     * but does not yet contain Open / High / Low.
     *
     * Therefore we use the available short-term price
     * behaviour as a temporary candle-strength proxy.
     *
     * Later we can replace this with actual:
     * Open, High, Low, Close candle analysis.
     */

    const daily = result.dailyChange;
    const return5 = result.return5;

    if (
        !Number.isFinite(daily) ||
        !Number.isFinite(return5)
    ) {
        return 5;
    }

    let score = 5;

    // Strong positive recent candle behaviour
    if (daily >= 2) {
        score += 2;
    } else if (daily >= 1) {
        score += 1;
    } else if (daily > 0) {
        score += 0.5;
    }

    // Weak / bearish recent behaviour
    else if (daily <= -2) {
        score -= 2;
    } else if (daily <= -1) {
        score -= 1;
    } else if (daily < 0) {
        score -= 0.5;
    }

    // Confirm with 5-day return
    if (return5 >= 3) {
        score += 1;
    } else if (return5 >= 1) {
        score += 0.5;
    } else if (return5 <= -3) {
        score -= 1;
    } else if (return5 <= -1) {
        score -= 0.5;
    }

    return Math.round(clampScore(score));
}


// ==========================================
// FACTOR 6
// NIFTY TREND
// ==========================================

function calculateNiftyScore(result) {

    if (!Number.isFinite(result.niftyChange)) {
        return 5;
    }

    const change = result.niftyChange;

    if (change >= 1.5) return 10;
    if (change >= 0.75) return 9;
    if (change >= 0.25) return 8;
    if (change > 0) return 7;

    if (change === 0) return 5;

    if (change > -0.5) return 4;
    if (change > -1.0) return 3;
    if (change > -1.5) return 2;

    return 1;
}

// ==========================================
// FACTOR 7
// SECTOR STRENGTH
// ==========================================

function calculateSectorScore(result) {

    if (!Number.isFinite(result.sectorChange)) {
        return 5;
    }

    const change = result.sectorChange;

    if (change >= 1.5) return 10;
    if (change >= 0.75) return 9;
    if (change >= 0.25) return 8;
    if (change > 0) return 7;

    if (change === 0) return 5;

    if (change > -0.5) return 4;
    if (change > -1.0) return 3;
    if (change > -1.5) return 2;

    return 1;
}

// ==========================================
// FACTOR 8
// NEWS
// ==========================================

function calculateNewsScore(result) {

    /*
     * News data is not currently connected to the
     * stock analysis system.
     *
     * Do NOT randomly score news.
     *
     * Neutral = 5 until a real news source is connected.
     */

    if (Number.isFinite(result.newsScore)) {
        return Math.round(
            clampScore(result.newsScore)
        );
    }

    return 5;
}


// ==========================================
// FACTOR 9
// F&O / OPEN INTEREST
// ==========================================

function calculateFnoScore(result) {

    // --------------------------------------------------------
    // No F&O data
    // --------------------------------------------------------

    if (
        !result ||
        !Array.isArray(result.fnoData) ||
        result.fnoData.length === 0
    ) {
        return 5;
    }


    // --------------------------------------------------------
    // Normalize column names
    // --------------------------------------------------------

    const rows =
        result.fnoData.map(row => {

            const normalized = {};

            Object.keys(row).forEach(key => {

                const cleanKey =
                    String(key)
                        .trim()
                        .toUpperCase()
                        .replace(/_/g, "");

                normalized[cleanKey] =
                    row[key];
            });

            return normalized;
        });


    // --------------------------------------------------------
    // Helper
    // --------------------------------------------------------

    const numberValue = value => {

        const n =
            Number(
                String(value)
                    .replace(/,/g, "")
                    .trim()
            );

        return Number.isFinite(n)
            ? n
            : 0;
    };


    // --------------------------------------------------------
    // Separate Futures / Options
    // --------------------------------------------------------

    const futures = rows.filter(row => {

        const optionType =
            String(
                row.OPTNTP ?? ""
            )
            .trim()
            .toUpperCase();

        const instrument =
            String(
                row.FININSTRMTP ?? ""
            )
            .trim()
            .toUpperCase();

        const name =
            String(
                row.FININSTRMNM ?? ""
            )
            .trim()
            .toUpperCase();

        // Options have CE / PE
        if (
            optionType === "CE" ||
            optionType === "PE"
        ) {
            return false;
        }

        // Futures are generally identifiable
        // through instrument/name
        return (
            instrument.includes("FUT") ||
            name.includes("FUT")
        );
    });


    const calls = rows.filter(row => {

        return String(
            row.OPTNTP ?? ""
        )
        .trim()
        .toUpperCase() === "CE";

    });


    const puts = rows.filter(row => {

        return String(
            row.OPTNTP ?? ""
        )
        .trim()
        .toUpperCase() === "PE";

    });


    // --------------------------------------------------------
    // Futures OI
    // --------------------------------------------------------

    let futuresOI = 0;

    let futuresOIChange = 0;

    let futuresVolume = 0;


    futures.forEach(row => {

        futuresOI +=
            numberValue(
                row.OPNINTRST
            );

        futuresOIChange +=
            numberValue(
                row.CHNGINOPNINTRST
            );

        futuresVolume +=
            numberValue(
                row.TTLTRADGVOL
            );

    });


    // --------------------------------------------------------
    // Call / Put OI
    // --------------------------------------------------------

    let callOI = 0;

    let putOI = 0;

    let callOIChange = 0;

    let putOIChange = 0;

    let optionVolume = 0;


    calls.forEach(row => {

        callOI +=
            numberValue(
                row.OPNINTRST
            );

        callOIChange +=
            numberValue(
                row.CHNGINOPNINTRST
            );

        optionVolume +=
            numberValue(
                row.TTLTRADGVOL
            );

    });


    puts.forEach(row => {

        putOI +=
            numberValue(
                row.OPNINTRST
            );

        putOIChange +=
            numberValue(
                row.CHNGINOPNINTRST
            );

        optionVolume +=
            numberValue(
                row.TTLTRADGVOL
            );

    });


    // --------------------------------------------------------
    // Put / Call Ratio
    // --------------------------------------------------------

    let pcr = 1;

    if (callOI > 0) {

        pcr =
            putOI / callOI;
    }


    // --------------------------------------------------------
    // F&O activity
    // --------------------------------------------------------

    const totalOI =
        futuresOI +
        callOI +
        putOI;

    const totalVolume =
        futuresVolume +
        optionVolume;


    // --------------------------------------------------------
    // 1. FUTURES POSITIONING SCORE
    // --------------------------------------------------------

    let futuresScore = 5;


    if (
        futuresOI > 0 &&
        Number.isFinite(result.dailyChange)
    ) {

        const priceUp =
            result.dailyChange > 0;

        const priceDown =
            result.dailyChange < 0;

        const oiUp =
            futuresOIChange > 0;

        const oiDown =
            futuresOIChange < 0;


        // Long buildup
        if (
            priceUp &&
            oiUp
        ) {
            futuresScore = 9;
        }

        // Short buildup
        else if (
            priceDown &&
            oiUp
        ) {
            futuresScore = 2;
        }

        // Short covering
        else if (
            priceUp &&
            oiDown
        ) {
            futuresScore = 8;
        }

        // Long unwinding
        else if (
            priceDown &&
            oiDown
        ) {
            futuresScore = 4;
        }
    }


    // --------------------------------------------------------
    // 2. PCR SCORE
    // --------------------------------------------------------

    let pcrScore = 5;


    if (callOI > 0 && putOI > 0) {

        if (pcr >= 1.30) {

            pcrScore = 9;

        } else if (pcr >= 1.10) {

            pcrScore = 8;

        } else if (pcr >= 0.90) {

            pcrScore = 6;

        } else if (pcr >= 0.70) {

            pcrScore = 4;

        } else {

            pcrScore = 2;
        }
    }


    // --------------------------------------------------------
    // 3. DERIVATIVES ACTIVITY SCORE
    // --------------------------------------------------------

    let activityScore = 5;


    if (totalOI > 0 && totalVolume > 0) {

        const volumeToOI =
            totalVolume /
            totalOI;


        if (volumeToOI >= 0.50) {

            activityScore = 9;

        } else if (volumeToOI >= 0.25) {

            activityScore = 8;

        } else if (volumeToOI >= 0.10) {

            activityScore = 7;

        } else if (volumeToOI >= 0.05) {

            activityScore = 6;

        } else {

            activityScore = 5;
        }
    }


    // --------------------------------------------------------
    // FINAL F&O SCORE
    // --------------------------------------------------------

    const finalScore =
        (
            futuresScore * 0.45
        ) +
        (
            pcrScore * 0.35
        ) +
        (
            activityScore * 0.20
        );


    return Math.round(
        Math.max(
            1,
            Math.min(
                10,
                finalScore
            )
        )
    );
}

// ==========================================
// FACTOR 10
// MARKET SENTIMENT
// ==========================================

function calculateSentimentScore(result) {

    /*
     * Until real market-sentiment data is connected,
     * derive a basic sentiment score from the stock's
     * existing technical behaviour.
     */

    let score = 5;

    if (Number.isFinite(result.return5)) {

        if (result.return5 >= 3) {
            score += 1.5;
        } else if (result.return5 >= 1) {
            score += 1;
        } else if (result.return5 > 0) {
            score += 0.5;
        } else if (result.return5 <= -3) {
            score -= 1.5;
        } else if (result.return5 <= -1) {
            score -= 1;
        } else {
            score -= 0.5;
        }
    }

    if (Number.isFinite(result.return20)) {

        if (result.return20 >= 8) {
            score += 1;
        } else if (result.return20 >= 3) {
            score += 0.5;
        } else if (result.return20 <= -8) {
            score -= 1;
        } else if (result.return20 <= -3) {
            score -= 0.5;
        }
    }

    return Math.round(clampScore(score));
}

// ==========================================
// CALCULATE ALL 10 FACTORS
// ==========================================

function calculateFactors(result) {

    if (!result || !result.valid) {

        return {
            factorTrend: 5,
            factorVolume: 5,
            factorSupport: 5,
            factorTechnical: 5,

            factorCandle: 5,
            factorNifty: 5,
            factorSector: 5,
            factorNews: 5,
            factorFno: 5,
            factorSentiment: 5
        };
    }


    return {

        // Factors 1-4
        factorTrend:
            calculateTrendScore(result),

        factorVolume:
            calculateVolumeScore(result),

        factorSupport:
            calculateSupportScore(result),

        factorTechnical:
            calculateTechnicalScore(result),


        // Factors 5-10
        factorCandle:
            calculateCandleScore(result),

        factorNifty:
            calculateNiftyScore(result),

        factorSector:
            calculateSectorScore(result),

        factorNews:
            calculateNewsScore(result),

        factorFno:
            calculateFnoScore(result),

        factorSentiment:
            calculateSentimentScore(result)

    };
}


// ==========================================
// ADD FACTORS TO STOCK RESULT
// ==========================================

function addFactorScores(result) {

    const factors =
        calculateFactors(result);

    return {

        ...result,

        ...factors

    };
}


// ==========================================
// DASHBOARD DISPLAY - ALL 10 FACTORS
// ==========================================

function displayFactorScores(result) {

    if (!result) {
        return;
    }


    const factorElements = {

        factorTrend:
            document.getElementById("factorTrend"),

        factorVolume:
            document.getElementById("factorVolume"),

        factorSupport:
            document.getElementById("factorSupport"),

        factorTechnical:
            document.getElementById("factorTechnical"),

        factorCandle:
            document.getElementById("factorCandle"),

        factorNifty:
            document.getElementById("factorNifty"),

        factorSector:
            document.getElementById("factorSector"),

        factorNews:
            document.getElementById("factorNews"),

        factorFno:
            document.getElementById("factorFno"),

        factorSentiment:
            document.getElementById("factorSentiment")
    };


    Object.entries(factorElements).forEach(
        ([key, element]) => {

            if (element) {

                element.textContent =
                    `${result[key] ?? "--"} / 10`;
            }
        }
    );
}

// ==========================================
// FINAL 10-FACTOR SCORE
// ==========================================

function calculateFinalFactorScore(result) {

    if (!result) {
        return 5;
    }

    const factors = [
        result.factorTrend,
        result.factorVolume,
        result.factorSupport,
        result.factorTechnical,
        result.factorCandle,
        result.factorNifty,
        result.factorSector,
        result.factorNews,
        result.factorFno,
        result.factorSentiment
    ];

    const validFactors = factors.filter(
        value => Number.isFinite(value)
    );

    if (validFactors.length === 0) {
        return 5;
    }

    const total =
        validFactors.reduce(
            (sum, value) => sum + value,
            0
        );

    return Number(
        (total / validFactors.length).toFixed(2)
    );
}


// ==========================================
// ADD FINAL SCORE TO STOCK RESULT
// ==========================================

function addFinalFactorScore(result) {

    return {
        ...result,
        finalFactorScore:
            calculateFinalFactorScore(result)
    };
}


// ==========================================
// RANK ALL STOCKS
// ==========================================

function rankStocksByFactorScore(results) {

    if (!Array.isArray(results)) {
        return [];
    }

    return results
        .filter(result => result.valid)
        .map(result =>
            addFinalFactorScore(result)
        )
        .sort(
            (a, b) =>
                b.finalFactorScore -
                a.finalFactorScore
        );
}

// ==========================================
// EXPORT FUNCTIONS
// ==========================================

export {

    // Factors 1-4
    calculateTrendScore,
    calculateVolumeScore,
    calculateSupportScore,
    calculateTechnicalScore,

    // Factors 5-10
    calculateCandleScore,
    calculateNiftyScore,
    calculateSectorScore,
    calculateNewsScore,
    calculateFnoScore,
    calculateSentimentScore,

    // Combined
    calculateFactors,
    addFactorScores,
    displayFactorScores,

    // Final scoring & ranking
    calculateFinalFactorScore,
    addFinalFactorScore,
    rankStocksByFactorScore

};

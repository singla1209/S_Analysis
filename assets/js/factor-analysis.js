
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

    /*
     * NIFTY-specific data is not yet being supplied
     * by stock-analysis.js.
     *
     * Therefore keep this factor neutral instead of
     * inventing a NIFTY value.
     */

    if (Number.isFinite(result.niftyScore)) {
        return Math.round(
            clampScore(result.niftyScore)
        );
    }

    return 5;
}


// ==========================================
// FACTOR 7
// SECTOR STRENGTH
// ==========================================

function calculateSectorScore(result) {

    /*
     * Sector comparison requires sector data for all
     * stocks. That data is not currently present in
     * the result object.
     *
     * If sectorScore is supplied later, use it.
     * Otherwise remain neutral.
     */

    if (Number.isFinite(result.sectorScore)) {
        return Math.round(
            clampScore(result.sectorScore)
        );
    }

    return 5;
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

    /*
     * F&O / Open Interest data is not currently
     * available in the stock result.
     *
     * Keep neutral until real OI data is connected.
     */

    if (Number.isFinite(result.fnoScore)) {
        return Math.round(
            clampScore(result.fnoScore)
        );
    }

    return 5;
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
    displayFactorScores

};

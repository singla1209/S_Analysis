
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
// CALCULATE ALL FOUR FACTORS
// ==========================================

function calculateFactors(result) {

    if (!result || !result.valid) {

        return {
            factorTrend: 5,
            factorVolume: 5,
            factorSupport: 5,
            factorTechnical: 5
        };
    }


    return {

        factorTrend:
            calculateTrendScore(result),

        factorVolume:
            calculateVolumeScore(result),

        factorSupport:
            calculateSupportScore(result),

        factorTechnical:
            calculateTechnicalScore(result)

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
// DASHBOARD DISPLAY
// ==========================================

function displayFactorScores(result) {

    if (!result) {
        return;
    }


    const factorTrend =
        document.getElementById("factorTrend");

    const factorVolume =
        document.getElementById("factorVolume");

    const factorSupport =
        document.getElementById("factorSupport");

    const factorTechnical =
        document.getElementById("factorTechnical");


    if (factorTrend) {

        factorTrend.textContent =
            `${result.factorTrend ?? "--"} / 10`;
    }


    if (factorVolume) {

        factorVolume.textContent =
            `${result.factorVolume ?? "--"} / 10`;
    }


    if (factorSupport) {

        factorSupport.textContent =
            `${result.factorSupport ?? "--"} / 10`;
    }


    if (factorTechnical) {

        factorTechnical.textContent =
            `${result.factorTechnical ?? "--"} / 10`;
    }

}


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

export {

    calculateTrendScore,
    calculateVolumeScore,
    calculateSupportScore,
    calculateTechnicalScore,
    calculateFactors,
    addFactorScores,
    displayFactorScores

};
```

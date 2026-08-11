// ============================================================
// NIFTY 50 STOCK → AVAILABLE INDEX MAPPING
// ============================================================

const STOCK_SECTORS = {

    // ---------------- BANK ----------------
    "AXISBANK": "BANK",
    "HDFCBANK": "BANK",
    "ICICIBANK": "BANK",
    "KOTAKBANK": "BANK",

    // ---------------- PSU BANK ----------------
    "SBIN": "PSU_BANK",

    // ---------------- FINANCIAL SERVICES ----------------
    "BAJAJFINSV": "FINANCE",
    "BAJFINANCE": "FINANCE",
    "JIOFIN": "FINANCE",
    "SBILIFE": "FINANCE",
    "SHRIRAMFIN": "FINANCE",

    // ---------------- IT ----------------
    "HCLTECH": "IT",
    "INFY": "IT",
    "TCS": "IT",
    "TECHM": "IT",
    "WIPRO": "IT",

    // ---------------- AUTO ----------------
    "BAJAJ-AUTO": "AUTO",
    "EICHERMOT": "AUTO",
    "M&M": "AUTO",
    "MARUTI": "AUTO",
    "TMPV": "AUTO",

    // ---------------- PHARMA ----------------
    "CIPLA": "PHARMA",
    "DRREDDY": "PHARMA",
    "SUNPHARMA": "PHARMA",
    "MAXHEALTH": "PHARMA",

    // ---------------- FMCG ----------------
    "HINDUNILVR": "FMCG",
    "ITC": "FMCG",
    "NESTLEIND": "FMCG",
    "TATACONSUM": "FMCG",

    // ---------------- METAL ----------------
    "HINDALCO": "METAL",
    "JSWSTEEL": "METAL",
    "TATASTEEL": "METAL",

    // ---------------- ENERGY ----------------
    "ONGC": "ENERGY",
    "RELIANCE": "ENERGY",
    "NTPC": "ENERGY",

    // ---------------- INFRASTRUCTURE ----------------
    "LT": "INFRA",
    "POWERGRID": "INFRA",
    "ADANIPORTS": "INFRA",

    // ---------------- NO MATCHING DOWNLOADED INDEX ----------------
    "GRASIM": null,
    "ULTRACEMCO": null,
    "BHARTIARTL": null,
    "BEL": null,
    "ASIANPAINT": null,
    "TITAN": null,
    "TRENT": null,
    "INDIGO": null,
    "ADANIENT": null
};


// ============================================================
// SECTOR → DOWNLOADED INDEX FILE
// ============================================================

const SECTOR_INDEX_FILES = {

    BANK: "NIFTY_BANK.csv",

    PSU_BANK: "NIFTY_PSU_BANK.csv",

    FINANCE: "NIFTY_FIN_SERVICE.csv",

    IT: "NIFTY_IT.csv",

    AUTO: "NIFTY_AUTO.csv",

    PHARMA: "NIFTY_PHARMA.csv",

    FMCG: "NIFTY_FMCG.csv",

    METAL: "NIFTY_METAL.csv",

    ENERGY: "NIFTY_ENERGY.csv",

    INFRA: "NIFTY_INFRA.csv",

    MEDIA: "NIFTY_MEDIA.csv",

    MNC: "NIFTY_MNC.csv",

    REALTY: "NIFTY_REALTY.csv"
};


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getStockSector(symbol) {
    return STOCK_SECTORS[symbol] || null;
}

function getSectorIndexFile(sector) {
    return SECTOR_INDEX_FILES[sector] || null;
}


// ============================================================
// EXPORTS
// ============================================================

export {
    getStockSector,
    getSectorIndexFile
};

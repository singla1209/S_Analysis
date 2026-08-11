
// ============================================================
// NIFTY 50 STOCK → SECTOR MAPPING
// ============================================================

const STOCK_SECTORS = {

    // ---------------- BANKING ----------------
    "AXISBANK": "BANK",
    "HDFCBANK": "BANK",
    "ICICIBANK": "BANK",
    "KOTAKBANK": "BANK",
    "SBIN": "BANK",

    // ---------------- FINANCIAL SERVICES ----------------
    "BAJAJFINSV": "FINANCE",
    "BAJFINANCE": "FINANCE",
    "JIOFIN": "FINANCE",
    "SBILIFE": "FINANCE",

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

    // ---------------- FMCG ----------------
    "HINDUNILVR": "FMCG",
    "ITC": "FMCG",
    "NESTLEIND": "FMCG",
    "TATACONSUM": "FMCG",

    // ---------------- METALS ----------------
    "HINDALCO": "METAL",
    "JSWSTEEL": "METAL",
    "TATASTEEL": "METAL",

    // ---------------- ENERGY / OIL ----------------
    "ONGC": "ENERGY",
    "RELIANCE": "ENERGY",

    // ---------------- INFRASTRUCTURE ----------------
    "LT": "INFRA",
    "POWERGRID": "INFRA",

    // ---------------- CEMENT ----------------
    "GRASIM": "CEMENT",
    "ULTRACEMCO": "CEMENT",

    // ---------------- TELECOM ----------------
    "BHARTIARTL": "TELECOM",

    // ---------------- DEFENCE ----------------
    "BEL": "DEFENCE",

    // ---------------- CONSUMER / RETAIL ----------------
    "ASIANPAINT": "CONSUMER",
    "TITAN": "CONSUMER",
    "TRENT": "CONSUMER",

    // ---------------- AVIATION ----------------
    "INDIGO": "AVIATION",

    // ---------------- INDUSTRIAL ----------------
    "ADANIENT": "INDUSTRIAL",

    // ---------------- PORTS / INFRA ----------------
    "ADANIPORTS": "INFRA",

    // ---------------- POWER ----------------
    "NTPC": "ENERGY",

    // ---------------- MAX HEALTHCARE ----------------
    "MAXHEALTH": "PHARMA",

    // ---------------- SHRIRAM FINANCE ----------------
    "SHRIRAMFIN": "FINANCE"
};


// ============================================================
// SECTOR → DOWNLOADED INDEX FILE
// ============================================================

const SECTOR_INDEX_FILES = {

    BANK: "NIFTY_BANK.csv",
    IT: "NIFTY_IT.csv",
    AUTO: "NIFTY_AUTO.csv",
    PHARMA: "NIFTY_PHARMA.csv",
    FMCG: "NIFTY_FMCG.csv",
    METAL: "NIFTY_METAL.csv",
    ENERGY: "NIFTY_ENERGY.csv",
    INFRA: "NIFTY_INFRA.csv",
    FINANCE: "NIFTY_FIN_SERVICE.csv",
    CONSUMER: "NIFTY_CONSUMPTION.csv",

    // These don't have a dedicated downloaded index
    // in our current 14-file collection.
    CEMENT: null,
    TELECOM: null,
    DEFENCE: null,
    AVIATION: null,
    INDUSTRIAL: null
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


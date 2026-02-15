/*
 * ============================================
 *  FRC 1792 SCOUTING - PUBLIC CONFIGURATION
 * ============================================
 *
 *  This file contains SAFE PUBLIC DEFAULTS.
 *  It is committed to GitHub so the app loads.
 *
 *  TO CUSTOMIZE FOR YOUR TEAM:
 *  ---------------------------
 *  Option 1: Create js/config.local.js (recommended)
 *    - Copy js/config.template.js to js/config.local.js
 *    - Fill in your real values
 *    - This file is gitignored and stays private
 *
 *  Option 2: Edit this file directly
 *    - Replace the values below
 *    - DO NOT commit your changes to GitHub
 *
 */

const SCOUTING_CONFIG = {
    // Google Apps Script URL (ends with /exec)
    // Get this from: Google Sheet → Extensions → Apps Script → Deploy → Web app
    WEBHOOK_URL: "",

    // The Blue Alliance API key
    // Get this from: thebluealliance.com/account → Read API Keys
    TBA_API_KEY: "",

    // Event code (find at thebluealliance.com — last part of event URL)
    // Example: "2026wiapp" = 2026 Appleton District
    EVENT_KEY: "2026wiapp",

    // Set to false to disable team loading from TBA
    ENABLE_TEAM_LOADING: true,

    // Secret code required to access scouting (client-side gate)
    // The real security is server-side in Apps Script (ALLOWED_CODES)
    SECRET_CODE: ""
};

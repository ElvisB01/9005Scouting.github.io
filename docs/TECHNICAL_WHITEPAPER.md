# Technical Whitepaper

Web app for collecting robot data at FRC competitions. Data submits to Google Sheets. Works offline.

## Architecture

```
Scouts → GitHub Pages (HTML/CSS/JS) → Google Apps Script → Sheets/Drive
         The Blue Alliance API → Team lists
```

## File Structure

```
├── index.html, match-scouting.html, pit-scouting.html
├── css/styles.css
├── js/
│   ├── config.js           # Settings (edit this!)
│   ├── home.js, match-scouting.js, pit-scouting.js
├── appScript/
│   └── combined-scouting-script.js  # Backend
└── images/
```

## Authentication & Security

**Goal:** Public site, protected submissions.

**Client-Side:**
- Home page: enter secret code or click "Demo Mode"
- Valid code → saves `{ authenticated: true, teamCode }` in `sessionStorage`
- Demo mode → saves `{ demo: true }` in `sessionStorage`
- Session expires when tab closes

**Scouting Pages:**
- Check session on load, redirect if missing
- Demo mode: disable validation, block submissions, show banner
- Add `teamCode` to all payloads

**Server-Side:**
- `ALLOWED_CODES` array in Apps Script
- Rejects submissions without valid `teamCode`
- Real security layer (webhook URL is public, but server validates)

**Demo Mode:**
- Disables validation
- Blocks submissions
- Shows "Exit Demo" banner
- Perfect for open alliance

## Configuration

**js/config.js** (shared settings):
```javascript
const SCOUTING_CONFIG = {
    WEBHOOK_URL: "your-apps-script-url/exec",
    TBA_API_KEY: "your-tba-key",
    EVENT_KEY: "2026wiapp",
    ENABLE_TEAM_LOADING: true,
    SECRET_CODE: "rtr1792"
};
```

**appScript/combined-scouting-script.js** (server-side):
```javascript
const ALLOWED_CODES = ["rtr1792", "ally1259"];
```

After editing Apps Script, **redeploy**.

## How It Works

**Match Scouting (5 screens):**
1. Start → Auto → Teleop → Endgame → Submit
2. Validates each screen
3. Sends JSON to Apps Script
4. Writes row to "Match Scouting Data" sheet
5. If offline, saves to localStorage for later

**Pit Scouting (2 screens):**
1. Team Info → Robot Design
2. Takes photo (mobile camera/webcam/file picker)
3. Resizes to 1920px, compresses to JPEG
4. Sends base64 to Apps Script
5. Uploads to Google Drive, inserts `=IMAGE()` in sheet

**Offline Mode:**
- Detects connection status
- Queues failed submissions in localStorage
- Shows "Resend All" button when online
- Prevents duplicates

**Team Loading:**
- Fetches from The Blue Alliance API
- Caches in localStorage
- Falls back to cache if API fails

## Apps Script Backend

One script handles both forms:
- `doPost(e)` – routes by `scoutingType`
- `writeToSheetMatch(data)` – writes match data
- `writeToSheetPit(data)` – writes pit data + photo
- `initializeSheets()` – creates sheets with headers

## Storage Keys

**localStorage:**
- `teamsCache_2026wiapp` – team list
- `scoutQueue_1792_rebuilt_2026` – match queue
- `scoutQueue_1792_pit_2026` – pit queue

**sessionStorage:**
- `scoutSession` – auth state (expires on tab close)

## Styling

CSS custom properties in `css/styles.css`:
```css
--bg: #1a1a1a;
--accent: #0039a2;
--ok: #21c55d;
--danger: #ff3b3b;
```

## Adding Form Fields

1. Add HTML input
2. Add to `state` object (if needed)
3. Add validation
4. Add to `buildPayload()`
5. Add column to Apps Script `writeToSheet___()` function
6. Update sheet headers

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Teams don't load | Check `TBA_API_KEY` and `EVENT_KEY` |
| Submit fails | Check `WEBHOOK_URL` ends `/exec`, deployed to "Anyone" |
| "Invalid team code" | Update `ALLOWED_CODES`, redeploy |
| Code rejected | Check `SECRET_CODE` matches |
| Redirect to home | Session expired, re-enter code |
| Camera won't open | Needs HTTPS and permission |
| Photo missing | Check Apps Script logs |
| Queue won't resend | Check internet, console (F12) |

## Event Day Checklist

- [ ] Update `EVENT_KEY` in `js/config.js`
- [ ] Set `SECRET_CODE` and `ALLOWED_CODES`, redeploy
- [ ] Test submission with secret code
- [ ] Test demo mode (blocks submissions)
- [ ] Verify data in Google Sheet
- [ ] Bookmark site on scout devices
- [ ] Brief scouts on usage
- [ ] Check queued data periodically
- [ ] Backup sheet at end of day

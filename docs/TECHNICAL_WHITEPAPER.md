# FRC 1792 Scouting System - Technical Whitepaper

**Last Updated:** February 10, 2026

---

## What Is This?

A web app that lets scouts collect robot data at FRC competitions. Two modes:
- **Match Scouting** - Record what robots do during matches
- **Pit Scouting** - Document robot specs and take photos

Data goes to Google Sheets for analysis. Works offline.

---

## How It All Connects

```
Scouts on phones/tablets
        |
        v
  GitHub Pages Website
  (HTML + CSS + JS)
        |
        v
Google Apps Script ──> Google Sheets (data)
                   ──> Google Drive (photos)

The Blue Alliance API ──> Loads team lists
```

---

## File Structure

```
├── index.html                  # Home page
├── match-scouting.html         # Match form
├── pit-scouting.html           # Pit form
├── css/styles.css              # All styling
├── js/
│   ├── config.js               # Shared settings (edit this one!)
│   ├── home.js                 # Home page logic
│   ├── match-scouting.js       # Match form logic
│   └── pit-scouting.js         # Pit form logic
├── appScript/
│   └── combined-scouting-script.js  # Google backend
└── images/                     # Logo, field, tower diagrams
```

---

## Authentication & Security System

**Goal:** Keep the site public for open alliance while preventing unauthorized data submissions.

### How It Works

**Client-Side (js/home.js, js/config.js):**
1. Home page shows a code entry screen
2. User enters secret code OR clicks "Demo Mode"
3. Valid code → stores `{ authenticated: true, teamCode: "code" }` in `sessionStorage`
4. Demo mode → stores `{ demo: true }` in `sessionStorage`
5. Session expires when browser tab closes (uses `sessionStorage`, not `localStorage`)

**Scouting Pages (match-scouting.js, pit-scouting.js):**
1. Check `sessionStorage` on load — redirect to home if no session
2. Show demo banner if in demo mode
3. In demo mode: skip all input validation, block all submissions
4. Add `teamCode` field to every payload

**Server-Side (combined-scouting-script.js):**
1. `ALLOWED_CODES` array lists valid team codes
2. `doPost()` checks incoming `data.teamCode` against allowed codes
3. Missing or invalid code → reject with error, don't write to sheet
4. Valid code → proceed with writing data

### Demo Mode Features

- Disables input validation — users can click through all screens freely
- Blocks submissions with toast: "Submissions are disabled in demo mode"
- Shows amber warning banner at top of every scouting page with "Exit Demo" button
- Banner text: "Demo Mode — submissions and input validation are disabled"
- Perfect for open alliance — other teams can explore your full scouting setup
- Session persists across scouting pages but expires when tab closes

### Security Layers

| Layer | What It Does |
|-------|-------------|
| Client-side code entry | Prevents casual unauthorized access |
| Session expiration | Clears access when tab closes |
| Redirect guard | Blocks direct URL access to scouting pages |
| Server-side validation | **Real security** — rejects payloads without valid `teamCode` |

**Why the webhook URL is public:** It's in `js/config.js` on GitHub, but that's okay. The server validates every request, so even if someone bypasses the client, they can't submit without a valid code.

---

## Configuration Reference

Every season (or new event), open **`js/config.js`** — it's the single file that holds all shared settings:

```javascript
const SCOUTING_CONFIG = {
    WEBHOOK_URL: "your-google-apps-script-url/exec",
    TBA_API_KEY: "your-blue-alliance-api-key",
    EVENT_KEY: "2026wiapp",  // your event code
    ENABLE_TEAM_LOADING: true,
    SECRET_CODE: "rtr1792"  // client-side gate (change this!)
};
```

Both `match-scouting.js` and `pit-scouting.js` read from this file automatically.

Also update:
- Team numbers in `match-scouting.html` (search for `<option value=`)
- `ALLOWED_CODES` in `appScript/combined-scouting-script.js` (server-side security):

```javascript
const ALLOWED_CODES = ["rtr1792", "ally1259", "ally5414"];
```

**Important:** After editing the Apps Script, you must **redeploy** it (Deploy → New deployment) for changes to take effect.

---

## How Match Scouting Works

**5 screens:** Start → Auto → Teleop → Endgame → Misc/Submit

Each screen validates before letting you continue. When submitted:
1. Builds a JSON payload with all form data
2. Sends it to Google Apps Script via POST
3. Apps Script writes a row to the "Match Scouting Data" sheet
4. If offline, data saves to browser localStorage and can be resent later

**Key columns in the sheet:** Timestamp, Scout, Event, Match #, Team #, Alliance, Auto Fuel, Auto Tower, Teleop Fuel, Endgame Tower, Defense, Comments, Estimated Points.

**Bump/Trench Checkbox Behavior:**
- User can select "Over Bump" and/or "Under Trench" (one or both)
- Selecting either automatically unchecks "None"
- Selecting "None" automatically unchecks both others
- This mutual exclusion is handled by event listeners in `match-scouting.js`

---

## How Pit Scouting Works

**2 screens:** Team Info → Robot Design

Collects: drivetrain, motors, dimensions, programming language, climb ability, hopper, special features, and a robot photo.

**Photo handling:**
- Mobile: Opens native camera app
- Desktop: Opens webcam via browser API
- Fallback: File picker
- Images are resized to max 1920px and compressed to JPEG (85% quality)
- Sent as base64 in the payload

**On the backend:**
1. Apps Script decodes the base64 image
2. Uploads it to a Google Drive folder ("FRC 1792 Robot Photos")
3. Inserts an `=IMAGE()` formula in the sheet so the photo displays inline

---

## How Offline Mode Works

1. App detects connection via `navigator.onLine`
2. Green/red dot shows status in the header
3. If submit fails, data saves to `localStorage` as a queue
4. A yellow alert shows how many items are queued
5. User clicks "Resend All" when back online
6. Duplicate detection prevents sending the same entry twice

**localStorage keys:**
- `teamsCache_2026wiapp` - cached team list
- `scoutQueue_1792_rebuilt_2026` - match queue
- `scoutQueue_1792_pit_2026` - pit queue

**sessionStorage keys:**
- `scoutSession` - auth state `{ authenticated: true, teamCode: "..." }` or `{ demo: true }`
- Expires when browser tab closes (not browser-wide, only that tab)

---

## How Team Loading Works

1. On page load, checks localStorage for cached teams
2. Fetches fresh team list from The Blue Alliance API
3. Updates cache with new data
4. If API fails, uses cached data
5. Autocomplete search filters by team number or name

---

## Google Apps Script Backend

Lives in `appScript/combined-scouting-script.js`. One script handles both forms.

**Main functions:**
- `doPost(e)` - Receives submissions, routes by `scoutingType` field
- `writeToSheetMatch(data)` - Writes match data (39 columns)
- `writeToSheetPit(data)` - Writes pit data + uploads photo (18 columns)
- `initializeSheets()` - Creates sheets with headers
- `clearMatchData()` / `clearPitData()` - Clears data but keeps headers

**To deploy/redeploy:**
1. Open Google Sheet → Extensions → Apps Script
2. Paste the script code
3. Deploy → New deployment → Web app → Execute as Me → Anyone can access
4. Copy the URL (ends with `/exec`)

---

## Styling

All in `css/styles.css`. Uses CSS custom properties for theming:

```css
--bg: #1a1a1a;           /* Dark background */
--accent: #0039a2;        /* Team blue */
--accent-light: #89cff0;  /* Light blue highlights */
--ok: #21c55d;            /* Green (success) */
--danger: #ff3b3b;        /* Red (errors) */
```

Fonts: Oswald for headers, Calibri for body text.

---

## Adding or Changing Form Fields

1. Add HTML input in the `.html` file
2. Add to `state` object in the JS file (if needed)
3. Add validation in the `validate___()` function
4. Add to `buildPayload()` function
5. Add column in Google Apps Script `writeToSheet___()` function
6. Update sheet headers (or delete sheet and let script recreate it)

---

## Common Fixes

| Problem | Solution |
|---------|----------|
| Teams don't load | Check `TBA_API_KEY` and `EVENT_KEY` in `js/config.js` |
| Submit fails | Check `WEBHOOK_URL` in `js/config.js` ends with `/exec` and Apps Script is deployed to "Anyone" |
| "Invalid team code" | Add the code to `ALLOWED_CODES` in Apps Script, then redeploy |
| Secret code rejected | Verify `SECRET_CODE` in `js/config.js` matches what scouts are entering |
| Redirected to home | Session expired (tab closed) or no secret code entered — re-enter code |
| Demo mode allows submit | Bug — demo should show toast blocking submission. Check `IS_DEMO` logic |
| Camera won't open | Must be HTTPS. Grant browser permission. Try file picker instead |
| Photo missing in sheet | Check Apps Script logs (Executions tab) for errors |
| Data in wrong sheet tab | Check `scoutingType: "PIT"` is set in pit scouting payload |
| Queue won't resend | Verify internet. Check console (F12) for errors |

**Debugging:** Open browser console (F12) to see logs. Check Apps Script editor → Executions for backend errors.

---

## Event Day Checklist

- [ ] Update `EVENT_KEY` in `js/config.js`
- [ ] Verify `SECRET_CODE` is set and shared with scouts only
- [ ] Confirm `ALLOWED_CODES` in Apps Script is updated and redeployed
- [ ] Test a submission from a phone with the secret code
- [ ] Test demo mode works (blocks submissions, shows banner)
- [ ] Check data appears in Google Sheet
- [ ] Bookmark site on all scout devices
- [ ] Brief scouts on:
  - How to enter the secret code (first time only per session)
  - How to use the forms
  - What to do if offline (data saves automatically)
- [ ] Check for queued data every few matches
- [ ] Download sheet backup at end of day

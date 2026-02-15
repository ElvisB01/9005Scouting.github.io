# Quick Start Guide

Get the scouting system running in 30 minutes.

---

## Step 1: Get Your Accounts Ready

You need:
- A **GitHub** account
- A **Google** account
- A **Blue Alliance** account (thebluealliance.com)

---

## Step 2: Set Up Google Sheets Backend

1. Create a new Google Sheet
2. Go to **Extensions → Apps Script**
3. Delete the default code
4. Copy everything from `appScript/combined-scouting-script.js` and paste it in
5. Save
6. Click **Deploy → New deployment**
7. Type: **Web app** | Execute as: **Me** | Access: **Anyone**
8. Click Deploy, authorize it, and **copy the URL** (ends with `/exec`)

---

## Step 3: Get a Blue Alliance API Key

1. Go to thebluealliance.com/account
2. Under "Read API Keys", add a new key
3. **Copy the key**

---

## Step 4: Plug In Your Settings

Open **`js/config.js`** and configure these settings:

```javascript
const SCOUTING_CONFIG = {
    WEBHOOK_URL: "paste-your-apps-script-url-here",
    TBA_API_KEY: "paste-your-tba-key-here",
    EVENT_KEY: "2026wiapp",  // change to your event
    ENABLE_TEAM_LOADING: true,
    SECRET_CODE: "rtr1792"  // change to your team's secret code
};
```

**Important:**
- Find your event code at thebluealliance.com — it's the last part of the event URL (e.g., `2026wiapp`)
- **SECRET_CODE** — Choose a code scouts will use to access scouting. Share this only with your team and allied teams.
- Update your team numbers in `match-scouting.html` (search for `<option value=`)

---

## Step 4.5: Configure Server-Side Security

Open **`appScript/combined-scouting-script.js`** and update the allowed codes array:

```javascript
const ALLOWED_CODES = ["rtr1792"];  // Add codes for allied teams
```

**Example for multi-team alliances:**
```javascript
const ALLOWED_CODES = ["rtr1792", "ally1259", "ally5414"];
```

This ensures only authorized teams can submit data, even if someone bypasses the client-side code entry.

After editing, **redeploy** the Apps Script (Deploy → New deployment) for changes to take effect.

---

## Step 5: Deploy to GitHub Pages

1. Push your changes to GitHub
2. Go to repo **Settings → Pages**
3. Set source to **Deploy from a branch**, branch to **main**, folder to **/**
4. Click Save and wait a few minutes, then visit your site

For detailed instructions see the official GitHub Pages docs:
- [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

---

## Step 6: Test

1. Open the site on your phone
2. Submit a test match scouting form — check Google Sheet for the data
3. Submit a test pit scouting form with a photo — check Sheet for data + photo
4. Turn on airplane mode, submit, turn it off, click "Resend All" — data should appear

---

## For Scouts

**First Time Setup:**
1. Open the site and enter your **team code** (ask your team lead if you don't have it)
2. The code is saved for your browser session — you'll need to re-enter it if you close the tab

**Match Scouting:** Pick Match Scouting → Enter your name → pick team → watch match → fill out 5 screens → submit.

**Pit Scouting:** Pick Pit Scouting → Enter your name → pick team → go to their pit → ask questions → take photo → submit.

**If offline:** Data saves automatically. Click "Resend All" when you're back online.

**Demo Mode (for other teams):** Click "Demo Mode" on the home screen to explore the app without submitting data. Perfect for open alliance sharing.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Teams don't load | Check API key and event code in `js/config.js` |
| Submit fails | Check webhook URL ends with `/exec`, Apps Script deployed to "Anyone" |
| "Invalid team code" error | Update `ALLOWED_CODES` in Apps Script, then redeploy |
| Wrong code won't accept | Check `SECRET_CODE` in `js/config.js` matches what scouts are typing |
| Demo mode allows submit | This is a bug — demo mode should block submissions with a toast message |
| Camera won't open | Needs HTTPS. Allow permission. Use file picker as backup |
| 404 on GitHub Pages | Wait 5 min. Clear cache. Check Settings → Pages is enabled |
| Redirects to home page | Session expired (tab was closed) or secret code not entered |

Open browser console (F12) to see error details.

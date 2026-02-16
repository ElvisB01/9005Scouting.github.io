<div align="center">

<img src="images/logo.svg" alt="FRC 1792 Logo" width="120"/>

# FRC 1792 Scouting ● 2026

Web-based scouting application for FIRST Robotics Competition Team 1792.

**Live at:** [frc1792.github.io](https://frc1792.github.io)

</div>

## What It Does

Track robot performance during FRC competitions:

- **🤖 Match Scouting** – Record robot actions during matches
- **🔧 Pit Scouting** – Document robot specs and capabilities

Data submits automatically to Google Sheets for analysis.

## Features

- **Secret code authentication** – Protects submissions while keeping site public
- **Demo mode** – Explore the app without submitting data
- Multi-step forms with progress tracking
- Team search via The Blue Alliance API
- Server-side validation
- Works offline
- Mobile-friendly

## How to Use

**Scouts:**
1. Visit [frc1792.github.io](https://frc1792.github.io)
2. Enter your team code
3. Choose Match or Pit Scouting
4. Fill out the form and submit

**Demo Mode:**
Click **Demo Mode** on the home page to explore freely without submitting data.

## Setup for Your Team

See [Quick Start Guide](docs/QUICK_START_GUIDE.md) for detailed setup.

**Quick steps:**
1. Fork this repo
2. Set up Google Sheets + Apps Script
3. Edit `js/config.js` with your settings
4. Update `appScript/combined-scouting-script.js` with team codes
5. Enable GitHub Pages

## Tech Stack

Vanilla HTML/CSS/JavaScript • Google Apps Script • The Blue Alliance API • GitHub Pages

## Documentation

- [Quick Start Guide](docs/QUICK_START_GUIDE.md) – Setup in 30 minutes
- [Technical Whitepaper](docs/TECHNICAL_WHITEPAPER.md) – Architecture details

## Project Structure

```
├── index.html, match-scouting.html, pit-scouting.html
├── css/styles.css
├── js/
│   ├── config.js           # Edit this for your team
│   ├── home.js, match-scouting.js, pit-scouting.js
├── appScript/
│   └── combined-scouting-script.js  # Backend
└── docs/
```

**Built for FRC Team 1792 • 2026 Season**

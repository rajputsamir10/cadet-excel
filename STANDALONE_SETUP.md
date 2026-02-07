# Standalone Cadet Manager - Complete Setup

## This is a COMPLETELY INDEPENDENT React App

This project works on its own. No connection to Sahayata or any other project needed.

---

## Installation (One Time)

### 1. Navigate to Project Directory

```bash
cd "e:\cadet excel"
```

### 2. Install All Dependencies

```bash
npm install
```

This installs:
- React
- React DOM
- React Scripts
- XLSX (for Excel export)

Wait 2-5 minutes for completion.

### 3. Run the App Locally

```bash
npm start
```

The app automatically opens at: **http://localhost:3000**

---

## What You Get

### In Browser:
✓ Form to add cadets
✓ Table showing all cadets
✓ Checkboxes to select cadets
✓ Export to Excel button
✓ Delete button (single/multiple)

### In Your Computer:
✓ Data saved in browser (LocalStorage)
✓ No internet needed (works offline)
✓ No server required
✓ Privacy: All data stays on your computer

---

## Project Structure

```
e:\cadet excel\
├── public/
│   └── index.html              (HTML page)
├── src/
│   ├── components/
│   │   └── CadetManager.jsx    (Main component)
│   ├── utils/
│   │   ├── localStorageHelpers.js
│   │   ├── idGenerator.js
│   │   └── excelExport.js
│   ├── styles/
│   │   └── CadetManager.css
│   ├── App.jsx                 (React app)
│   ├── App.css
│   ├── index.js                (Entry point)
│   └── index.css
├── package.json                (Dependencies)
├── .gitignore                  (Git config)
└── README.md                   (Documentation)
```

---

## Quick Start Commands

```bash
# First time setup
cd "e:\cadet excel"
npm install

# Start app locally (for development)
npm start

# Build for deployment (creates optimized version)
npm build

# Deploy to Vercel (after git setup)
git push origin main
```

---

## Using the App

### Add a Cadet
1. Fill the form with cadet details
2. Click "Add Cadet"
3. Cadet appears in table instantly
4. Data saved automatically

### Export to Excel
1. Check boxes next to cadets you want to export
2. Click "Export to Excel" button
3. File downloads: `attendance_2026_02_07.xlsx`

### Delete Cadets
1. Click "Delete" button in row (single delete)
2. OR check multiple boxes + "Delete Selected" (bulk delete)
3. Confirm deletion

### Unique ID Assignment
- **Male cadets** → SD1, SD2, SD3...
- **Female cadets** → SW1, SW2, SW3...
- Counters increment separately
- IDs auto-generated

---

## LocalStorage (Browser Data)

All data stored in your browser locally:

- `cadets` - All cadet information
- `sdCounter` - SD ID counter
- `swCounter` - SW ID counter

**To view/delete data:**
1. Press F12 (Developer Tools)
2. Go to "Application" tab
3. Click "LocalStorage"
4. See your data
5. Right-click to delete

---

## Deployment to Vercel (Optional)

Want to share the app online?

### Step 1: Git Setup

```bash
git init
git add .
git commit -m "Initial cadet manager"
```

### Step 2: Create GitHub Repo

1. Go to https://github.com/new
2. Create repo: `cadet-manager`
3. Copy URL

### Step 3: Push Code

```bash
git remote add origin https://github.com/YOUR_USERNAME/cadet-manager.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy on Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your `cadet-manager` repo
4. Click Deploy
5. Get live URL in 2-3 minutes

**Your app is now online!** Share the URL with anyone.

---

## Updates After Deployment

```bash
# Make changes locally
# Test with npm start

# Push to GitHub
git add .
git commit -m "Description of changes"
git push origin main

# Vercel auto-deploys!
```

---

## Troubleshooting

### npm install fails
```bash
# Try clearing cache
npm cache clean --force
npm install
```

### Port 3000 already in use
```bash
# Use different port
npm start -- --port 3001
```

### Excel export not working
```bash
npm install xlsx --save
```

### Data not persisting
- Check if LocalStorage enabled in browser
- Don't use private/incognito mode
- Clear browser cache and refresh

### Can't add cadet
- Fill ALL required fields (marked with *)
- Check for duplicate Regimental Numbers
- Open F12 console to see error messages

---

## Technology

| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| XLSX | Excel export |
| CSS3 | Styling |
| LocalStorage | Data storage |
| Vercel | Hosting (optional) |

---

## Features Summary

✅ Add unlimited cadets
✅ Unique ID generation (SD/SW)
✅ Export selected cadets to Excel
✅ Delete single or multiple cadets
✅ Form validation
✅ Responsive design (desktop/mobile)
✅ Data persistence (browser storage)
✅ No backend needed
✅ Works offline
✅ Fast and lightweight

---

## File Sizes

| Component | Size |
|-----------|------|
| React App (minified) | ~50 KB |
| All utilities | ~8 KB |
| Styling | ~4 KB |
| **Total** | ~62 KB |

Fast to load, works everywhere.

---

## Next Steps

1. ✅ Run `npm install` (install dependencies)
2. ✅ Run `npm start` (start local app)
3. ✅ Test the app (add cadets, export, delete)
4. ✅ Deploy to Vercel (if you want to share online)

---

## Need Help?

- **Local development**: `npm start` then F12 for errors
- **Deployment**: See VERCEL_DEPLOYMENT.md
- **Code details**: Check source code comments
- **Feature questions**: See README.md

---

**Ready?** Run `npm install` to get started! 🚀

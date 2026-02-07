# Quick Reference - Cadet Management System

## Installation (First Time)

```bash
# In your project root
npm install xlsx

# Run locally
npm start
```

## File Locations & What Each Does

| File | Purpose |
|------|---------|
| `src/components/CadetManager.jsx` | Main component (form + table) |
| `src/utils/localStorageHelpers.js` | Save/load data from browser |
| `src/utils/idGenerator.js` | Generate SD/SW IDs |
| `src/utils/excelExport.js` | Export to Excel |
| `src/styles/CadetManager.css` | Styling |
| `src/App.jsx` | Connect component |

## Form Validation

✓ Full Name (required)
✓ Regimental Number (required, must be unique)
✓ Phone (required)
✓ Email (required)
✗ Gender, DOB, Department, Roll #, Father Name (optional)

## Unique ID Logic

```
If Male → SD1, SD2, SD3... (increment separately)
If Female → SW1, SW2, SW3... (increment separately)
If RegNum contains "SD" → Force SD (override gender)
If RegNum contains "SW" → Force SW (override gender)
```

## Excel Export

- Only exports **selected** cadets
- Filename: `attendance_YYYY_MM_DD.xlsx`
- Auto downloads
- 9 columns: ID, Name, RegNum, Phone, Email, Roll, Dept, DOB, Father

## LocalStorage (Browser Data)

| Key | Value | Reset? |
|-----|-------|--------|
| `cadets` | All cadet data | Manual delete |
| `sdCounter` | SD ID counter | Manual delete |
| `swCounter` | SW ID counter | Manual delete |

**Reset all data:**
```javascript
// In browser console (F12)
localStorage.clear()
```

## Common Tasks

### Add a Cadet
1. Fill form → Click "Add Cadet"
2. ID auto-generated
3. Appears in table immediately
4. Data saved to LocalStorage

### Export Cadets
1. Check checkboxes (select cadets)
2. Click "Export to Excel"
3. File auto-downloads
4. No server upload

### Delete Cadets
1. Single: Click "Delete" button in row
2. Multiple: Check boxes → Click "Delete Selected"
3. Confirm deletion
4. Data removed from LocalStorage

### Select All
1. Check "☐" in table header
2. All rows selected
3. Uncheck to deselect

## Deployment to Vercel

```bash
# 1. Initialize git (if not done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial Cadet Management"

# 4. Create GitHub repo at https://github.com/new

# 5. Push to GitHub
git remote add origin https://github.com/YOUR_NAME/Sahayata.git
git push -u origin main

# 6. Go to vercel.com
# 7. Import GitHub repo
# 8. Click Deploy
# 9. Get live URL

# For updates:
git add .
git commit -m "Description"
git push origin main
# (Auto-deploys!)
```

## Useful Commands

```bash
# Install dependencies
npm install

# Start local dev server
npm start

# Build for production
npm build

# Install XLSX
npm install xlsx

# Check for errors
npm test
```

## Browser DevTools (F12)

### Check LocalStorage
1. Open DevTools (F12)
2. Application tab
3. LocalStorage
4. See all saved cadet data

### Check Errors
1. Open DevTools (F12)
2. Console tab
3. See any error messages

### Clear Data
1. Open DevTools (F12)
2. Application tab
3. Storage → Clear site data
4. Refresh page

## Tech Stack

- React 18+
- XLSX (SheetJS)
- CSS3
- LocalStorage API
- Vercel (deployment)

## File Size

| File | Size |
|------|------|
| CadetManager.jsx | ~8 KB |
| All utilities | ~3 KB |
| Styling | ~4 KB |
| **Total (minified)** | ~15 KB |

## Performance

- ⚡ Fast loading (minimal dependencies)
- 📱 Works on all devices
- 🔌 Works offline
- 🚀 No server requests needed
- 💾 All data local

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Excel not exporting | Run `npm install xlsx` |
| Data not saving | Check if LocalStorage enabled |
| Can't add cadet | Check form validation errors |
| Form not submitting | Fill all required fields |
| ID duplication | Restart counter in LocalStorage |

## Contact & Support

- Check [README.md](README.md)
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Check [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
- Read code comments for details

---

**All data is stored locally. No backend or server needed.**

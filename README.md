# Sahayata - Cadet Management System

A simple, clean React-based cadet management system with Excel export functionality. All data is stored locally in the browser using LocalStorage.

## Features

✅ **Cadet Management**
- Add new cadets with detailed information
- View all cadets in a clean table
- Delete individual or multiple cadets
- Form validation with error messages

✅ **Unique ID Generation**
- Automatic SD/SW ID assignment based on gender
- SD series for males, SW series for females
- Override based on regimental number
- Separate counters for SD and SW

✅ **Excel Export**
- Export selected cadets to Excel
- Automatic filename with date: `attendance_YYYY_MM_DD.xlsx`
- Formatted columns with proper widths
- Select specific cadets before export

✅ **LocalStorage**
- All data persists in browser
- No backend required
- Privacy: data stored locally, not on server
- Works offline

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Clean, minimal UI
- No complex animations
- Fast and lightweight

## Quick Start

### 1. Install Dependencies

```bash
npm install
npm install xlsx
```

### 2. Run Locally

```bash
npm start
```

The app opens at `http://localhost:3000`

### 3. Add a Cadet

1. Fill in the form with cadet details
2. Click "Add Cadet"
3. Cadet appears in the table below

### 4. Export to Excel

1. Select cadets using checkboxes
2. Click "Export to Excel" button
3. File downloads automatically

### 5. Deploy to Vercel

```bash
git push origin main
```

(See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed steps)

## File Structure

```
src/
├── components/
│   └── CadetManager.jsx          # Main component
├── utils/
│   ├── localStorageHelpers.js    # Data persistence
│   ├── idGenerator.js            # Unique ID logic
│   └── excelExport.js            # Excel export function
├── styles/
│   └── CadetManager.css          # Styling
├── App.jsx                       # App entry point
├── App.css                       # App styles
└── index.js                      # React entry point
```

## Cadet Form Fields

- **Full Name** (required)
- **Gender** (Male / Female)
- **Regimental Number** (required, unique)
- **Phone** (required)
- **Email** (required)
- **University Roll Number**
- **Department**
- **Date of Birth**
- **Father's Name**

## Unique ID Rules

| Gender | Regimental Number | ID Type | Example |
|--------|-------------------|---------|---------|
| Male   | Any               | SD      | SD1, SD2, SD3 |
| Female | Any               | SW      | SW1, SW2, SW3 |
| Any    | Contains "SD"     | SD      | SD (override) |
| Any    | Contains "SW"     | SW      | SW (override) |

## Excel Export Columns

1. Unique ID
2. Name
3. Regimental Number
4. Phone
5. Email
6. University Roll
7. Department
8. DOB
9. Father Name

## LocalStorage Keys

- `cadets` - Array of all cadet objects
- `sdCounter` - Counter for SD series IDs
- `swCounter` - Counter for SW series IDs

## Technology Stack

- **React** - UI framework
- **XLSX (SheetJS)** - Excel export
- **CSS** - Styling (no frameworks)
- **LocalStorage** - Data persistence

## Browser Compatibility

- Chrome/Chromium ✓
- Firefox ✓
- Safari ✓
- Edge ✓
- Mobile browsers ✓

## Data Privacy

All cadet data is stored **locally in your browser**:
- ✓ No data sent to server
- ✓ No third-party access
- ✓ Private to your device
- ✓ Delete anytime (clear browser data)

## Documentation

- [Setup Guide](SETUP_GUIDE.md) - Installation & detailed feature guide
- [Vercel Deployment](VERCEL_DEPLOYMENT.md) - Deploy to production
- [Code Comments](src/components/CadetManager.jsx) - Commented source code

## Development

### Add New Field

1. Add to form in `CadetManager.jsx`
2. Add to Excel export in `excelExport.js`
3. Add to table columns in `CadetManager.jsx`

### Customize Styling

Edit `src/styles/CadetManager.css` for colors, spacing, fonts.

### Change ID Format

Edit `idGenerator.js` to modify SD/SW logic.

## Troubleshooting

**Excel not exporting?**
- Ensure XLSX is installed: `npm install xlsx`
- Check browser console for errors (F12)

**Data not persisting?**
- Check if LocalStorage is enabled
- Don't use private/incognito browsing
- Clear browser cache and refresh

**Form not submitting?**
- Check browser console (F12) for errors
- Ensure all required fields filled
- Check for duplicate Regimental Numbers

## Future Enhancements

- Add search/filter functionality
- Add cadet editing
- Add attendance tracking
- Add photo upload
- Add backup/restore from file

## License

MIT - Free to use and modify

## Support

- Check console (F12) for error messages
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Review [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

---

**Ready to deploy?** See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for step-by-step instructions.

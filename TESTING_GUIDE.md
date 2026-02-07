# Testing & Demo Guide

## Quick Demo (5 minutes)

### 1. Start App

```bash
cd "e:\cadet excel"
npm start
```

Wait for browser to open at `http://localhost:3000`

### 2. Add Test Cadets

**Cadet 1 (Male):**
- Full Name: `Rahul Kumar`
- Gender: `Male`
- Regimental Number: `SD-001`
- Phone: `9876543210`
- Email: `rahul@example.com`
- Roll Number: `CSE-101`
- Department: `Computer Science`
- DOB: `2003-05-15`
- Father Name: `Krishnan Kumar`
- Click "Add Cadet"

→ **Expected**: Cadet added with ID `SD1`

---

**Cadet 2 (Female):**
- Full Name: `Priya Singh`
- Gender: `Female`
- Regimental Number: `SW-001`
- Phone: `8765432109`
- Email: `priya@example.com`
- Roll Number: `ECE-102`
- Department: `Electronics`
- DOB: `2002-08-22`
- Father Name: `Rajesh Singh`
- Click "Add Cadet"

→ **Expected**: Cadet added with ID `SW1`

---

**Cadet 3 (Male, Different RegNum):**
- Full Name: `Arjun Patel`
- Gender: `Male`
- Regimental Number: `ARJ-002`
- Phone: `7654321098`
- Email: `arjun@example.com`
- Click "Add Cadet"

→ **Expected**: Cadet added with ID `SD2` (gender-based, not in RegNum)

---

**Cadet 4 (Male with SW in RegNum):**
- Full Name: `Vikas Sharma`
- Gender: `Male`
- Regimental Number: `SW-AUTO`
- Phone: `6543210987`
- Email: `vikas@example.com`
- Click "Add Cadet"

→ **Expected**: Cadet added with ID `SW2` (RegNum contains SW, overrides gender)

---

### 3. Test Table Features

**Select All:**
- Click checkbox in header
→ All 4 rows checked

**Deselect:**
- Click checkbox in header again
→ All rows unchecked

**Select Specific:**
- Check only Rahul and Priya
- Button shows: "Export to Excel (2)"

---

### 4. Test Excel Export

- Select 2 cadets (Rahul & Priya)
- Click "Export to Excel (2)"
- Check Downloads folder
→ File: `attendance_2026_02_07.xlsx` (today's date)

**Open Excel file:**
- Row 1: Headers
- Row 2: Rahul's data
- Row 3: Priya's data
- 9 columns: ID, Name, RegNum, Phone, Email, Roll, Dept, DOB, Father

---

### 5. Test Delete

**Delete Single:**
- Click "Delete" on Arjun's row
- Confirm
→ Arjun removed from table (3 cadets left)

**Delete Multiple:**
- Check Rahul and Priya
- Click "Delete Selected"
- Confirm
→ Both removed (only Vikas left)

---

### 6. Test Error Handling

**Try adding duplicate RegNum:**
- Add new cadet with Regimental Number: `SD-001` (already exists)
→ Error message: "Regimental Number SD-001 already exists!"

**Try adding without required fields:**
- Leave "Full Name" empty
- Click "Add Cadet"
→ Error message: "Full Name is required"

---

## Data Persistence Test

### 1. Refresh Browser

- Add 2 cadets
- Press F5 or Ctrl+R
→ Cadets still there! Data persisted in LocalStorage

### 2. Close Browser

- Add cadets
- Close browser completely
- Reopen app
→ All data still saved!

### 3. Check LocalStorage

1. Press F12 (Developer Tools)
2. Go to "Application" tab
3. Click "LocalStorage"
4. Click domain (localhost:3000)
5. See:
   - `cadets` - All cadet data
   - `sdCounter` - Current SD counter
   - `swCounter` - Current SW counter

---

## Device Testing

### Desktop
```bash
npm start
```
→ Full width, all columns visible

### Mobile/Tablet
1. Press F12
2. Click device icon (mobile view)
3. Choose iPhone/iPad
→ Table collapses, stays usable

Or physically test on phone:
```bash
# Get computer IP
ipconfig
```
Use: `http://YOUR_IP:3000` on phone

---

## Performance Test

### Load Test
- Add 100 cadets rapidly
→ No slowdown, still responsive

### Export Test
- Select all 100 cadets
- Export to Excel
→ Opens instantly, file correct

### Refresh Test
- Add cadets
- F5 refresh multiple times
→ Data survives, no data loss

---

## Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Clear form | Ctrl+K (custom - not implemented) |
| Refresh page | F5 |
| Dev Tools | F12 |
| Search page | Ctrl+F |
| Select all text | Ctrl+A |

---

## Common Test Scenarios

### Scenario 1: Class Management
1. Add all 50 students in a class
2. Export specific students (e.g., Computer Science only)
3. Use for attendance or grading

### Scenario 2: Bulk Import
1. Add 10 cadets manually
2. Export to Excel
3. Share with others
4. They can add more on their device

### Scenario 3: Data Backup
1. Add important cadet data
2. Export to Excel regularly
3. Save Excel files for backup
4. Reimport if needed

---

## Verification Checklist

- [ ] Form adds cadets successfully
- [ ] IDs generated correctly (SD/SW)
- [ ] Table displays all cadets
- [ ] Checkboxes work (select/deselect)
- [ ] Excel export downloads file
- [ ] Excel file has correct data
- [ ] Delete works (single and multiple)
- [ ] Error messages show for validation
- [ ] Data persists after refresh
- [ ] Data persists after closing browser
- [ ] Works on mobile screen
- [ ] No console errors (F12)

---

## Debug Tips

### Check Console for Errors
1. Press F12
2. Click "Console" tab
3. Look for red error messages
4. Click to expand for details

### Check LocalStorage
1. Press F12
2. Click "Application" tab
3. Expand "LocalStorage"
4. Click domain
5. See all stored data

### Check Network (for Vercel deployment)
1. Press F12
2. Click "Network" tab
3. Reload page
4. See all requests
5. Check for failed requests (red)

---

## Test Data Ready to Copy-Paste

```
Name: Rahul Kumar
Gender: Male
RegNum: SD-001
Phone: 9876543210
Email: rahul@example.com
Roll: CSE-101
Dept: Computer Science
DOB: 2003-05-15
Father: Krishnan Kumar

---

Name: Priya Singh
Gender: Female
RegNum: SW-001
Phone: 8765432109
Email: priya@example.com
Roll: ECE-102
Dept: Electronics
DOB: 2002-08-22
Father: Rajesh Singh

---

Name: Arjun Patel
Gender: Male
RegNum: ARJ-002
Phone: 7654321098
Email: arjun@example.com
Roll: CSE-103
Dept: Computer Science
DOB: 2003-03-10
Father: Dinesh Patel

---

Name: Vikas Sharma
Gender: Male
RegNum: SW-AUTO
Phone: 6543210987
Email: vikas@example.com
Roll: ME-104
Dept: Mechanical
DOB: 2002-12-01
Father: Suresh Sharma
```

---

## Success Criteria

✅ All features working without errors
✅ Data persists correctly
✅ Excel export file readable
✅ No console errors
✅ Works on multiple devices
✅ Fast and responsive

---

**Ready to test?** Start with `npm start` and follow demo above! 🎯

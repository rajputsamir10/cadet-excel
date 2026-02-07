# Vercel Deployment Guide - Cadet Management System

## Prerequisites

- Git installed on your computer
- GitHub account (free)
- Vercel account (free - sign up with GitHub)

## Step-by-Step Deployment

### Step 1: Install XLSX Dependency Locally

Before deploying, make sure XLSX is installed:

```bash
npm install xlsx
```

Verify `package.json` includes:
```json
{
  "dependencies": {
    "react": "^18.x.x",
    "react-dom": "^18.x.x",
    "xlsx": "^latest"
  }
}
```

### Step 2: Initialize Git Repository

In your project root directory:

```bash
git init
git add .
git commit -m "Initial Cadet Management System"
```

### Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Create new repository: `Sahayata` (or your project name)
3. Do NOT initialize with README
4. Copy the repository URL

### Step 4: Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/Sahayata.git
git branch -M main
git push -u origin main
```

### Step 5: Connect Vercel to GitHub

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select your `Sahayata` repository
5. Vercel auto-detects React app ✓
6. Click "Deploy"

### Step 6: Configure Build Settings (if needed)

**Root Directory**: `.` (current)
**Build Command**: `npm run build`
**Output Directory**: `build`
**Install Command**: `npm install`

These are usually auto-detected. Just verify and deploy.

### Step 7: Deploy!

- Click the "Deploy" button
- Wait 2-3 minutes for deployment
- Vercel gives you a live URL (e.g., `https://sahayata-xyz.vercel.app`)

## Post-Deployment

### Your app is now live!

**URL Format**: `https://sahayata-YOUR_PROJECT_ID.vercel.app`

### Testing Deployment

1. Open the Vercel URL in browser
2. Test all features:
   - ✓ Add a cadet
   - ✓ View in table
   - ✓ Select cadets
   - ✓ Export to Excel
   - ✓ Delete cadets
3. Refresh page → data persists (LocalStorage works)
4. Clear browser data → LocalStorage resets

### Environment Variables (if needed later)

If you need .env variables:
1. Go to Vercel Dashboard → Project Settings
2. Environment Variables
3. Add your variables
4. Redeploy

For this project, NO environment variables are needed (frontend only).

## Continuous Deployment

**Automatic Updates:**
- Every time you push to GitHub, Vercel redeploys automatically
- No manual deployment needed
- Rollback to previous versions available in Vercel Dashboard

### Update Workflow:

```bash
# Make changes locally
# Test everything

# Push to GitHub
git add .
git commit -m "Description of changes"
git push origin main

# Vercel automatically deploys!
# Check status: https://vercel.com/dashboard
```

## Custom Domain (Optional)

To use your own domain:

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Update DNS records (Vercel shows exact steps)
4. Domain ready in 24 hours

## Troubleshooting

### "Build failed" error

Check the build logs in Vercel Dashboard:

1. Deployments tab
2. Click failed deployment
3. View build logs
4. Common issues:
   - Missing dependency: `npm install [package]`
   - Syntax error: Fix in code and push
   - Import paths: Use correct relative paths

### LocalStorage not persisting after refresh

- LocalStorage works in Vercel (browser feature, not backend)
- Clear browser cache if issues
- Check browser console for errors (F12)

### Excel export not working

- Check if XLSX is installed: `npm install xlsx`
- Restart build: `npm run build`
- Push to GitHub → Vercel redeploys

### Need to access deployed database

This project has NO backend. All data stored in browser LocalStorage only.
- Each user's browser has separate data
- Data lost if browser cache cleared
- This is expected behavior for this deployment

## Production Best Practices

### For this project:

✓ **Already set up correctly:**
- No API calls or backend needed
- All data stored client-side
- Static files only (no server-side code)
- Works offline after first load

✓ **Performance:**
- Very small bundle size
- Fast load times
- No database queries

✓ **Security:**
- No sensitive data transmission
- LocalStorage is browser-specific
- HTTPS enabled by default on Vercel

## Monitoring & Maintenance

### Check Vercel Dashboard regularly:

1. Performance metrics
2. Build status
3. Error logs
4. Traffic analytics

### Update dependencies (quarterly):

```bash
npm update
npm audit fix
```

Then push to GitHub for automatic redeployment.

## FAQ

**Q: Where is data stored?**
A: In browser LocalStorage. Each user's browser has its own data.

**Q: Can I access data from another device?**
A: No. LocalStorage is device-specific. Use backend + database for syncing.

**Q: How much does Vercel cost?**
A: Free for hobby projects. Unlimited deployments, HTTPS, CDN included.

**Q: Can I add a backend later?**
A: Yes. Convert to API endpoints, add Node.js backend, deploy to Vercel.

**Q: How do I update the app after deployment?**
A: Push changes to GitHub. Vercel auto-deploys. No manual action needed.

## Quick Reference

```bash
# Local development
npm install
npm start

# Deploy to Vercel
git add .
git commit -m "Message"
git push origin main
# (Vercel auto-deploys automatically)

# Check status
# Visit: https://vercel.com/dashboard
```

---

**Deployment Complete!** Your Cadet Management System is now live on Vercel. 🎉

For more help: https://vercel.com/docs

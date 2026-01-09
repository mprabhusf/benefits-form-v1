# Heroku Deployment Guide

## Prerequisites

1. A Heroku account (sign up at https://heroku.com)
2. Heroku CLI installed (see installation below)

## Installation

### Install Heroku CLI

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Or download from:**
https://devcenter.heroku.com/articles/heroku-cli

## Deployment Steps

### Option 1: Using Heroku CLI

1. **Login to Heroku:**
   ```bash
   heroku login
   ```

2. **Create a new Heroku app:**
   ```bash
   heroku create benefits-form-v1
   ```
   (Or use a different name if that's taken)

3. **Set Node.js buildpack:**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

4. **Deploy to Heroku:**
   ```bash
   git push heroku main
   ```

5. **Open your app:**
   ```bash
   heroku open
   ```

### Option 2: Using Heroku Dashboard (GitHub Integration)

1. Go to https://dashboard.heroku.com
2. Click "New" → "Create new app"
3. Choose an app name and region
4. Go to "Deploy" tab
5. Under "Deployment method", select "GitHub"
6. Connect your GitHub account and select the repository: `mprabhusf/benefits-form-v1`
7. Click "Enable Automatic Deploys" (optional)
8. Click "Deploy Branch" to deploy the main branch
9. Wait for deployment to complete
10. Click "Open app" to view your deployed application

## Configuration

The app is already configured with:
- ✅ `Procfile` for Heroku
- ✅ `heroku-postbuild` script in package.json
- ✅ Next.js standalone output mode

## Environment Variables

If you need to set environment variables:
```bash
heroku config:set VARIABLE_NAME=value
```

## View Logs

```bash
heroku logs --tail
```

## Troubleshooting

If you encounter issues:

1. **Check build logs:**
   ```bash
   heroku logs --tail
   ```

2. **Verify Node.js version:**
   The app uses Node.js 20.x. Heroku should detect this automatically.

3. **Rebuild if needed:**
   ```bash
   heroku restart
   ```

## Notes

- The app will be available at: `https://your-app-name.herokuapp.com`
- First deployment may take a few minutes
- Subsequent deployments are faster


# Google Drive Webhook Setup Guide

## Current Issue
The "🔴 Changed" messages are not appearing in the terminal because the Google Drive webhook system is not properly configured.

## Required Steps to Fix

### 1. Install and Setup ngrok
```bash
# Install ngrok (if not already installed)
# Option A: Using snap
sudo snap install ngrok

# Option B: Using npm
npm install -g ngrok

# Option C: Download from https://ngrok.com/download
```

### 2. Create Environment Variables
Create a `.env.local` file in your project root:
```bash
# .env.local
NGROK_URI=https://your-ngrok-url.ngrok.io
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH2_REDIRECT_URI=your_redirect_uri
CRON_JOB_KEY=your_cron_job_key
```

### 3. Start the Development Environment

#### Terminal 1: Start Next.js Development Server
```bash
npm run dev
```
This will start the server on `https://localhost:3000` (with experimental HTTPS)

#### Terminal 2: Start ngrok Tunnel
```bash
ngrok http 3000
```
This will create a public URL like `https://abc123.ngrok.io`

#### Terminal 3: Update Environment Variable
Update your `.env.local` file with the ngrok URL:
```bash
NGROK_URI=https://abc123.ngrok.io
```

### 4. Activate Google Drive Webhook
Once both servers are running:
1. Visit your application in the browser
2. Navigate to the Google Drive integration page
3. Click the button that triggers the `/api/drive-activity` endpoint
4. This will create the webhook subscription with Google Drive

### 5. Test the Setup
1. Make changes to files in your Google Drive
2. You should now see "🔴 Changed" messages in the terminal where Next.js is running
3. The webhook will trigger your workflow automations

## How the System Works

1. **Next.js Server** (`/api/drive-activity/notification/route.ts`):
   - Receives webhook notifications from Google Drive
   - Logs "🔴 Changed" to terminal
   - Processes workflow automations

2. **Google Drive API** (`/api/drive-activity/route.ts`):
   - Sets up push notification subscription
   - Tells Google Drive to send webhooks to your ngrok URL
   - Stores the resource ID in your database

3. **ngrok**:
   - Exposes your local development server to the internet
   - Allows Google Drive to send webhooks to your local machine

## Troubleshooting

### No "🔴 Changed" Messages
- Check if Next.js dev server is running
- Check if ngrok is running and accessible
- Verify NGROK_URI environment variable is correct
- Ensure Google Drive subscription was created successfully

### Webhook Not Receiving
- Check ngrok URL is publicly accessible
- Verify the webhook endpoint: `{NGROK_URI}/api/drive-activity/notification`
- Check Google Drive API quotas and permissions
- Ensure OAuth tokens are valid

### Environment Variables
- Restart Next.js server after changing `.env.local`
- Verify all required environment variables are set
- Check Google Cloud Console for API credentials

## Quick Start Commands

```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start ngrok (replace with your actual port)
ngrok http 3000

# Terminal 3: Update .env.local with ngrok URL, then trigger webhook setup
# Visit your app and activate Google Drive integration
```

After following these steps, you should see the "🔴 Changed" messages in your terminal whenever Google Drive files are modified.
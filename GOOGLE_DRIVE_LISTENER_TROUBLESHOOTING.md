# Google Drive Listener Troubleshooting Guide

## Issue Description
The error "Failed to create listener" occurs when trying to set up a Google Drive webhook listener in your workflow automation platform.

## Root Cause Analysis

After analyzing your codebase, the primary issues are:

### 1. Missing Environment Variables
Your application requires these environment variables that are currently not configured:

**Required Environment Variables:**
```bash
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OAUTH2_REDIRECT_URI=your_oauth_redirect_uri
NGROK_URI=your_public_webhook_url
```

### 2. Webhook URL Configuration
The Google Drive API requires a publicly accessible webhook URL to send notifications to your application.

### 3. Google Cloud Project Setup
You need a properly configured Google Cloud Project with the Drive API enabled.

## Step-by-Step Solution

### Step 1: Create Google Cloud Project and OAuth Credentials

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project or select existing one**
3. **Enable Google Drive API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Select "Web application"
   - Add authorized redirect URIs (include your Clerk callback URLs)
   - Note down the Client ID and Client Secret

### Step 2: Set up Ngrok for Webhook URL

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # Or install via package manager
   npm install -g ngrok
   ```

2. **Start ngrok tunnel:**
   ```bash
   ngrok http 3000
   ```

3. **Note the public URL** (e.g., `https://abc123.ngrok.io`)

### Step 3: Create Environment Variables

Create a `.env.local` file in your project root:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
OAUTH2_REDIRECT_URI=your_clerk_callback_url

# Webhook Configuration  
NGROK_URI=https://your-ngrok-url.ngrok.io

# Clerk Configuration (if not already set)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Other required variables
CRON_JOB_KEY=your_cron_job_api_key
```

### Step 4: Configure Clerk OAuth

1. **In your Clerk Dashboard:**
   - Go to "OAuth providers" 
   - Add Google as OAuth provider
   - Use the Google Client ID and Secret from Step 1
   - Configure proper scopes including `https://www.googleapis.com/auth/drive`

### Step 5: Update Google Cloud OAuth Settings

1. **Add authorized redirect URIs in Google Cloud Console:**
   - Add your Clerk callback URLs
   - Add your application URLs
   - Example: `https://your-app.clerk.accounts.dev/v1/oauth_callback`

### Step 6: Test the Configuration

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test the Google Drive connection:**
   - Navigate to your workflow editor
   - Try to create a Google Drive listener
   - Check browser console and server logs for any errors

## Common Issues and Solutions

### Issue: "Google access token not found"
**Solution:** Ensure user has authenticated with Google through Clerk and granted Drive permissions.

### Issue: "startPageToken is unexpectedly null"
**Solution:** Check Google Drive API permissions and ensure the API is properly enabled.

### Issue: Webhook not receiving notifications
**Solution:** 
- Verify ngrok is running and URL is publicly accessible
- Check that the webhook URL in environment variables matches your ngrok URL
- Ensure webhook endpoint `/api/drive-activity/notification` is working

### Issue: Database errors
**Solution:** Ensure your database is properly configured and the user table has the required `googleResourceId` field.

## Code Verification Checklist

✅ Environment variables are properly set
✅ Google Cloud Project has Drive API enabled  
✅ OAuth credentials are configured in both Google Cloud and Clerk
✅ Ngrok is running and providing public URL
✅ Webhook endpoint is accessible
✅ Database schema includes required fields
✅ User has authenticated with Google via Clerk

## Testing the Webhook

You can test if your webhook is working by making a test request:

```bash
curl -X POST https://your-ngrok-url.ngrok.io/api/drive-activity/notification \
  -H "x-goog-resource-id: test-resource-id" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Additional Notes

- The webhook URL must be HTTPS (ngrok provides this)
- Google Drive webhooks have a maximum lifetime, you may need to recreate them periodically
- Ensure your application handles webhook security properly in production
- Consider implementing proper error handling and retry logic

## Production Deployment

For production deployment:
1. Replace ngrok with a proper domain
2. Use environment variables in your hosting platform
3. Ensure HTTPS is properly configured
4. Set up proper monitoring for webhook delivery
# Quick Fix: Google Drive → Slack Automation Not Working

## Issue
- Manual "Send Message" button works ✅
- Google Drive changes don't trigger Slack messages ❌

## Most Likely Cause
**Your workflow is not published** - the webhook handler only executes published workflows.

## Immediate Fix (3 Steps)

### Step 1: Publish Your Workflow
1. In your workflow editor, click **"Save"** button first
2. Then click **"Publish"** button
3. Verify you see "Published" status

### Step 2: Set Up Fresh Google Drive Webhook
1. If you see "Listening..." → Click **"Refresh Listener"**
2. Click **"Create Listener"**
3. Verify you get "Listening to changes..." message

### Step 3: Test the Automation
1. Make a small change to any file in Google Drive
2. Check your terminal for these messages:
   ```
   🔴 Changed
   🔄 Found 1 published workflows to execute
   🔄 Processing workflow: [Your Workflow Name]
   ✅ Slack message sent successfully
   ```

## What I Fixed for You

✅ **Enhanced Logging**: Added detailed logs to help debug issues
✅ **Webhook Handler**: Now only executes published workflows
✅ **Error Handling**: Better error messages for troubleshooting
✅ **Refresh Listener**: Added button to clear stale listeners

## If Still Not Working

Check these in order:

1. **Terminal shows "🔴 Changed"?** 
   - No → Google Drive webhook issue
   - Yes → Continue to next step

2. **Terminal shows "Found X published workflows"?**
   - No → Workflow not published or saved
   - Yes → Continue to next step

3. **Terminal shows "Slack message sent successfully"?**
   - No → Slack configuration issue
   - Yes → Check Slack channel for message

## Environment Setup Required

Make sure you have:
```bash
# Terminal 1: Next.js server
npm run dev

# Terminal 2: ngrok tunnel
ngrok http 3000

# .env.local file
NGROK_URI=https://your-ngrok-url.ngrok.io
```

## Common Issues

- **"No workflows found"** → Click "Publish" button
- **"No flowPath"** → Click "Save" then "Publish"
- **"No Slack channels"** → Verify Slack configuration
- **"No 🔴 Changed messages"** → Recreate Google Drive listener

## Success Indicators

You'll know it's working when:
- ✅ You see "🔴 Changed" in terminal
- ✅ You see "Slack message sent successfully"
- ✅ Message appears in your Slack channel
- ✅ Workflow executes every time you change Google Drive files

**Most common fix: Click "Save" then "Publish" in your workflow editor!**
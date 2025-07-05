# Google Drive → Slack Automation Troubleshooting

## Problem
- Manual "Send Message" button works ✅
- Automatic Google Drive changes don't trigger Slack messages ❌

## Root Cause Analysis

Based on your workflow and the code analysis, here are the most likely issues:

### 1. **Workflow Not Published** (Most Common)
- The webhook handler only executes **published** workflows
- Check if your workflow shows "Published" status

### 2. **Missing Flow Path** 
- The workflow needs a saved flowPath to execute
- This is created when you click "Save" in the workflow editor

### 3. **Missing Slack Configuration**
- Slack channels, access token, or template might be missing
- These are required for the automation to work

### 4. **Google Drive Webhook Not Set Up**
- The webhook might not be properly connected to your workflow

## How to Fix

### Step 1: Check Workflow Status
1. In your workflow editor, look for these buttons:
   - **Save** button - saves the workflow configuration
   - **Publish** button - makes the workflow active for automation

2. **Click "Save" first, then "Publish"** 
   - This ensures the flowPath is saved and the workflow is active

### Step 2: Verify Slack Configuration
1. Make sure your Slack node shows "Connected"
2. Verify the channel is selected ("testing" in your case)
3. Check that the message template is set ("heyyy")

### Step 3: Set Up Google Drive Webhook
1. Click the "Refresh Listener" button (if you see "Listening...")
2. Click "Create Listener" to set up a fresh webhook
3. Verify you get the "Listening to changes..." message

### Step 4: Test the Complete Setup
1. **Start your development environment**:
   ```bash
   # Terminal 1: Start Next.js
   npm run dev
   
   # Terminal 2: Start ngrok
   ngrok http 3000
   ```

2. **Update your environment**:
   ```bash
   # .env.local
   NGROK_URI=https://your-ngrok-url.ngrok.io
   ```

3. **Test the workflow**:
   - Make a change to a file in Google Drive
   - Check your terminal for these messages:
     ```
     🔴 Changed
     🔄 Found 1 published workflows to execute
     🔄 Processing workflow: [Your Workflow Name]
     🔄 FlowPath: ["Slack"]
     🔄 Executing Slack action for workflow: [Your Workflow Name]
     ✅ Slack message sent successfully
     ```

## Enhanced Logging

I've added detailed logging to help debug issues. When you make changes to Google Drive, you should see:

```
🔴 Changed
🔄 Channel Resource ID: [resource-id]
🔄 User found: [your-user-id]
🔄 User credits: [your-credits]
✅ User has sufficient credits, proceeding with workflow execution
🔄 Found X published workflows to execute
🔄 Processing workflow: [workflow-name]
🔄 FlowPath: ["Slack"]
🔄 Executing Slack action for workflow: [workflow-name]
🔄 Sending to Slack channels: [{"label":"","value":"testing"}]
🔄 Message template: heyyy
✅ Slack message sent successfully
```

## Common Issues and Solutions

### Issue: No "🔴 Changed" Messages
**Solution**: Google Drive webhook not set up
- Clear old listeners with "Refresh Listener"
- Create new listener with "Create Listener"
- Ensure ngrok is running and NGROK_URI is set

### Issue: "🔴 Changed" But No Workflow Execution
**Solution**: Workflow not published or no published workflows found
- Click "Publish" button in workflow editor
- Check workflow is saved with correct flow path

### Issue: Workflow Found But No Slack Message
**Solution**: Missing Slack configuration
- Verify Slack access token is saved
- Check Slack channels are configured
- Ensure message template is set

### Issue: "❌ No user found for googleResourceId"
**Solution**: Database mismatch
- The Google Drive listener resource ID doesn't match any user
- Clear and recreate the listener

## Debug Checklist

Before asking for help, verify:

- [ ] Next.js development server is running (`npm run dev`)
- [ ] ngrok is running and exposing port 3000
- [ ] `.env.local` has correct `NGROK_URI`
- [ ] Workflow is **saved** (clicked "Save" button)
- [ ] Workflow is **published** (clicked "Publish" button)
- [ ] Google Drive shows "Listening..." (listener is active)
- [ ] Slack is "Connected" with channel selected
- [ ] Message template is configured
- [ ] Terminal shows "🔴 Changed" when you modify Google Drive files

## Quick Test Steps

1. **Verify Manual Slack Works**: 
   - Click "Send Message" button → Should work ✅

2. **Check Workflow Status**:
   - Look for "Published" badge in workflow editor
   - Verify flowPath is saved (not empty)

3. **Test Google Drive Webhook**:
   - Make a small change to any file in Google Drive
   - Check terminal for "🔴 Changed" message
   - Look for subsequent workflow execution logs

4. **Verify Slack Integration**:
   - Check Slack channel for automated messages
   - Look for success/error messages in terminal

## Still Not Working?

If the issue persists:

1. **Check Browser Console**: Look for JavaScript errors
2. **Check Network Tab**: Verify API calls are being made
3. **Check Database**: Ensure workflow data is properly saved
4. **Check Slack Logs**: Verify Slack API isn't returning errors

The enhanced logging will help identify exactly where the process is failing.

## Summary

The most common cause is that the workflow isn't published. Make sure to:

1. **Save** the workflow (creates flowPath)
2. **Publish** the workflow (makes it active)
3. **Set up Google Drive listener** (creates webhook)
4. **Test with a file change** (triggers automation)

With the enhanced logging, you'll be able to see exactly what's happening at each step.
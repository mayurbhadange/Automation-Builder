# Complete Solution: Google Drive Webhook Issue

## Problem Summary
- UI shows "Listening..." but no "🔴 Changed" messages in terminal
- Database has old `googleResourceId` from previous session
- Webhook points to dead ngrok URL
- Google Drive sends notifications to non-existent endpoint

## What I Fixed

### 1. ✅ Added Clear Listener Function
- Added `clearGoogleListener()` function in `workflow-connection.tsx`
- Allows clearing stale database entries

### 2. ✅ Enhanced UI Component
- Enabled automatic listener status check on page load
- Added "Refresh Listener" button when showing "Listening..."
- Better user experience with loading states and error handling

### 3. ✅ Quick Fix Script
- Created `fix-webhook-issue.js` for immediate database cleanup
- Can be run manually to clear all stale listeners

## How to Use the Fix

### Option A: Use the UI (Recommended)
1. Visit your workflows page
2. If you see "Listening..." with no webhook messages:
   - Click "Refresh Listener" button
   - Wait for "Listener cleared" message
   - Click "Create Listener" to set up fresh webhook

### Option B: Run the Quick Fix Script
```bash
node fix-webhook-issue.js
```

### Option C: Manual Database Clear
```bash
npx prisma studio
# Navigate to User table
# Set googleResourceId to null for your user
```

## Complete Setup Process

1. **Clear Old Listener** (if needed):
   ```bash
   node fix-webhook-issue.js
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Start ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Update Environment**:
   ```bash
   # .env.local
   NGROK_URI=https://your-new-ngrok-url.ngrok.io
   ```

5. **Create New Listener**:
   - Visit your app
   - Click "Create Listener"
   - Verify you see "Listening to changes..." response

6. **Test**:
   - Make changes to Google Drive files
   - Should see "🔴 Changed" messages in terminal

## Why This Happens

The issue occurs because:
1. Google Drive webhooks have a persistent subscription model
2. When ngrok restarts, it gets a new URL
3. Old webhooks point to dead URLs
4. Database still thinks listener is active
5. UI shows "Listening" but no messages arrive

## Prevention

To avoid this issue in the future:
1. Always clear listeners when stopping development
2. Use consistent ngrok URLs (ngrok paid plans)
3. Implement webhook health checks
4. Add automatic listener refresh logic

## Files Modified

- `src/app/(main)/(pages)/workflows/_actions/workflow-connection.tsx`
- `src/app/(main)/(pages)/workflows/editor/[editorId]/_components/google-drive-files.tsx`
- `fix-webhook-issue.js` (new file)

## Next Steps

1. Test the fix with your current session
2. Verify webhooks are working
3. Consider implementing automatic listener refresh
4. Add webhook health monitoring

The solution provides both immediate fixes and long-term improvements to handle this common development issue.
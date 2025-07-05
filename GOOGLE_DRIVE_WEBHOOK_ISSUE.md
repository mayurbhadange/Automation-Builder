# Google Drive Webhook Issue: "Listening" But No Messages

## The Problem

When you start a new session, the UI shows "Listening..." but no "🔴 Changed" messages appear because:

1. **Database Still Has Old Listener**: Your database contains `googleResourceId` from the previous session
2. **Dead Webhook URL**: The old webhook points to a dead ngrok tunnel (e.g., `https://old-abc123.ngrok.io`)
3. **UI Logic**: The UI checks if `googleResourceId` exists in database → shows "Listening..."
4. **But No Active Webhook**: Google Drive is still sending webhooks to the old, dead URL

## The Root Cause

```typescript
// In google-drive-files.tsx
const onListener = async () => {
  const listener = await getGoogleListener()
  if (listener?.googleResourceId !== null) {
    setIsListening(true)  // ← This shows "Listening..." 
  }
}
```

The database check returns `true` because the old `googleResourceId` still exists, but the actual webhook subscription is pointing to a dead URL.

## How to Fix This

### Option 1: Clear Old Listener (Recommended)

Create a function to clear the old `googleResourceId` and force creation of a new listener:

```typescript
// Add this to workflow-connection.tsx
export const clearGoogleListener = async () => {
  const { userId } = auth()
  
  if (userId) {
    await db.user.update({
      where: {
        clerkId: userId,
      },
      data: {
        googleResourceId: null,
      },
    })
  }
}
```

### Option 2: Update the Listener Logic

Modify the Google Drive component to handle stale listeners:

```typescript
// In google-drive-files.tsx
useEffect(() => {
  onListener()
}, [])

const onListener = async () => {
  const listener = await getGoogleListener()
  if (listener?.googleResourceId !== null) {
    // Check if the listener is actually working
    // For now, assume it's stale and require manual refresh
    setIsListening(true)
  } else {
    setIsListening(false)
  }
}
```

### Option 3: Smart Refresh System

Create a refresh mechanism that updates the existing listener with the new ngrok URL.

## Quick Fix for Current Session

1. **Clear the database entry manually**:
   ```sql
   UPDATE User SET googleResourceId = NULL WHERE clerkId = 'your-clerk-id';
   ```

2. **Or restart with fresh listener**:
   - Start Next.js: `npm run dev`
   - Start ngrok: `ngrok http 3000`
   - Update `.env.local` with new ngrok URL
   - Visit your app - it should now show "Create Listener" button
   - Click it to create a fresh webhook subscription

## Better Solution Implementation

Let me create a proper fix that handles this automatically:
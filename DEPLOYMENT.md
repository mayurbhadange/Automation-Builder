# 🚀 Fuzzie Production Deployment Guide

## Domain: https://fuzzie-kohl.vercel

### 📋 Pre-Deployment Checklist

#### 1. Environment Variables Setup
Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database (Neon Tech PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# Uploadcare (File Storage)
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your-uploadcare-public-key
UPLOADCARE_SECRET_KEY=your-uploadcare-secret-key

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google API (Drive Integration)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_API_KEY=your-google-api-key
OAUTH2_REDIRECT_URI=https://fuzzie-kohl.vercel/api/auth/callback/google

# Slack API
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_SIGNING_SECRET=your-slack-signing-secret
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_REDIRECT_URI=https://fuzzie-kohl.vercel/api/auth/callback/slack
NEXT_PUBLIC_SLACK_REDIRECT=https://slack.com/oauth/v2/authorize?client_id=YOUR_SLACK_CLIENT_ID&scope=chat:write,channels:read,groups:read,im:read,mpim:read&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel%2Fapi%2Fauth%2Fcallback%2Fslack

# Discord API
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_PUBLIC_KEY=your-discord-public-key
NEXT_PUBLIC_DISCORD_REDIRECT=https://discord.com/api/oauth2/authorize?client_id=YOUR_DISCORD_CLIENT_ID&permissions=2048&scope=bot%20webhook.incoming&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code

# Notion API
NOTION_API_KEY=your-notion-api-key
NOTION_CLIENT_ID=your-notion-client-id
NOTION_CLIENT_SECRET=your-notion-client-secret
NOTION_API_SECRET=your-notion-api-secret
NOTION_REDIRECT_URI=https://fuzzie-kohl.vercel/api/auth/callback/notion
NEXT_PUBLIC_NOTION_AUTH_URL=https://api.notion.com/v1/oauth/authorize?client_id=YOUR_NOTION_CLIENT_ID&response_type=code&owner=user&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel%2Fapi%2Fauth%2Fcallback%2Fnotion

# Ngrok (Optional for local webhook testing - NOT needed in production)
# NGROK_AUTH_TOKEN=your-ngrok-auth-token
# NGROK_URI=https://your-ngrok-url.ngrok.io

# Cron Job Key (for scheduled tasks)
CRON_JOB_KEY=your-cron-job-secret-key
```

#### 2. Third-Party Service Configuration

##### Clerk Dashboard
- Set allowed callback URLs:
  - `https://fuzzie-kohl.vercel/sign-in/*`
  - `https://fuzzie-kohl.vercel/sign-up/*`
  - `https://fuzzie-kohl.vercel/api/auth/callback/*`

##### Google Cloud Console
- Create OAuth 2.0 credentials
- Set authorized redirect URIs:
  - `https://fuzzie-kohl.vercel/api/auth/callback/google`
- Enable Google Drive API
- **Important**: Google Drive webhooks will automatically use `https://fuzzie-kohl.vercel/api/drive-activity/notification` in production

##### Slack App Configuration
- Set OAuth Redirect URLs:
  - `https://fuzzie-kohl.vercel/api/auth/callback/slack`
- Add required scopes:
  - `chat:write`
  - `channels:read`
  - `groups:read`
  - `im:read`
  - `mpim:read`

##### Discord App Configuration
- Set OAuth2 Redirect URL:
  - `https://fuzzie-kohl.vercel/api/auth/callback/discord`
- Add required scopes:
  - `webhook.incoming`
  - `guilds.join`

##### Notion Integration
- Set redirect URI:
  - `https://fuzzie-kohl.vercel/api/auth/callback/notion`
- Add required capabilities:
  - Read content
  - Update content
  - Insert content

##### Stripe Dashboard
- Set webhook endpoints:
  - `https://fuzzie-kohl.vercel/api/payment/webhook`
- Configure products and pricing plans

##### Webhook Configuration
- **Google Drive**: Automatically configured to use `https://fuzzie-kohl.vercel/api/drive-activity/notification`
- **Cron Jobs**: Will use `https://fuzzie-kohl.vercel/api/drive-activity/notification?flow_id={flow_id}` for scheduled tasks

#### 3. Database Setup
1. Create PostgreSQL database (Neon Tech recommended)
2. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

#### 4. Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set all environment variables in Vercel dashboard
3. Deploy to `https://fuzzie-kohl.vercel`

### 🔧 Post-Deployment Verification

#### Test OAuth Flows
1. **Google Drive**: Test file upload/download
2. **Slack**: Test message sending
3. **Discord**: Test webhook creation
4. **Notion**: Test database access

#### Test Payment Flow
1. Create test subscription
2. Verify webhook handling
3. Test billing dashboard

#### Test Workflow Builder
1. Create simple workflow
2. Test drag-and-drop functionality
3. Verify workflow execution

### 🚨 Common Issues & Solutions

#### OAuth Redirect Errors
- Ensure all redirect URIs use `https://fuzzie-kohl.vercel`
- Check for trailing slashes
- Verify environment variables are set correctly

#### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database permissions
- Run `npx prisma db push` if needed

#### File Upload Issues
- Verify Uploadcare keys
- Check CORS settings
- Test with small files first

### 📞 Support
For deployment issues, check:
1. Vercel deployment logs
2. Environment variable configuration
3. Third-party service dashboards
4. Database connection status

### 🔄 Environment Variables for Different Environments

#### Development (.env.local)
```env
# Use localhost:3000 for redirects
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
SLACK_REDIRECT_URI=http://localhost:3000/api/auth/callback/slack
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback/discord
NOTION_REDIRECT_URI=http://localhost:3000/api/auth/callback/notion
```

#### Production (Vercel Environment Variables)
```env
# Use fuzzie-kohl.vercel for redirects
GOOGLE_REDIRECT_URI=https://fuzzie-kohl.vercel/api/auth/callback/google
SLACK_REDIRECT_URI=https://fuzzie-kohl.vercel/api/auth/callback/slack
DISCORD_REDIRECT_URI=https://fuzzie-kohl.vercel/api/auth/callback/discord
NOTION_REDIRECT_URI=https://fuzzie-kohl.vercel/api/auth/callback/notion
```

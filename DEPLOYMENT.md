# 🚀 Fuzzie Production Deployment Guide

## Domain: https://fuzzie-kohl.vercel.app

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
OAUTH2_REDIRECT_URI=https://fuzzie-kohl.vercel.app/api/auth/callback/google

# Slack API
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_SIGNING_SECRET=your-slack-signing-secret
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_REDIRECT_URI=https://fuzzie-kohl.vercel.app/api/auth/callback/slack
NEXT_PUBLIC_SLACK_REDIRECT=https://slack.com/oauth/v2/authorize?client_id=YOUR_SLACK_CLIENT_ID&scope=chat:write,channels:read,groups:read,mpim:read,im:read&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel.app%2Fapi%2Fauth%2Fcallback%2Fslack

# Discord API
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_PUBLIC_KEY=your-discord-public-key
NEXT_PUBLIC_DISCORD_REDIRECT=https://discord.com/api/oauth2/authorize?client_id=YOUR_DISCORD_CLIENT_ID&permissions=2048&scope=bot%20webhook.incoming&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel.app%2Fapi%2Fauth%2Fcallback%2Fdiscord&response_type=code

# Notion API
NOTION_API_KEY=your-notion-api-key
NOTION_CLIENT_ID=your-notion-client-id
NOTION_CLIENT_SECRET=your-notion-client-secret
NOTION_API_SECRET=your-notion-api-secret
NOTION_REDIRECT_URI=https://fuzzie-kohl.vercel.app/api/auth/callback/notion
NEXT_PUBLIC_NOTION_AUTH_URL=https://api.notion.com/v1/oauth/authorize?client_id=YOUR_NOTION_CLIENT_ID&response_type=code&owner=user&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel.app%2Fapi%2Fauth%2Fcallback%2Fnotion

# Ngrok (Optional for local webhook testing - NOT needed in production)
# NGROK_AUTH_TOKEN=your-ngrok-auth-token
# NGROK_URI=https://your-ngrok-url.ngrok.io

# Security
ENCRYPTION_KEY=... (Generated 32-byte hex string)

# Cron Job Key (for scheduled tasks)
CRON_JOB_KEY=your-cron-job-key
```

#### 2. Third-Party Service Configuration

##### Clerk Dashboard
- Set allowed callback URLs:
  - `https://fuzzie-kohl.vercel.app/sign-in/*`
  - `https://fuzzie-kohl.vercel.app/sign-up/*`
  - `https://fuzzie-kohl.vercel.app/api/auth/callback/*`

##### Google Cloud Console
- Create OAuth 2.0 credentials
- Set authorized redirect URIs:
  - `https://fuzzie-kohl.vercel.app/api/auth/callback/google`
- Enable Google Drive API
- **Important**: Google Drive webhooks will automatically use `https://fuzzie-kohl.vercel.app/api/drive-activity/notification` in production

##### Slack App Configuration
- Set OAuth Redirect URLs:
  - `https://fuzzie-kohl.vercel.app/api/auth/callback/slack`
- Add required scopes:
  - `chat:write`
  - `channels:read`
  - `groups:read`
  - `im:read`
  - `mpim:read`

##### Discord App Configuration
- Set OAuth2 Redirect URL:
  - `https://fuzzie-kohl.vercel.app/api/auth/callback/discord`
- Add required scopes:
  - `webhook.incoming`
  - `guilds.join`

##### Notion Integration
- Set redirect URI:
  - `https://fuzzie-kohl.vercel.app/api/auth/callback/notion`
- Add required capabilities:
  - Read content
  - Update content
  - Insert content

##### Stripe Dashboard
- Set webhook endpoints:
  - `https://fuzzie-kohl.vercel.app/api/payment/webhook`
- Configure products and pricing plans

##### Webhook Configuration
- **Google Drive**: Automatically configured to use `https://fuzzie-kohl.vercel.app/api/drive-activity/notification`
- **Cron Jobs**: Will use `https://fuzzie-kohl.vercel.app/api/drive-activity/notification?flow_id={flow_id}` for scheduled tasks

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
3. Deploy to `https://fuzzie-kohl.vercel.app`

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
11. Create simple workflow
12. Test drag-and-drop functionality
13. Verify workflow execution

### 🚨 Common Issues & Solutions

#### OAuth Redirect Errors
- Ensure all redirect URIs use `https://fuzzie-kohl.vercel.app`
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
# Core
NEXT_PUBLIC_URL=https://fuzzie-kohl.vercel.app
NEXT_PUBLIC_DOMAIN=fuzzie-kohl.vercel.app
NEXT_PUBLIC_SCHEME=https://

# Clerk Authentication (Use Production Keys for Prod)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_... (REPLACE WITH PRODUCTION KEY)
CLERK_SECRET_KEY=sk_test_... (REPLACE WITH PRODUCTION KEY)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Google (Drive Integration)
# Note: Ensure OAUTH2_REDIRECT_URI matches what is in your Google Cloud Console.
# If using Clerk for Auth, this might be your Clerk Callback or a custom one if you implemented it (but api/auth/callback/google does not exist in code).
OAUTH2_REDIRECT_URI=https://fuzzie-kohl.vercel.app/api/auth/callback/google

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your-uploadcare-public-key
NEXT_PUBLIC_UPLOAD_CARE_CSS_SRC=https://cdn.jsdelivr.net/npm/@uploadcare/blocks@
NEXT_PUBLIC_UPLOAD_CARE_SRC_PACKAGE=/web/lr-file-uploader-regular.min.css

# Discord
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_REDIRECT_URI=https://fuzzie-kohl.vercel.app/api/auth/callback/discord
NEXT_PUBLIC_DISCORD_REDIRECT=https://discord.com/oauth2/authorize?client_id=YOUR_DISCORD_CLIENT_ID&response_type=code&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel.app%2Fapi%2Fauth%2Fcallback%2Fdiscord&integration_type=0&scope=identify+guilds+connections+guilds.members.read+webhook.incoming+email

# Notion
NOTION_CLIENT_ID=your-notion-client-id
NOTION_API_SECRET=your-notion-api-secret
NOTION_REDIRECT_URI=https://fuzzie-kohl.vercel.app/api/auth/callback/notion
NEXT_PUBLIC_NOTION_AUTH_URL=https://api.notion.com/v1/oauth/authorize?client_id=YOUR_NOTION_CLIENT_ID&response_type=code&owner=user&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel.app%2Fapi%2Fauth%2Fcallback%2Fnotion

# Slack
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_SIGNING_SECRET=your-slack-signing-secret
SLACK_REDIRECT_URI=https://fuzzie-kohl.vercel.app/api/auth/callback/slack
NEXT_PUBLIC_SLACK_REDIRECT=https://slack.com/oauth/v2/authorize?client_id=YOUR_SLACK_CLIENT_ID&scope=chat:write,channels:read,groups:read,mpim:read,im:read&user_scope=chat:write,channels:read,groups:read,mpim:read,im:read&redirect_uri=https%3A%2F%2Ffuzzie-kohl.vercel.app%2Fapi%2Fauth%2Fcallback%2Fslack

# Stripe
STRIPE_SECRET=sk_test_... (Use Prod Key)
STRIPE_WEBHOOK_SECRET=whsec_... (Use Prod Key)

# Security
ENCRYPTION_KEY=... (Generated 32-byte hex string)


# Cron
CRON_JOB_KEY=...
```

## 🌍 Traditional Deployment (VPS / EC2 / DigitalOcean)

If you are not using Vercel, you would typically deploy this Next.js application on a Linux VPS (Ubuntu is standard) using **Node.js**, **PM2**, and **Nginx**.

### 1. Provision & Setup Server
1. **Server:** Get an Ubuntu 20.04/22.04 VPS (e.g., AWS EC2, DigitalOcean Droplet, Linode).
2. **Update:** Run `sudo apt update && sudo apt upgrade`.
3. **Install Node.js:** Install Node.js (v18+ recommended) using `nvm` or the NodeSource repository.
4. **Install Git:** `sudo apt install git`.

### 2. Application Setup
1. **Clone Repo:** 
   ```bash
   git clone https://github.com/mayurbhadange/Automation-Builder.git
   ```
2. **Install Dependencies:**
   ```bash
   cd Automation-Builder
   npm install
   ```
3. **Environment Variables:**
   - Create a `.env` file: `nano .env`
   - Copy your production variables into it.
4. **Database:** Ensure your Prisma schema is synced:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### 3. Build the Application
Since we are not in a serverless environment, build the production assets:
```bash
npm run build
```

### 4. Process Management (PM2)
Use **PM2** to keep the application running in the background.
1. **Install PM2:** `sudo npm install -g pm2`
2. **Start App:**
   ```bash
   pm2 start npm --name "fuzzie" -- start
   ```
3. **Save List:** `pm2 save`
4. **Startup Script:** Run `pm2 startup` and follow instructions.

### 5. Reverse Proxy (Nginx)
Use **Nginx** to handle incoming traffic and SSL.
1. **Install Nginx:** `sudo apt install nginx`
2. **Configure Site:**
   - Create config: `sudo nano /etc/nginx/sites-available/fuzzie`
   - Paste configuration:
     ```nginx
     server {
         listen 80;
         server_name your-domain.com;

         location / {
             proxy_pass http://localhost:3000;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_cache_bypass $http_upgrade;
         }
     }
     ```
3. **Enable Site:** `sudo ln -s /etc/nginx/sites-available/fuzzie /etc/nginx/sites-enabled/`
4. **Test & Restart:** `sudo nginx -t && sudo systemctl restart nginx`

### 6. SSL (HTTPS)
Use **Certbot** for free SSL.
1. **Install Certbot:** `sudo apt install certbot python3-certbot-nginx`
2. **Get Certificate:** `sudo certbot --nginx -d your-domain.com`


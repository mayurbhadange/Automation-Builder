This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# 🚀 Fuzzie — Workflow Automation Builder

Fuzzie is a flexible, modern **Workflow Automation Builder** that helps you connect apps, automate repetitive tasks, and streamline your processes — without writing code.

## ✨ Features

- **Visual Workflow Builder:** Drag-and-drop interface powered by React Flow.
- **Automated Triggers & Actions:** Connect multiple apps seamlessly.
- **Real-time Execution:** Visualize workflow progress and handle errors gracefully.
- **Dashboard:** Overview of credits, workflows, and connected apps.
- **Integrations:**
  - Google Drive (Triggers on file changes)
  - Slack (Send messages)
  - Discord (Post to webhooks)
  - Notion (Create/Update database items)
- **Authentication:** Secure user management with Clerk.
- **Payments:** Subscription and credit system via Stripe.

## 🔧 Tech Stack

- **Frontend:** Next.js 14, Tailwind CSS v3, Framer Motion, Radix UI
- **Workflow Engine:** React Flow
- **State Management:** Zustand
- **Authentication:** Clerk
- **Database:** PostgreSQL (Neon Tech), Prisma ORM
- **File Storage:** Uploadcare
- **Payments:** Stripe
- **Tunnelling:** Ngrok (for local webhook testing)

## 📸 Screenshots

### 🏠 Homepage
![Fuzzie Homepage](./public/fuzz1.png)

### 🧠 Workflow Builder – Drag & Drop Interface
![Workflow Builder](./public/fuzz2.png)

### 🔗 App Connections – OAuth Linked Services
![App Connections](./public/fuzz3.png)

### ⚙️ Settings – User Profile Panel
![Settings Page](./public/fuzz4.png)

### 💳 Pricing Page – Subscription Plans
![Pricing Plans](./public/fuzz5.png)

### 📈 Workflows – Landing Section
![Developer Studio](./public/fuzz6.png)

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/mayurbhadange/Automation-Builder.git
cd Automation-Builder
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory. You can use the example below:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Neon Tech (PostgreSQL DB)
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# Uploadcare
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your-uploadcare-public-key
UPLOADCARE_SECRET_KEY=your-uploadcare-secret-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google API (Drive)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_API_KEY=your-google-api-key
# Dev: http://localhost:3000/api/auth/callback/google
# Prod: https://your-domain.vercel.app/api/auth/callback/google
OAUTH2_REDIRECT_URI=http://localhost:3000/api/auth/callback/google

# Slack API
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_SIGNING_SECRET=your-slack-signing-secret
SLACK_BOT_TOKEN=xoxb-...
SLACK_REDIRECT_URI=http://localhost:3000/api/auth/callback/slack

# Discord API
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback/discord

# Notion API
NOTION_API_KEY=your-notion-api-key
NOTION_CLIENT_ID=your-notion-client-id
NOTION_CLIENT_SECRET=your-notion-client-secret
NOTION_REDIRECT_URI=http://localhost:3000/api/auth/callback/notion

# General
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000
NEXT_PUBLIC_SCHEME=http://
```

### 4️⃣ Setup Database

Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 5️⃣ Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment

For detailed production deployment instructions, please refer to [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📚 Learn More

To learn more about Next.js and the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Flow Documentation](https://reactflow.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🤝 Contributing

Contributions are welcome! Please run `npm run lint` before submitting a pull request.

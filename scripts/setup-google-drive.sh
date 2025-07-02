#!/bin/bash

# Google Drive Listener Setup Script
# This script helps automate the setup process for Google Drive listeners

echo "🚀 Google Drive Listener Setup Assistant"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local from template..."
    if [ -f ".env.local.template" ]; then
        cp .env.local.template .env.local
        echo "✅ Created .env.local file"
        echo "⚠️  Please edit .env.local and fill in your actual values"
    else
        echo "❌ Template file not found. Please create .env.local manually."
    fi
else
    echo "✅ .env.local already exists"
fi

echo ""

# Check if ngrok is installed
if command -v ngrok &> /dev/null; then
    echo "✅ ngrok is installed"
    
    # Ask if user wants to start ngrok
    read -p "🤔 Would you like to start ngrok now? (y/n): " start_ngrok
    if [ "$start_ngrok" = "y" ] || [ "$start_ngrok" = "Y" ]; then
        echo "🌐 Starting ngrok on port 3000..."
        echo "📋 Copy the HTTPS URL and update NGROK_URI in your .env.local file"
        echo "🔄 Press Ctrl+C to stop ngrok when done"
        echo ""
        ngrok http 3000
    fi
else
    echo "❌ ngrok not found"
    read -p "🤔 Would you like to install ngrok? (y/n): " install_ngrok
    if [ "$install_ngrok" = "y" ] || [ "$install_ngrok" = "Y" ]; then
        echo "📦 Installing ngrok..."
        npm install -g ngrok
        echo "✅ ngrok installed"
        echo "🌐 Starting ngrok on port 3000..."
        ngrok http 3000
    else
        echo "⚠️  Please install ngrok manually: npm install -g ngrok"
    fi
fi

echo ""
echo "📋 Next Steps Checklist:"
echo "========================"
echo ""
echo "1. 🔧 Configure Google Cloud:"
echo "   - Visit: https://console.cloud.google.com/"
echo "   - Create/select project"
echo "   - Enable Google Drive API"
echo "   - Create OAuth 2.0 credentials"
echo ""
echo "2. 🔑 Update .env.local with your values:"
echo "   - GOOGLE_CLIENT_ID"
echo "   - GOOGLE_CLIENT_SECRET"
echo "   - NGROK_URI (from ngrok output above)"
echo "   - Other required variables"
echo ""
echo "3. 👤 Configure Clerk:"
echo "   - Add Google as OAuth provider"
echo "   - Use your Google Client ID/Secret"
echo "   - Include Drive API scopes"
echo ""
echo "4. ✅ Test your setup:"
echo "   - Run: node scripts/diagnose-google-drive.js"
echo "   - Start dev server: npm run dev"
echo "   - Try creating a Google Drive listener"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - GOOGLE_DRIVE_LISTENER_TROUBLESHOOTING.md"
echo ""
echo "🎉 Setup complete! Good luck with your Google Drive integration!"
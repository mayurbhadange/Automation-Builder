#!/usr/bin/env node

/**
 * Google Drive Listener Diagnostic Script
 * Run this script to check if your environment is properly configured
 * 
 * Usage: node scripts/diagnose-google-drive.js
 */

const https = require('https');
const url = require('url');

console.log('🔍 Google Drive Listener Diagnostic Tool\n');

// Required environment variables
const requiredEnvVars = {
  'GOOGLE_CLIENT_ID': 'Google OAuth Client ID',
  'GOOGLE_CLIENT_SECRET': 'Google OAuth Client Secret', 
  'OAUTH2_REDIRECT_URI': 'OAuth Redirect URI',
  'NGROK_URI': 'Webhook URL (ngrok or production domain)',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': 'Clerk Publishable Key',
  'CLERK_SECRET_KEY': 'Clerk Secret Key',
  'DATABASE_URL': 'Database Connection String'
};

let allPassed = true;

console.log('📋 Environment Variables Check:');
console.log('================================\n');

// Check each required environment variable
Object.entries(requiredEnvVars).forEach(([envVar, description]) => {
  const value = process.env[envVar];
  const status = value ? '✅' : '❌';
  
  if (!value) {
    allPassed = false;
  }
  
  console.log(`${status} ${envVar}`);
  console.log(`   Description: ${description}`);
  
  if (value) {
    // Mask sensitive values
    const maskedValue = envVar.includes('SECRET') || envVar.includes('KEY') 
      ? `${value.substring(0, 8)}...` 
      : value;
    console.log(`   Value: ${maskedValue}`);
  } else {
    console.log(`   ⚠️  Missing - Please set this in your .env.local file`);
  }
  console.log('');
});

// Check webhook URL accessibility
async function checkWebhookUrl() {
  const webhookUrl = process.env.NGROK_URI;
  
  if (!webhookUrl) {
    console.log('❌ Cannot test webhook - NGROK_URI not set\n');
    return false;
  }
  
  console.log('🌐 Webhook URL Accessibility Check:');
  console.log('====================================\n');
  
  try {
    const testUrl = `${webhookUrl}/api/drive-activity/notification`;
    console.log(`Testing: ${testUrl}`);
    
    return new Promise((resolve) => {
      const parsedUrl = url.parse(testUrl);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-resource-id': 'test-diagnostic'
        },
        timeout: 5000
      };
      
      const req = https.request(options, (res) => {
        console.log(`✅ Webhook endpoint is accessible (Status: ${res.statusCode})`);
        console.log('   This means Google can send webhooks to your application\n');
        resolve(true);
      });
      
      req.on('error', (error) => {
        console.log(`❌ Webhook endpoint is not accessible`);
        console.log(`   Error: ${error.message}`);
        console.log('   Make sure ngrok is running: npx ngrok http 3000\n');
        resolve(false);
      });
      
      req.on('timeout', () => {
        console.log(`❌ Webhook endpoint timeout`);
        console.log('   The URL might be incorrect or the server is not responding\n');
        resolve(false);
      });
      
      req.end();
    });
  } catch (error) {
    console.log(`❌ Invalid webhook URL format: ${error.message}\n`);
    return false;
  }
}

// Additional checks
console.log('🔧 Additional Configuration Checks:');
console.log('====================================\n');

// Check if package.json has required dependencies
try {
  const packageJson = require('../package.json');
  const requiredDeps = ['googleapis', '@clerk/nextjs', 'prisma'];
  
  console.log('📦 Dependencies:');
  requiredDeps.forEach(dep => {
    const hasDepInDeps = packageJson.dependencies && packageJson.dependencies[dep];
    const hasDepInDevDeps = packageJson.devDependencies && packageJson.devDependencies[dep];
    const status = (hasDepInDeps || hasDepInDevDeps) ? '✅' : '❌';
    
    if (!hasDepInDeps && !hasDepInDevDeps) {
      allPassed = false;
    }
    
    console.log(`   ${status} ${dep}`);
  });
  console.log('');
} catch (error) {
  console.log('❌ Could not read package.json');
  allPassed = false;
}

// Final summary and recommendations
async function generateSummary() {
  const webhookOk = await checkWebhookUrl();
  
  console.log('📊 Summary:');
  console.log('===========\n');
  
  if (allPassed && webhookOk) {
    console.log('🎉 All checks passed! Your environment appears to be properly configured.');
    console.log('   You should be able to create Google Drive listeners now.\n');
    
    console.log('💡 Next steps:');
    console.log('   1. Restart your development server: npm run dev');
    console.log('   2. Navigate to your workflow editor');
    console.log('   3. Try creating a Google Drive listener');
    console.log('   4. Check the browser console for any additional errors\n');
  } else {
    console.log('⚠️  Some issues were found. Please address the following:\n');
    
    if (!allPassed) {
      console.log('🔧 Environment Variables:');
      console.log('   - Set missing environment variables in .env.local');
      console.log('   - Refer to .env.local.template for guidance');
      console.log('   - Check GOOGLE_DRIVE_LISTENER_TROUBLESHOOTING.md for detailed setup\n');
    }
    
    if (!webhookOk) {
      console.log('🌐 Webhook Configuration:');
      console.log('   - Make sure ngrok is running: npx ngrok http 3000');
      console.log('   - Update NGROK_URI in .env.local with your ngrok URL');
      console.log('   - Ensure your webhook endpoint is accessible\n');
    }
    
    console.log('📖 For detailed setup instructions, see:');
    console.log('   - GOOGLE_DRIVE_LISTENER_TROUBLESHOOTING.md');
    console.log('   - .env.local.template\n');
  }
}

// Run the diagnostic
generateSummary();
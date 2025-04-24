const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate a random 32-character hexadecimal key
function generateKey() {
  return crypto.randomBytes(16).toString('hex');
}

// Main function
async function main() {
  try {
    // Generate a new IndexNow API key
    const apiKey = generateKey();
    console.log('Generated IndexNow API key:', apiKey);
    
    // Create the verification file in the public directory
    const publicDir = path.join(process.cwd(), 'public');
    
    // Ensure the public directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write the key file
    const keyFilePath = path.join(publicDir, `${apiKey}.txt`);
    fs.writeFileSync(keyFilePath, apiKey);
    console.log(`Created verification file at: ${keyFilePath}`);
    
    // Update .env.local file with the new key
    const envFilePath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf8');
      
      // Check if INDEXNOW_API_KEY already exists
      if (envContent.includes('INDEXNOW_API_KEY=')) {
        // Replace existing key
        envContent = envContent.replace(
          /INDEXNOW_API_KEY=.*/,
          `INDEXNOW_API_KEY=${apiKey}`
        );
      } else {
        // Add new key
        envContent += `\n# IndexNow API key\nINDEXNOW_API_KEY=${apiKey}\n`;
      }
    } else {
      // Create new .env.local file
      envContent = `# IndexNow API key\nINDEXNOW_API_KEY=${apiKey}\n`;
    }
    
    // Write updated .env.local file
    fs.writeFileSync(envFilePath, envContent);
    console.log(`Updated .env.local with IndexNow API key`);
    
    // Also update .env.local.example
    const envExamplePath = path.join(process.cwd(), '.env.local.example');
    
    if (fs.existsSync(envExamplePath)) {
      let exampleContent = fs.readFileSync(envExamplePath, 'utf8');
      
      // Check if INDEXNOW_API_KEY already exists in example
      if (!exampleContent.includes('INDEXNOW_API_KEY=')) {
        // Add example key
        exampleContent += `\n# IndexNow API key\nINDEXNOW_API_KEY=your_indexnow_api_key_here\n`;
        
        // Write updated .env.local.example file
        fs.writeFileSync(envExamplePath, exampleContent);
        console.log(`Updated .env.local.example with IndexNow API key example`);
      }
    }
    
    console.log('\nIndexNow setup complete!');
    console.log('------------------------');
    console.log('To use IndexNow:');
    console.log(`1. Make sure your website is accessible at ${process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com'}`);
    console.log(`2. Verify that ${apiKey}.txt is accessible at ${process.env.NEXT_PUBLIC_SITE_URL || 'https://codexorbit.com'}/${apiKey}.txt`);
    console.log('3. The API key has been added to your .env.local file');
    console.log('4. IndexNow will automatically notify search engines when content changes');
  } catch (error) {
    console.error('Error generating IndexNow key:', error);
  }
}

// Run the main function
main();

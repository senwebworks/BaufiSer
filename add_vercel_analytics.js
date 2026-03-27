const fs = require('fs');
const path = require('path');

// Find all HTML files in the current directory
const htmlFiles = fs.readdirSync('.').filter(file => file.endsWith('.html'));

const analyticsScript = '    <script defer src="https://cdn.vercel-insights.com/v1/script.js"></script>\n';

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if the script is already added
    if (content.includes('cdn.vercel-insights.com/v1/script.js')) {
        console.log(`✓ ${file} - Already has Vercel Analytics`);
        return;
    }
    
    // Add the script before the closing </body> tag
    if (content.includes('</body>')) {
        content = content.replace('</body>', `${analyticsScript}</body>`);
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✓ ${file} - Added Vercel Analytics`);
    } else {
        console.log(`⚠ ${file} - No </body> tag found`);
    }
});

console.log(`\nProcessed ${htmlFiles.length} HTML files`);

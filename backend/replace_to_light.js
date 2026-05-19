const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../frontend');

const replacements = [
    // Text colors
    { regex: /text-\[#F5F5F2\]/g, replacement: 'text-[#000000]' },
    { regex: /text-\[#FFFFFF\]/g, replacement: 'text-[#000000]' },
    { regex: /text-white/g, replacement: 'text-black' },
    { regex: /text-\[#9CA3AF\]/g, replacement: 'text-[#525252]' },
    { regex: /text-gray-400/g, replacement: 'text-gray-600' },
    { regex: /text-gray-300/g, replacement: 'text-gray-700' },
    { regex: /text-gray-200/g, replacement: 'text-gray-800' },
    
    // Background colors
    { regex: /bg-\[#0B0B0C\]/gi, replacement: 'bg-[#FFFFFF]' },
    { regex: /bg-\[#111315\]/gi, replacement: 'bg-[#F5F5F5]' },
    { regex: /bg-\[#1A1C1F\]/gi, replacement: 'bg-[#E5E5E5]' },
    
    // Glassmorphic borders and backgrounds
    { regex: /bg-\[rgba\(255,255,255,0\.03\)\]/g, replacement: 'bg-[rgba(0,0,0,0.03)]' },
    { regex: /bg-\[rgba\(255,255,255,0\.02\)\]/g, replacement: 'bg-[rgba(0,0,0,0.02)]' },
    { regex: /bg-\[rgba\(255,255,255,0\.06\)\]/g, replacement: 'bg-[rgba(0,0,0,0.06)]' },
    
    { regex: /border-\[rgba\(255,255,255,0\.06\)\]/g, replacement: 'border-[rgba(0,0,0,0.1)]' },
    { regex: /border-\[rgba\(255,255,255,0\.04\)\]/g, replacement: 'border-[rgba(0,0,0,0.08)]' },
    { regex: /border-\[rgba\(255,255,255,0\.08\)\]/g, replacement: 'border-[rgba(0,0,0,0.12)]' },

    // Box shadows
    { regex: /rgba\(255,255,255,0\.05\)/g, replacement: 'rgba(0,0,0,0.05)' },
    { regex: /rgba\(255,255,255,0\.2\)/g, replacement: 'rgba(0,0,0,0.1)' }
];

function processDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach((file) => {
            const filePath = path.join(directory, file);
            if (fs.statSync(filePath).isDirectory()) {
                if (file !== 'node_modules' && file !== 'img') {
                    processDirectory(filePath);
                }
            } else if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
                let content = fs.readFileSync(filePath, 'utf8');
                let originalContent = content;
                
                replacements.forEach(r => {
                    content = content.replace(r.regex, r.replacement);
                });

                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Updated to Light Mode: ${filePath}`);
                }
            }
        });
    });
}

processDirectory(directoryPath);

const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../frontend');

const replacements = [
    { regex: /#D6B36A/gi, replacement: '#FFFFFF' },
    { regex: /#B8962E/gi, replacement: '#E5E5E5' },
    { regex: /#E8C97A/gi, replacement: '#F5F5F5' },
    { regex: /rgba\(214,\s*179,\s*106,/gi, replacement: 'rgba(255,255,255,' },
    { regex: /#0B0B0C/gi, replacement: '#000000' },
    { regex: /rgba\(11,\s*11,\s*12,/gi, replacement: 'rgba(0,0,0,' }
];

function processDirectory(directory) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach((file) => {
            const filePath = path.join(directory, file);
            if (fs.statSync(filePath).isDirectory()) {
                processDirectory(filePath);
            } else if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
                let content = fs.readFileSync(filePath, 'utf8');
                let originalContent = content;
                
                replacements.forEach(r => {
                    content = content.replace(r.regex, r.replacement);
                });

                if (content !== originalContent) {
                    fs.writeFileSync(filePath, content, 'utf8');
                    console.log(`Updated: ${filePath}`);
                }
            }
        });
    });
}

processDirectory(directoryPath);

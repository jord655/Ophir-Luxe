const fs = require('fs');
const path = require('path');

// Folder to scan
const routesFolder = path.join(__dirname, 'routes');

// Regex to catch invalid route params (colon with no name or space after)
const invalidParamRegex = /:\s|:\/|:\?/;

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (invalidParamRegex.test(line)) {
      console.log(`⚠️  Potential invalid route in ${filePath} at line ${idx + 1}:\n   ${line.trim()}\n`);
    }
  });
}

function scanFolder(folder) {
  const files = fs.readdirSync(folder);
  files.forEach(file => {
    const fullPath = path.join(folder, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      scanFolder(fullPath);
    } else if (file.endsWith('.js')) {
      checkFile(fullPath);
    }
  });
}

scanFolder(routesFolder);
console.log('Scan complete!');

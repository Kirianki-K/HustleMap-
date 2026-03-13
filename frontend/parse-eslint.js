import fs from 'fs';

const data = JSON.parse(fs.readFileSync('eslint-output.json', 'utf8'));

data.forEach(file => {
    if (file.messages && file.messages.length > 0) {
        console.log(`\nFile: ${file.filePath}`);
        file.messages.forEach(msg => {
            console.log(`  Line ${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
        });
    }
});

import fs from 'fs';
import path from 'path';

const csvDir = path.join(process.cwd(), 'csvs');
const outputFile = path.join(process.cwd(), 'products2.csv');

async function mergeCsvs() {
    try {
        const files = fs.readdirSync(csvDir).filter(f => f.endsWith('.csv'));
        if (files.length === 0) {
            console.log('No CSV files found in csvs directory.');
            return;
        }

        console.log(`Found ${files.length} CSV files. Merging...`);
        let isFirstFile = true;
        let totalLines = 0;

        // Create write stream
        const writeStream = fs.createWriteStream(outputFile, { flags: 'w', encoding: 'utf8' });

        for (const file of files) {
            const filePath = path.join(csvDir, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Handle BOM (Byte Order Mark) if present
            if (content.charCodeAt(0) === 0xFEFF) {
                content = content.slice(1);
            }

            const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');

            if (lines.length === 0) continue;

            if (isFirstFile) {
                // Write all lines including header
                writeStream.write(lines.join('\n') + '\n');
                totalLines += lines.length;
                isFirstFile = false;
            } else {
                // Skip the first line (header) and write the rest
                const dataLines = lines.slice(1);
                if (dataLines.length > 0) {
                    writeStream.write(dataLines.join('\n') + '\n');
                    totalLines += dataLines.length;
                }
            }
        }

        writeStream.end();
        console.log(`Successfully merged ${files.length} files into products2.csv`);
        console.log(`Total lines written: ${totalLines}`);
    } catch (err) {
        console.error('Error merging CSV files:', err);
    }
}

mergeCsvs();

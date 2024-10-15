const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const filePath = path.join(dataDir, 'shopping-list.json');

// Create a new directory if it doesn't exist
function createDirectory() {
    if (!fs.existsSync(dataDir)) {
        try {
            fs.mkdirSync(dataDir);
        } catch (err) {
            console.error("Error creating directory:", err);
        }
    }
}

// Create an empty JSON file if it doesn't exist
function createFile() {
    if (!fs.existsSync(filePath)) {
        try {
            fs.writeFileSync(filePath, JSON.stringify([])); // Empty array for shopping list items
        } catch (err) {
            console.error("Error creating file:", err);
        }
    }
}

// Read and parse the JSON file
function readFile() {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
}

// Update the JSON file with new data
function writeFile(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error("Error writing file:", err);
    }
}

module.exports = {
    createDirectory,
    createFile,
    readFile,
    writeFile
};

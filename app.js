const http = require('http');
const fileManager = require('./file-manager/fileManager');

// Initialize file manager (create directory and file if they don't exist)
fileManager.createDirectory();
fileManager.createFile();

const hostname = '127.0.0.1';
const port = 3000;

// Create the HTTP server
const server = http.createServer((req, res) => {
    if (req.url === '/shopping-list' && req.method === 'GET') {
        // Get all shopping list items
        const shoppingList = fileManager.readFile();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(shoppingList));

    } else if (req.url === '/shopping-list' && req.method === 'POST') {
        // Add a new shopping list item
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const newItem = JSON.parse(body);
            const shoppingList = fileManager.readFile();

            // Basic validation
            if (!newItem.name || !newItem.quantity) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid data. Name and quantity are required.' }));
                return;
            }

            shoppingList.push(newItem);
            fileManager.writeFile(shoppingList);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item added successfully' }));
        });

    } else if (req.url.startsWith('/shopping-list') && req.method === 'PUT') {
        // Update a shopping list item
        const id = parseInt(req.url.split('/').pop());
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const updatedItem = JSON.parse(body);
            let shoppingList = fileManager.readFile();

            const itemIndex = shoppingList.findIndex((_, index) => index === id);

            if (itemIndex === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Item not found' }));
                return;
            }

            shoppingList[itemIndex] = { ...shoppingList[itemIndex], ...updatedItem };
            fileManager.writeFile(shoppingList);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item updated successfully' }));
        });

    } else if (req.url.startsWith('/shopping-list') && req.method === 'DELETE') {
        // Delete a shopping list item
        const id = parseInt(req.url.split('/').pop());
        let shoppingList = fileManager.readFile();

        if (id < 0 || id >= shoppingList.length) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Item not found' }));
            return;
        }

        shoppingList.splice(id, 1);
        fileManager.writeFile(shoppingList);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Item deleted successfully' }));

    } else {
        // Handle invalid routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

// Start the server
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

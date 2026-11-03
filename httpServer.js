
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Employee task array
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Amit Kumar",
        status: "In Progress"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "Completed"
    }
];

// Create HTTP server
const server = http.createServer((req, res) => {

    const url = new URL(req.url, 'http://localhost:3000');
    const pathname = url.pathname;
    const method = req.method;

    // A2: GET /
    if (pathname === '/' && method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(`
            <h1>Welcome to Employee Task Management</h1>
            <p>Node.js HTTP Server is working!</p>
        `);
    }

    // A2 and A3: GET /tasks
    else if (pathname === '/tasks' && method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(tasks, null, 2));
    }

    // A2: GET /about
    else if (pathname === '/about' && method === 'GET') {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        res.end(
            'Employee Task Management Application built using Node.js HTTP and FS modules.'
        );
    }

    // A4: GET /home using FS module
    else if (pathname === '/home' && method === 'GET') {

        const filePath = path.join(
            __dirname,
            'public',
            'index.html'
        );

        fs.readFile(filePath, 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Error reading HTML file.');
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.end(data);
        });
    }

    // A3: POST /add-task
    else if (pathname === '/add-task' && method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;

            if (body.length > 100000) {
                req.destroy();
            }
        });

        req.on('end', () => {

            try {

                const newTask = JSON.parse(body);

                const { id, taskName, assignedTo, status } = newTask;

                // Validate required fields
                if (
                    id === undefined ||
                    id === null ||
                    taskName === undefined ||
                    assignedTo === undefined ||
                    status === undefined ||
                    !Number.isInteger(id) ||
                    typeof taskName !== 'string' ||
                    !taskName.trim() ||
                    typeof assignedTo !== 'string' ||
                    !assignedTo.trim() ||
                    typeof status !== 'string' ||
                    !status.trim()
                ) {
                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: 'All required fields must be valid.'
                    }));

                    return;
                }

                // Check duplicate ID
                if (tasks.some(task => task.id === id)) {
                    res.writeHead(409, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: 'Task ID already exists.'
                    }));

                    return;
                }

                tasks.push({
                    id,
                    taskName: taskName.trim(),
                    assignedTo: assignedTo.trim(),
                    status: status.trim()
                });

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Task added successfully',
                    task: tasks[tasks.length - 1]
                }));

            } catch (error) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Invalid JSON request.'
                }));
            }
        });
    }

    // A5: Invalid routes
    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('404 - Page Not Found');
    }

});

// A1: Start server on port 3000
server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});

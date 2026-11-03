
import express from 'express';

const app = express();

// B1: JSON parsing middleware
app.use(express.json());

// Employee task array
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Amit Kumar",
        status: "In Progress",
        priority: "Medium"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Priya Singh",
        status: "Completed",
        priority: "Low"
    }
];

// Validate task information
function validateTask(task, requireId = false) {

    if (!task || typeof task !== 'object' || Array.isArray(task)) {
        return false;
    }

    const requiredFields = [
        'taskName',
        'assignedTo',
        'status',
        'priority'
    ];

    if (requireId) {
        requiredFields.push('id');
    }

    return requiredFields.every(field => {

        const value = task[field];

        if (field === 'id') {
            return Number.isInteger(value);
        }

        return typeof value === 'string' && value.trim().length > 0;
    });
}

// B2: GET all tasks
app.get('/tasks', (req, res) => {

    res.status(200).json(tasks);

});

// B2: GET task by ID
app.get('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            message: 'Invalid task ID.'
        });
    }

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: 'Task not found.'
        });
    }

    res.status(200).json(task);

});

// B2: POST new task
app.post('/tasks', (req, res) => {

    const newTask = req.body;

    if (!validateTask(newTask, true)) {
        return res.status(400).json({
            message: 'Invalid task details. All fields are required.'
        });
    }

    const id = newTask.id;

    const existingTask = tasks.find(t => t.id === id);

    if (existingTask) {
        return res.status(409).json({
            message: 'Task ID already exists.'
        });
    }

    const task = {
        id: newTask.id,
        taskName: newTask.taskName.trim(),
        assignedTo: newTask.assignedTo.trim(),
        status: newTask.status.trim(),
        priority: newTask.priority.trim()
    };

    tasks.push(task);

    res.status(201).json({
        message: 'Task added successfully',
        task: task
    });

});

// B2: PUT update task
app.put('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            message: 'Invalid task ID.'
        });
    }

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: 'Task not found.'
        });
    }

    if (!validateTask(req.body)) {
        return res.status(400).json({
            message: 'All task details are required for updating.'
        });
    }

    const updatedTask = {
        id: id,
        taskName: req.body.taskName.trim(),
        assignedTo: req.body.assignedTo.trim(),
        status: req.body.status.trim(),
        priority: req.body.priority.trim()
    };

    tasks[taskIndex] = updatedTask;

    res.status(200).json({
        message: 'Task updated successfully',
        task: updatedTask
    });

});

// B2: DELETE task
app.delete('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            message: 'Invalid task ID.'
        });
    }

    const taskIndex = tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({
            message: 'Task not found.'
        });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.status(200).json({
        message: 'Task deleted successfully',
        task: deletedTask
    });

});

// Handle invalid JSON and other errors
app.use((err, req, res, next) => {

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            message: 'Invalid JSON request.'
        });
    }

    res.status(500).json({
        message: 'Internal Server Error'
    });

});

// B1: Start Express server on port 4000
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});

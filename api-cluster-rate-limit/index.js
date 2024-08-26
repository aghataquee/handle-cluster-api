const express = require('express');
const cluster = require('cluster');
const os = require('os');
const rateLimiter = require('./rateLimiter');
const taskQueue = require('./taskQueue.js');
const { logTask } = require('./logger');

const numCPUs = 2; // Number of replica sets

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork(); // Restart the worker
    });
} else {
    const app = express();
    app.use(express.json());

    app.post('/api/v1/task', rateLimiter, async (req, res) => {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        try {
            await taskQueue.addTask(user_id, async () => {
                await task(user_id);
                logTask(user_id);
            });
            res.status(200).send({ message: 'Task is being processed' });
        } catch (err) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });

    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
}

// Task function
async function task(user_id) {
    console.log(`${user_id} - task completed at - ${Date.now()}`);
    // Simulate async operation
    return new Promise((resolve) => setTimeout(resolve, 1000));
}

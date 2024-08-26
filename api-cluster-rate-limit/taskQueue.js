const Redis = require('redis');
const { promisify } = require('util');

const client = Redis.createClient();
const lpushAsync = promisify(client.lpush).bind(client);
const rpopAsync = promisify(client.rpop).bind(client);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function processQueue() {
    while (true) {
        const task = await rpopAsync('taskQueue');
        if (task) {
            const { user_id, callback } = JSON.parse(task);
            await callback();
        }
        await sleep(1000); // Ensure only 1 task is processed per second per user
    }
}

processQueue();

async function addTask(user_id, callback) {
    await lpushAsync('taskQueue', JSON.stringify({ user_id, callback }));
}

module.exports = { addTask };

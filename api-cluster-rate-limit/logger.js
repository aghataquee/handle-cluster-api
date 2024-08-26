const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, 'task.log');

function logTask(user_id) {
    const log = `${user_id} - task completed at - ${new Date().toISOString()}\n`;
    fs.appendFile(logFilePath, log, (err) => {
        if (err) console.error('Error writing to log file', err);
    });
}

module.exports = { logTask };

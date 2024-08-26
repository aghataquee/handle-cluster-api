const rateLimitData = {};

function rateLimiter(req, res, next) {
    const user_id = req.body.user_id;
    if (!rateLimitData[user_id]) {
        rateLimitData[user_id] = { count: 0, timestamp: Date.now() };
    }

    const currentTime = Date.now();
    const timePassed = currentTime - rateLimitData[user_id].timestamp;

    if (timePassed > 60000) {
        rateLimitData[user_id].count = 0;
        rateLimitData[user_id].timestamp = currentTime;
    }

    if (rateLimitData[user_id].count >= 20) {
        return res.status(429).send({ error: 'Rate limit exceeded, try later' });
    }

    if (timePassed < 1000 && rateLimitData[user_id].count > 0) {
        return res.status(429).send({ error: 'Rate limit exceeded, try later' });
    }

    rateLimitData[user_id].count++;
    next();
}

module.exports = rateLimiter;

function cacheMiddleware(client) {
    return async function (req, res, next) {
        const newTemperature = req.body.temperature;
        const key = "maxTemperature";
        const cached = await client.get(key);

        const originalSend = res.send.bind(res);
        res.send = async (body) => {
            if (cached && newTemperature > cached) {
                await client.set(key, newTemperature, {EX: 3600});
                console.info(`update cache to ${newTemperature}`);
            }
            return originalSend(body);
        }

        next();
    };
}

export default cacheMiddleware;
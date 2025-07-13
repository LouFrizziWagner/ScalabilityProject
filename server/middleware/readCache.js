function readCacheMiddleware(client, key) {
    return async function (req, res, next) {
        const cached = await client.get(key);
        if (cached) {
            console.info(`read from cache ${cached}`)
            return res.status(200).send(cached);
        }

        const originalSend = res.send.bind(res);
        res.send = async (body) => {
            await client.set(key, body, {EX: 3600});
            return originalSend(body);
        }

        next();
    };
}

export default readCacheMiddleware;
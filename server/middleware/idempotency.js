function idempotencyMiddleware(client) {
    return async function (req, res, next) {
        const key = req.header('Idempotency-Key');
        if (!key) {
            return res.status(400).send("Missing Idempotency-Key in header");
        }

        const cached = await client.get(key);
        if (cached) {
            return res.send(JSON.parse(cached));
        }

        const originalSend = res.send.bind(res);
        res.send = async (body) => {
            await client.set(key, JSON.stringify({
                status: res.statusCode,
                body: body
            }), {EX: 3600});
            return originalSend(body);
        }

        next();
    };
}

export default idempotencyMiddleware;
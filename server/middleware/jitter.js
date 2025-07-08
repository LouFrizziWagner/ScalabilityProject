// middleware/jitter.js
function jitterMiddleware(minMs = 50, maxMs = 300) {
  return function (req, res, next) {
    const delay = Math.random() * (maxMs - minMs) + minMs;
    setTimeout(() => next(), delay);
  };
}

export default jitterMiddleware;
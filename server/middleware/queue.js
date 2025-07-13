/** Server side fifo queue
 * 
 * this queue implementation didn't result in significant better load distribution, therefore this is not implemented in the final project.
 */
// const MAX_CONCURRENT = 5;
// const MAX_QUEUE_SIZE = 100;
// const PROCESSING_DELAY_MS = 1000; 

// let active = 0;
// const queue = [];

// function processNext() {
//   while (queue.length > 0 && active < MAX_CONCURRENT) {
//     const nextReq = queue.shift();
//     active++;
//     nextReq();
//   }
// }

// function queueMiddleware(req, res, next) {
//   const handleRequest = () => {
//     // Simulate delay 
//     setTimeout(() => {
//       res.on('finish', () => {
//         active = Math.max(0, active - 1);
//         processNext();
//       });
//       next();
//     }, PROCESSING_DELAY_MS);
//   };

//   if (active < MAX_CONCURRENT) {
//     active++;
//     handleRequest();
//   } else if (queue.length < MAX_QUEUE_SIZE) {
//     queue.push(handleRequest);
//   } else {
//     res.status(503).json({ error: 'Server overloaded. Try again later.' });
//   }
// }

// setInterval(() => {
//   console.log(`[Queue] Active: ${active}, Queued: ${queue.length}`);
// }, 5000);

// export default queueMiddleware;
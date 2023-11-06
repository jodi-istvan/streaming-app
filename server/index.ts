import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { app } from './app.js';

dotenv.config({ path: '.env' });

const port = process.env.DEV_PORT;
const dbURI = process.env.MONGODB_URI;

try {
  await mongoose.connect(dbURI, {});
  console.log("DB connection successful");
} catch (err) {
  console.log(`DB connection failed: ${err}`);
}

const server = app.listen(port, () => {
  console.log(`App listening to changes on port ${port}`)
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(
    `Unhandled Rejection at: ${promise}\n` +
    `Rejection Reason: ${reason}`
  )
  server.close(() => {
    // This way we only shut the app down after server closes: finishes requests etc...
    process.exit(1)
  })
})

process.on('uncaughtException', (error, origin) => {
  console.error(
    `Caught exception: ${error}\n` +
    `Exception origin: ${origin}`
  )
  server.close(() => {
    // This way we only shut the app down after server closes: finishes requests etc...
    process.exit(1)
  })
})

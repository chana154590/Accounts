import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import uploadRouter from './routes/upload';
import { connectDB } from './config/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// routes
app.use('/upload', uploadRouter);

// health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// start
async function start() {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

start().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});

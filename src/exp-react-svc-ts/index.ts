// Initialize process env variables
import 'dotenv/config';

import { Server } from './server.js';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3002;

console.log('Initializing web service...');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../../dist')));

// API routes
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({ health: 'OK' });
});

// Frontend route - must be last
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

// Start server
const server = new Server(app);
server.start(port);

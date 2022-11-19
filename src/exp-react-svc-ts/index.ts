// Initialize process env variables

import * as dotenv from 'dotenv';

// Necessary to pass all environment variables
dotenv.config();

import {Server} from './server';
import express, {NextFunction, Request, Response} from 'express';

const app = express();
const port = 3002;


console.log('init web service');

app.use(express.json()) // Setting JSON as our body-parsing function for PUT and POST requests
    .use(express.urlencoded({extended: false}));

const server = new Server(app);
server.start(port);

// Send index.html on root request
app.use(express.static('dist'));
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({health: 'OK'});
});

// Front-end
app.get('/', (req: Request, res: Response) => {
    res.sendFile('/dist/index.html');
});

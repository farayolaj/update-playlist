import express from 'express';
import { createServer } from 'http';
import apolloServer from './server';

const app = express();

apolloServer.applyMiddleware({ app });

const httpServer = createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(5000, () => console.log('Server start on port 5000'));

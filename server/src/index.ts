import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuid } from 'uuid';

import { env } from './config/env';

import routes from './routes';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', routes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

io.on('connection', (socket) => {
  const userId = uuid();

  socket.emit('user_id', userId);

  socket.on('send_message', (data) => {
    const message = {
      id: uuid(),
      userId,
      message: data,
    };

    socket.emit('receive_message', message);
    socket.broadcast.emit('receive_message', message);
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(env.PORT, () =>
  console.log(`Server started at http://localhost:${env.PORT}`),
);

import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';
import http from 'http';
import { Server } from 'socket.io';
import bindRoutes from './routes.mjs';

const app = express();

const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.static('dist'));
app.use(express.json());


bindRoutes(app);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => { console.log('user disconnected'); });
    socket.on('online-game', (msg) => {
      console.log(`room: ${msg.gameId} ${msg.whiteId}`);
    });
    socket.on('startpage', (msg) => {
      io.emit('startpage', msg);
      console.log('server can receive');
    });
    socket.on('online-game', (msg) => {
      io.emit('online-game', msg);
    });
    socket.on('reload-board', (msg) => {
      console.log('reload-board msg :>> ', msg);
      io.emit('reload-board', msg);
    });
  });

const PORT = process.env.PORT || 3004;
app.listen(PORT);

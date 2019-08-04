import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import fetch from 'node-fetch';
import * as socketIO from 'socket.io';
import { Routes } from './routes/routes';

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();
  public io: SocketIO.Server;

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
    let ready = 0;
    const server = http.createServer(this.app);
    this.io = socketIO(server);

    this.io.on('connection', socket => {
      console.log(
        `new connection, current connections: ${Object.keys(
          this.io.sockets.sockets
        )}`
      ),
        socket.on('ready', (newScreen: boolean) => {
          console.log('ready');
          ready++;
          if (!newScreen) {
            if (ready === 1) {
              console.log('1 ready for search.');
            }
            if (ready === 2) {
              console.log('2 ready for search.');
              this.io.emit('allReady');
              ready = 0;
            }
          }
          if (newScreen) {
            console.log('ready, newScreen');
            ready = 0;
          }
          this.io.emit('readyOnServer', ready);
        });

      socket.on('points', () => {
        fetch('http://localhost:3001/points').then(async (points: any) => {
          const JSONpoints = await points.json();
          this.io.emit('points', JSONpoints.points);
        });
      });

      socket.on('term', () => {
        fetch('http://localhost:3001/term').then(async (data: any) => {
          const JSONData = await data.json();
          this.io.emit('term', JSONData.term);
          console.log(JSONData);
          console.log(JSONData.gameOver);
          if (JSONData.gameOver) {
            console.log('yes', JSONData.gameOver);
            this.io.emit('gameOver');
          }
          // round
        });
      });

      socket.on('data', () => {
        fetch(`http://localhost:3001/trend`).then(async termData => {
          const JSONTermData = await termData.json();
          this.io.emit('data', JSONTermData.message);
        });
      });

      socket.on('room', (room: string) => {
        if (this.isRoomFree(room)) {
          console.log(`client joined room ${room}`);
          socket.join(room);
          socket.emit(
            'team',
            `team${this.io.sockets.adapter.rooms[room].length}`
          );
          if (this.isRoomEmpty(room)) {
            console.log('empty room empty heart');
            ready = 0;
          }
        } else {
          console.log('room is full');
        }
      });

      socket.on('start', () => {
        console.log('start');
        fetch('http://localhost:3001/start').then(() => {
          socket.emit('start');
        });
      });

      socket.on('disconnect', () => {
        console.log('client disconnected');
      });
    });
    server.listen(3001, () => console.log('listening on port 3001'));
  }

  private isRoomFree(room: string) {
    const roomExists = this.io.sockets.adapter.rooms[room];
    if (roomExists) {
      return this.io.sockets.adapter.rooms[room].length < 2;
    } else {
      return true;
    }
  }
  private isRoomEmpty(room: string) {
    const roomExists = this.io.sockets.adapter.rooms[room];
    console.log('empty?', this.io.sockets.adapter.rooms[room].length);
    if (roomExists) {
      return this.io.sockets.adapter.rooms[room].length === 1;
    } else {
      return true;
    }
  }

  private config(): void {
    this.app.use(cors());
    this.app.options('*', cors()); // enable pre-flight
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }
}
export { App };

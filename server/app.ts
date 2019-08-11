import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import fetch from 'node-fetch';
import * as socketIO from 'socket.io';
import { DB } from './db/dbFunctions';

class App {
  public app: express.Application;
  public db: DB = new DB();
  public io: SocketIO.Server;

  constructor() {
    this.app = express();
    this.config();
    this.db.routes(this.app);
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
          ready++;
          if (ready === 2) {
            this.io.emit('allReady');
            ready = 0;
          }
          this.io.emit('readyOnServer', ready);
        });

      socket.on('points', async () => {
        const points = await this.db.getPoints();
        this.io.emit('points', points);
      });

      socket.on('term', () => {
        fetch('http://localhost:3001/term').then(async (data: any) => {
          const { term, gameOver } = await data.json();
          console.log(`term: ${term}, gameOver: ${gameOver}`);
          this.io.emit('term', term);
          if (gameOver) {
            this.io.emit('gameOver');
          }
        });
      });

      socket.on('data', () => {
        fetch(`http://localhost:3001/trend`).then(async termData => {
          const { message } = await termData.json();
          this.io.emit('data', message);
        });
      });

      socket.on('room', (room: string) => {
        if (this.isRoomFree(room)) {
          console.log(`client joined room ${room}`);
          socket.join(room);
          const nrOfTeamsInRoom = this.io.sockets.adapter.rooms[room].length;
          socket.emit('team', `team${nrOfTeamsInRoom}`);
          if (this.isRoomEmpty(room)) {
            ready = 0;
          }
        }
      });

      socket.on('start', async () => {
        await this.db.startGame();
        socket.emit('start');
      });

      socket.on('postTeamTerm', (team: string, term: string) => {
        fetch(`http://localhost:3001/term?team=${team}&searchTerm=${term}`, {
          headers: { 'Content-Type': 'text/html' },
          method: 'POST'
        })
          .then(() => {
            this.io.emit('postedTeamTerm', team);
          })
          .catch((error: any) => {
            console.log('POST_ERROR', error);
            this.io.emit('POST_ERROR', error);
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

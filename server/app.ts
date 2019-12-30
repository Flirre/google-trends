import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as socketIO from 'socket.io';
import { DB } from './db/dbFunctions';

class App {
  public app: express.Application;
  public db: DB = new DB();
  public io: SocketIO.Server;

  constructor() {
    this.app = express();
    this.config();
    const server = http.createServer(this.app);
    this.io = socketIO(server);

    this.io.on('connection', socket => {
      console.log(
        `new connection, current connections: ${Object.keys(
          this.io.sockets.sockets
        )}`
      ),
        socket.on('ready', async () => {
          await this.db.incrementReady();
          if (await this.db.bothPlayersReady()) {
            this.io.emit('allReady');
            await this.db.resetReady();
          }
          this.io.emit('readyOnServer', await this.db.getReadyPlayers());
          this.io
            .in(Object.keys(socket.rooms)[0])
            .emit('readyOnServer', await this.db.getReadyPlayers());
          console.log(socket.rooms);
        });

      socket.on('points', async () => {
        const points = await this.db.getPoints();
        this.io.emit('points', points);
      });

      socket.on('term', async () => {
        if (await this.db.noPlayersReady()) {
          await this.db.setNextTrendTerm();
        }
        if (await this.db.gameOver()) {
          this.io.emit('gameOver');
        }
        const term = await this.db.getTrendTerm();
        this.io.emit('term', term);
      });

      socket.on('data', async () => {
        const trendData = await this.db.getTrendData();
        this.io.emit('data', trendData);
      });

      socket.on('room', async (room: string) => {
        if (this.isRoomFree(room)) {
          console.log(`client joined room ${room}`);
          socket.join(room);
          const nrOfTeamsInRoom = this.io.sockets.adapter.rooms[room].length;
          socket.emit('team', `team${nrOfTeamsInRoom}`);
          if (this.isRoomEmpty(room)) {
            await this.db.resetReady();
            await this.db.startGame();
            await this.db.fetchTerms();
          }
        }
      });

      socket.on('start', async () => {
        socket.emit('start');
        await this.db.resetReady();
      });

      socket.on('postTeamTerm', async (team: string, term: string) => {
        await this.db.addTrendTerm(term, team);
        this.io.emit('postedTeamTerm', team);
      });

      socket.on('gameOver', async () => {
        socket.emit('gameOver');
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

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
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
    let num = 0;
    const server = http.createServer(this.app);
    this.io = socketIO(server);

    const incAndEmit = async (socket: socketIO.Socket) => {
      const result = await num++;
      socket.emit('increment', result);
    };

    this.io.on('connection', socket => {
      console.log(
        `new connection, current connections ${Object.keys(
          this.io.sockets.sockets
        )}`
      ),
        setInterval(() => incAndEmit(socket), 10000);

      // socket.on('message', (message: string) => {
      //   this.io.in('1234').emit('message', message);
      // });

      socket.on('room', (room: string) => {
        if (this.isRoomFree(room)) {
          console.log(this.io.sockets.adapter.rooms[room].length);
          console.log(`client joined room ${room}`);
          socket.join(room);
        } else {
          console.log('room is full');
        }
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

  private config(): void {
    this.app.use(cors());
    this.app.options('*', cors()); // enable pre-flight
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }
}
export { App };

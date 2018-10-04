import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from './routes/routes';
import * as googleTrends from 'google-trends-api';
import * as cors from 'cors';

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.app.use(cors());
    this.app.options('*', cors()); // enable pre-flight
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }
}

export default new App().app;

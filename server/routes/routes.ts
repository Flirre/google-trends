import { Firestore } from '@google-cloud/firestore';
import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as googleTrends from 'google-trends-api';

// Firebase setup
/* tslint:disable-next-line:no-var-requires */
const serviceAccount = require('../../../../.secrets/googletrends.json');

// weak attempt to avoid bots attacking fbase.
function reverso(str: any) {
  return str
    .split('')
    .reverse()
    .join('');
}
// very weak
const url2 = 'moc.oiesaberif.';
const url1 = 57323;
const url0 = '-sdnert//:sptth';
//

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: reverso(url0) + (url1 + 12345) + reverso(url2)
});

const db = admin.firestore();
const matchRef = db.collection('matches').doc('test-match');
const increment = admin.firestore.FieldValue.increment;

const points: any = { team1: 0, team2: 0 };
let round = 0;
const maxRounds = 2;
let trendTerm: string;
const searchTerms: any = {};
let possibleTerms: string[] = [];

export class Routes {
  public routes(app: Application): void {
    app.route('/start').get(async (req: Request, res: Response) => {
      this.fetchTerms().then(() => {
        res.status(200).send();
      });
    });

    app.route('/trend').get(async (req: Request, res: Response) => {
      this.getTrendData().then((trendData: any) => {
        res.status(200).send({
          message: trendData
        });
      });
    });

    app
      .route('/term')
      .get(async (req: Request, res: Response) => {
        this.setTrendTerm();
        res.status(200).send({
          gameOver: this.gameOver(),
          points,
          round,
          term: trendTerm
        });
      })
      .post(async (req: Request, res: Response) => {
        this.addTrendTerm(req.query.searchTerm, req.query.team);
        res.status(200).send(
          `Succesfully posted ${req.query.searchTerm}. Result: term - ${
            searchTerms[req.query.team]
          }.\n terms=${JSON.stringify(searchTerms)}
\n points=${JSON.stringify(points)}`
        );
      });

    app.route('/end').get(async (req: Request, res: Response) => {
      res.status(200).send({
        winner: this.calcWinner()
      });
    });
  }
  private addTrendTerm(searchTerm: string, team: string): void {
    searchTerms[team] = searchTerm;
    return;
  }

  private getTrendData(): any {
    let trendData: any = {};
    const team1Data: any = [];
    const team2Data: any = [];
    const { team1: term1, team2: term2 } = searchTerms;
    const trendPromise = googleTrends
      .interestOverTime({
        keyword: [`${trendTerm} ${term1}`, `${trendTerm} ${term2}`]
      })
      .then((results: any) => {
        const JSONresults = JSON.parse(results);
        const formattedResults = JSONresults.default.timelineData.slice(-12);
        formattedResults.forEach((data: any) => {
          team1Data.push({
            date: data.formattedTime,
            points: data.value[0],
            term: term1
          });
          team2Data.push({
            date: data.formattedTime,
            points: data.value[1],
            term: term2
          });
        });
        points.team1 += formattedResults[11].value[0];
        points.team2 += formattedResults[11].value[1];
        const setScore = matchRef.update({
          team1: increment(formattedResults[11].value[0]),
          team2: increment(formattedResults[11].value[1])
        });
        // generate empty data if both terms fail and no trend is found
        if (trendData.length < 1) {
          for (let i = 0; i < 12; i++) {
            team1Data.push({
              date: '',
              points: 0,
              term: term1
            });
            team2Data.push({
              date: '',
              points: 0,
              term: term2
            });
          }
        }
        trendData = { team1: team1Data, team2: team2Data };
        return trendData;
      })

      .catch((err: any) => {
        let brokenTrend = {};
        for (let i = 0; i < 12; i++) {
          const date = new Date();
          date.setFullYear(date.getFullYear() - 1);
          date.setMonth(date.getMonth() + i);
          const month = date.toString().substring(4, 7);
          const year = date.getFullYear();
          team1Data.push({
            date: `${month} ${year}`,
            points: 0,
            term: term1
          });
          team2Data.push({
            date: `${month} ${year}`,
            points: 0,
            term: term2
          });
        }
        brokenTrend = { team1: team1Data, team2: team2Data };
        return brokenTrend;
      });
    round++;
    return trendPromise;
  }

  private setTrendTerm(): void {
    trendTerm = possibleTerms[Math.floor(Math.random() * possibleTerms.length)];
  }

  /* tslint:disable */
  public fetchTerms(): any {
    return new Promise((resolve, reject) => {
      db.collection('terms')
        .doc('testTerms2')
        .get()
        .then(document => {
          if (document.data()) {
            return document.data();
          }
        })
        .then(document => {
          return document!.terms;
        })
        .then(terms => {
          possibleTerms = terms;
          resolve('fetch complete.');
        })
        .catch(err => {
          console.error(err);
        });
    });
  }
  /* tslint:enable */

  private gameOver(): boolean {
    return round === maxRounds;
  }

  private calcWinner(): string {
    const winner = Object.keys(points).reduce((a, b) => {
      return points[a] > points[b] ? a : b;
    });
    return winner;
  }
}

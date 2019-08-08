import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as admin from 'firebase-admin';
import * as googleTrends from 'google-trends-api';

// Firebase setup
import * as serviceAccount from '../db/serviceAccount.json';
import * as firebaseConfig from '../db/firebaseConfig.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: firebaseConfig.url
});

const db = admin.firestore();
const matchRef = db.collection('matches').doc('test-match');
const increment = admin.firestore.FieldValue.increment;

let trendTerm: string;
const searchTerms: any = {};
let possibleTerms: string[] = [];

export class DB {
  public routes(app: Application): void {
    app.route('/start').get(async (req: Request, res: Response) => {
      matchRef.update({
        currentTerm: '',
        maxRounds: 3,
        round: 0,
        team1: 0,
        team1Name: 'left',
        team2: 0,
        team2Name: 'right',
        termhistory: [],
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
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
          gameOver: await this.gameOver(),
          term: trendTerm
        });
      })
      .post(async (req: Request, res: Response) => {
        this.addTrendTerm(req.query.searchTerm, req.query.team);
        res.status(200).send(
          `Succesfully posted ${req.query.searchTerm}. Result: term - ${
            searchTerms[req.query.team]
          }.\n terms=${JSON.stringify(searchTerms)}
\n points=${JSON.stringify(await this.getPoints())}`
        );
      });

    app.route('/end').get(async (req: Request, res: Response) => {
      res.status(200).send({
        winner: await this.calcWinner()
      });
    });

    app.route('/points').get(async (req: Request, res: Response) => {
      res.status(200).send({
        points: await this.getPoints()
      });
    });
  }

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

  public getPoints(): Promise<{ team1: number; team2: number }> {
    return new Promise((resolve, reject) => {
      matchRef
        .get()
        .then(document => {
          if (document.data()) {
            return document.data();
          }
        })
        .then(document => {
          resolve({ team1: document!.team1, team2: document!.team2 });
        })
        .catch(err => {
          console.log(err);
          reject({ team1: 0, team2: 0 });
        });
    });
  }

  private addTrendTerm(searchTerm: string, team: string): void {
    searchTerms[team] = searchTerm;
    return;
  }

  private async getTrendData(): Promise<any> {
    let trendData: any = {};
    const team1Data: any = [];
    const team2Data: any = [];
    const { team1: term1, team2: term2 } = searchTerms;
    const trendPromise = googleTrends
      .interestOverTime({
        keyword: [`${trendTerm} ${term1}`, `${trendTerm} ${term2}`]
      })
      .then(async (results: any) => {
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
        await this.setPoints(
          formattedResults[11].value[0],
          formattedResults[11].value[1]
        );
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
    await this.incrementRound();
    return trendPromise;
  }

  private async setPoints(
    team1Points: number,
    team2Points: number
  ): Promise<FirebaseFirestore.WriteResult> {
    return matchRef.update({
      team1: increment(team1Points),
      team2: increment(team2Points)
    });
  }

  private incrementRound(): Promise<FirebaseFirestore.WriteResult> {
    return matchRef.update({
      round: admin.firestore.FieldValue.increment(1)
    });
  }

  private setTrendTerm(): void {
    trendTerm = possibleTerms[Math.floor(Math.random() * possibleTerms.length)];
  }

  private async gameOver(): Promise<boolean> {
    const documentData = await this.getDocumentData();
    const round = documentData!.round;
    const maxRounds = documentData!.maxRounds;
    return round >= maxRounds;
  }

  private async getDocumentData(): Promise<FirebaseFirestore.DocumentData> {
    try {
      const document = await matchRef.get();
      const documentData = await document.data()!;
      return documentData;
    } catch (error) {
      throw Error(error);
    }
  }

  private async calcWinner(): Promise<string> {
    const { team1, team2 } = await this.getPoints();
    const { team1Name, team2Name } = await this.getDocumentData();
    console.log(team1, team2, team1Name, team2Name);
    if (team1 > team2) {
      return team1Name;
    }
    if (team2 > team1) {
      return team2Name;
    } else {
      return 'DRAW';
    }
  }
}

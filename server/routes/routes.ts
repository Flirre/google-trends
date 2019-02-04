import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as googleTrends from 'google-trends-api';

const possibleTerms: string[] = [
  'Christmas',
  'Easter',
  'Thanksgiving',
  'Summer',
  'Winter'
];
const points: any = { team1: 0, team2: 0 };
let trendTerm: string;
const searchTerms: any = {};

export class Routes {
  public routes(app: Application): void {
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
          term: trendTerm
        });
      })
      .post(async (req: Request, res: Response) => {
        this.addTrendTerm(req.query.searchTerm, req.query.team);
        res
          .status(200)
          .send(
            `Succesfully posted ${req.query.searchTerm}. Result: term - ${
              searchTerms[req.query.team]
            }.\n terms=${JSON.stringify(searchTerms)}`
          );
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
        // generate empty data if both terms fail and no trend is found
        if (trendData.length < 1) {
          for (let i = 0; i < 12; i++) {
            team1Data.push({
              team1: { date: '', points: 0, term: term1 }
            });
            team2Data.push({
              team2: { date: '', points: 0, term: term2 }
            });
          }
        }
        trendData = { team1: team1Data, team2: team2Data };
        return trendData;
      })

      .catch((err: any) => {
        trendData.push({
          error: 'error'
        });
        return trendData;
      });
    return trendPromise;
  }

  // private getTrendData(): any {
  //   const trendData: any = [];
  //   const term0 = searchTerms;
  //   const trendPromise = googleTrends
  //     .interestOverTime({ keywords: [`${trendTerm} ${term0}`] })
  //     .then((results: any) => {
  //       const JSONresults = JSON.parse(results);
  //       const formattedResults = JSONresults.default.timelineData.slice(-12);
  //       formattedResults.forEach((data: any) => {
  //         trendData.push({
  //           date: data.formattedTime.substring(0, 3),
  //           [searchTerm]: data.value[0]
  //         });
  //       });
  //       // generate 0 data if no trend is found
  //       if (trendData.length < 1) {
  //         for (let i = 0; i < 12; i++) {
  //           trendData.push({
  //             date: '',
  //             [searchTerm]: 0
  //           });
  //         }
  //       }
  //       return trendData;
  //     })

  //     .catch((err: any) => {
  //       trendData.push({
  //         error: 'error'
  //       });
  //       return trendData;
  //     });
  //   return trendPromise;
  // }

  private setTrendTerm(): void {
    trendTerm = possibleTerms[Math.floor(Math.random() * possibleTerms.length)];
  }
}

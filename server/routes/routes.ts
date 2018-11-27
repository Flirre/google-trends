import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as googleTrends from 'google-trends-api';

let trendTerm: string;

export class Routes {
  public routes(app: Application): void {
    app.route('/trend').get(async (req: Request, res: Response) => {
      this.getTrendData(req.query.searchTerm).then((trendData: any) => {
        res.status(200).send({
          message: trendData
        });
      });
    });

    app.route('/term').get(async (req: Request, res: Response) => {
      this.setTrendTerm();
      res.status(200).send({
        term: trendTerm.toUpperCase()
      });
    });
  }

  private getTrendData(searchTerm: string): any {
    const trendData: any = [];
    const trendPromise = googleTrends
      .interestOverTime({ keyword: `${trendTerm} ${searchTerm}` })
      .then((results: any) => {
        const JSONresults = JSON.parse(results);
        const formattedResults = JSONresults.default.timelineData.slice(-12);
        formattedResults.forEach((data: any) => {
          trendData.push({
            date: data.formattedTime.substring(0, 3),
            [searchTerm]: data.value[0]
          });
        });
        // generate 0 data if no trend is found
        if (trendData.length < 1) {
          for (let i = 0; i < 12; i++) {
            trendData.push({
              date: '',
              [searchTerm]: 0
            });
          }
        }
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

  private setTrendTerm(): void {
    trendTerm = 'Christmas';
  }
}

import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as googleTrends from 'google-trends-api';
import * as cors from 'cors';

export class Routes {
  public routes(app: Application): void {
    let trendData: Array<any> = this.getTrendData();
    app.route('/').get((req: Request, res: Response) => {
      res.status(200).send({
        message: trendData
      });
    });
  }

  private getTrendData(): Array<any> {
    let trendData: Array<any> = [];

    googleTrends
      .interestOverTime({ keyword: "Women's march" })
      .then((results: any) => {
        let JSONresults = JSON.parse(results);
        let formattedResults = JSONresults['default']['timelineData'].slice(
          -12
        );
        formattedResults.forEach(function(data: any) {
          trendData.push({
            date: data['formattedTime'].substring(0, 3),
            value: data['value'][0]
          });
        });
      })
      .catch(function(err: any) {
        console.error('Error getting data from Google Trends. ', err);
        trendData.push({
          error: 'error'
        });
      });

    return trendData;
  }
}

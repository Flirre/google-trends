import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as googleTrends from 'google-trends-api';

export class Routes {
  public routes(app: Application): void {
    app.route('/').get(async (req: Request, res: Response) => {
      this.getTrendData(req.query.searchTerm).then((trendData: any) => {
        res.status(200).send({
          message: trendData
        });
      });
    });
  }

  private getTrendData(searchTerm: String): any {
    let trendData: any = [];
    const trendPromise = googleTrends
      .interestOverTime({ keyword: searchTerm })
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
        return trendData;
      })

      .catch(function(err: any) {
        console.error('Error getting data from Google Trends. ', err);
        trendData.push({
          error: 'error'
        });
        return trendData;
      });
    return trendPromise;
  }
}

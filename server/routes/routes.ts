import { Request, Response } from 'express';
import { Application } from 'express-serve-static-core';
import * as googleTrends from 'google-trends-api';

export class Routes {
  public routes(app: Application): void {
    app.route('/').get((req: Request, res: Response) => {
      googleTrends
        .interestOverTime({ keyword: "Women's march" })
        .then(function(results: any) {
          let JSONresults = JSON.parse(results);
          let formattedResults = JSONresults['default']['timelineData'];
          res.status(200).send({
            message: formattedResults.slice(
              formattedResults.length - 12,
              formattedResults.length
            )
          });
        })
        .catch(function(err: any) {
          console.error('Oh no there was an error', err);
        });
    });
  }
}

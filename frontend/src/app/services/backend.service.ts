import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class Route {
  public id: number;
  public date: Date;
  public distance: number;
  public duration: number;
  public traffic: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private httpClient: HttpClient;
  routes: Observable<Array<Route>>;
  averageDuration: Observable<number>;

  constructor(private http: HttpClient) {
    this.httpClient = http;
    this.routes = new Observable<Array<Route>>();
    this.fetchData();
  }

  private fetchData() {
    this.routes = this.httpClient.get(environment.restEndpoint, { observe: 'response' }).pipe(map(response => {
      let dd = response.body;

      let tableData2: Array<Route> = this.initData();
      tableData2.sort((e1: Route, e2: Route) => e2.date.getDate() - e1.date.getDate());
      return tableData2;
    }));
  }

  /**
   *
   * @param today
   */
  getTodaysRoute(today: Date): Observable<Route> {
    return this.routes.pipe(map((data: Route[]) => {
      for (let e of data) {
        if (e.date.valueOf() === today.valueOf()) {
          return e;
        }
      }
      return new Route();
    }));
  }
  /**
   *
   * @param fromDate
   * @param toDate
   */
  getAverageDistance(fromDate: Date, toDate: Date): Observable<number> {
    return this.routes.pipe(map((data: Route[]) => {
      let distance: number = 0;
      let count: number = 0;

      data.forEach((e: Route) => {
        if (fromDate <= e.date && toDate >= e.date) {
          count++;
          distance += e.distance;
        }
      });
      if (count > 0) {
        distance /= count;
      }
      return distance;
    }));
  }

  /**
   *
   * @param fromDate
   * @param toDate
   */
  getAverageDuration(fromDate: Date, toDate: Date): Observable<number> {
    return this.routes.pipe(map((data: Route[]) => {
      let duration: number = 0;
      let count: number = 0;

      data.forEach((e: Route) => {
        if (fromDate <= e.date && toDate >= e.date) {
          count++;
          duration += e.duration;
        }
      });
      if (count > 0) {
        duration /= count;
      }
      return duration;
    }));
  }

  /**
   *
   */
  getRoutes(): Observable<Route[]> {
    return this.routes;
  }


  private initData(): Array<Route> {
    var jsonData = [
      {
        id: 1,
        date: '02/01/2019',
        length: '120',
        duration: '10',
        traffic: 'moderate'
      },
      {
        id: 2,
        date: '02/02/2019',
        length: '120',
        duration: '20',
        traffic: 'moderate'
      },
      {
        id: 3,
        date: '02/03/2019',
        length: '120',
        duration: '30',
        traffic: 'moderate'
      },
      {
        id: 4,
        date: '02/04/2019',
        length: '120',
        duration: '40',
        traffic: 'low'
      },
      {
        id: 5,
        date: '02/05/2019',
        length: '120',
        duration: '50',
        traffic: 'high'
      },
      {
        id: 6,
        date: '02/06/2019',
        length: '120',
        duration: '60',
        traffic: 'moderate'
      },
      {
        id: 7,
        date: '02/07/2019',
        length: '120',
        duration: '70',
        traffic: 'moderate'
      },
      {
        id: 8,
        date: '02/08/2019',
        length: '120',
        duration: '80',
        traffic: 'moderate'
      },
      {
        id: 9,
        date: '02/09/2019',
        length: '120',
        duration: '90',
        traffic: 'moderate'
      },
      {
        id: 10,
        date: '02/10/2019',
        length: '100',
        duration: '100',
        traffic: 'moderate'
      },
      {
        id: 11,
        date: '02/11/2019',
        length: '110',
        duration: '110',
        traffic: 'moderate'
      },
      {
        id: 12,
        date: '02/12/2019',
        length: '120',
        duration: '120',
        traffic: 'moderate'
      },
      {
        id: 13,
        date: '02/13/2019',
        length: '120',
        duration: '130',
        traffic: 'moderate'
      },
      {
        id: 14,
        date: '02/14/2019',
        length: '120',
        duration: '140',
        traffic: 'moderate'
      },
      {
        id: 15,
        date: '02/15/2019',
        length: '120',
        duration: '150',
        traffic: 'moderate'
      }
    ];

    let rts = new Array<Route>();
    jsonData.forEach(e => {
      let rt = new Route();
      rt.id = Number(e.id);
      rt.date = new Date(e.date);
      rt.duration = Number(e.duration);
      rt.distance = Number(e.length);
      rt.traffic = e.traffic;
      rts.push(rt);
    });

    return rts;
  }
}

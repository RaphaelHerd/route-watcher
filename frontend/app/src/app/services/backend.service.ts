import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class Route {
  public id: string;
  public date: Date;
  public distance: number;
  public durationInTraffic: number;
  public duration: number;
  public traffic: string;
  public updatedAt: number;
  public source: string;
  public destination: string;
  public rank: number;
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
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers = headers.set('x-api-key', environment.apiKey);

    this.routes = this.httpClient.get(environment.restEndpoint, {headers: headers, observe: 'response' }).pipe(map(response => {

      let tableData2: Array<Route> = this.initData(JSON.stringify(response.body));
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
      let r: Route = new Route();
      let distance: number = 0;
      let duration: number = 0;
      let count: number = 0;

      for (let e of data) {
        if(e.date.getFullYear() === today.getFullYear() && e.date.getMonth() === today.getMonth() && e.date.getDay() === today.getDay()) {
          count ++;
          distance += e.distance;
          duration += e.duration;
        }
      }
      
      r.duration = duration / ((count > 0) ? count : 1);
      r.distance = distance / ((count > 0) ? count : 1);
      return r;
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

  /**
   * Parse received json data into Route object
   * @param data 
   */
  private initData(data: String): Array<Route> {
    var jsonData = JSON.parse(data.toString());
    let rts = new Array<Route>();
    let i: number = 0;
    jsonData.forEach(e => {
      let rt = new Route();
      i++;
      rt.rank = i;
      rt.date = new Date(e.date);
      rt.distance = Number(e.distance);
      rt.updatedAt = e.updatedAt;
      rt.destination = e.destination;
      rt.source = e.source;
      rt.durationInTraffic = e.duration_in_traffic;
      rt.id = e.id;
      rt.duration = Number(e.duration);
      rt.traffic = e.traffic;
      rts.push(rt);
    });

    return rts;
  }
}

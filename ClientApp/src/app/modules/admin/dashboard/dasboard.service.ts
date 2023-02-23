import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CONFIG } from "app/core/helpers";
import { IHomePageStats } from "app/core/models";
import { Observable, throwError } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";


@Injectable({ providedIn: 'root' })
export class DashboardService {

  private statsSubject: BehaviorSubject<IHomePageStats>;
  private _data: BehaviorSubject<any> = new BehaviorSubject(null);

  public stats$: Observable<IHomePageStats>;

  constructor(private router: Router, private http: HttpClient) {
    this.statsSubject = new BehaviorSubject<IHomePageStats>(null);
    this.stats$ = this.statsSubject.asObservable();
  }

  public get StatsValue(): IHomePageStats {
    return this.statsSubject.value;
  }

  /**
     * Getter for data
     */
  get data$(): Observable<any>
  {
      return this._data.asObservable();
  }
  
  getStats(userId) {
    const url = `${CONFIG.apiURL}${CONFIG.dashboardStats}/${userId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        // tap(s =>
        //  console.log(`Http response from getStats: ${JSON.stringify(s)}`)
        // ),
        map(stats => {
          this.statsSubject.next(stats);
          return stats;
        })
      );
  }

  getBuildingStats(buildingId) {
    const url = `${CONFIG.apiURL}/dashboard/getDBBuildingStats/${buildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  cancel() {
    this.statsSubject.next(null);
  }

  catchAuthErrors(error: { error: { message: any; }; message: any; }): Observable<Response> {
    if (error && error.error && error.error.message) { //clientside error
      console.log(`Client side error: ${error.error.message}`);
    } else if (error && error.message) { //server side error
      console.log(`Server side error: ${error.message}`);
    } else {
      console.log(`Error occurred: ${JSON.stringify(error)}`);
    }
    return throwError(error);
  }
}

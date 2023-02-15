import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONFIG } from "app/core/helpers";
import { IUmfaBuilding, IUmfaPartner, IUmfaPeriod } from "app/core/models";
import { BehaviorSubject, map, shareReplay } from "rxjs";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BuildingService {

  constructor(private http: HttpClient) { }

  //buildings
  getBuildingsForUser(userId: number): Observable<IUmfaBuilding[]> {
    const url = `${CONFIG.apiURL}${CONFIG.buildingsForUser}${userId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bl => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  //Partners
  getPartnersForUser(userId: number): Observable<IUmfaPartner[]> {
    const url = `${CONFIG.apiURL}${CONFIG.getPartners}${userId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(pr => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        }),
        map(pl => { return pl.Partners })
      );
  }

  //Periods
  getPeriodsForBuilding(umfaBuildingId: number): Observable<IUmfaPeriod[]> {
    const url = `${CONFIG.apiURL}${CONFIG.getPeriods}${umfaBuildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bps => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        }),
        map(bps => { return bps.Periods })
      );
  }
  
  //catches errors
  private catchErrors(error: { error: { message: any; }; message: any; }): Observable<Response> {
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

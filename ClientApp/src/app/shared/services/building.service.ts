import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONFIG } from "app/core/helpers";
import { IUmfaBuilding, IUmfaPartner, IUmfaPeriod } from "app/core/models";
import { BehaviorSubject, map, shareReplay } from "rxjs";
import { catchError, Observable, tap, throwError } from "rxjs";
import { IUmfaMeter } from "app/core/models/umfameter.model";
import { IMappedMeter } from "@core/models/mappedmeter.model";

@Injectable({ providedIn: 'root' })
export class BuildingService {

  private _buildings: BehaviorSubject<IUmfaBuilding[]> = new BehaviorSubject([]);
  private _partners: BehaviorSubject<IUmfaPartner[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) { }

  get buildings$(): Observable<IUmfaBuilding[]> {
    return this._buildings.asObservable();
  }

  get partners$(): Observable<IUmfaPartner[]> {
    return this._partners.asObservable();
  }

  //buildings
  getBuildingsForUser(userId: number): Observable<IUmfaBuilding[]> {
    const url = `${CONFIG.apiURL}${CONFIG.buildingsForUser}${userId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bl => {
          this._buildings.next(bl);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  //Get Building List for user
  getBuildingList(userId: number): Observable<IUmfaBuilding[]> {
    const url = `Dashboard/GetBuildingList/${userId}`;
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
          this._partners.next(pr.Partners);
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

  //Meters
  getMetersForBuilding(umfaBuildingId: number): Observable<IUmfaMeter[]> {
    const url = `${CONFIG.apiURL}${CONFIG.getAllUmfaMetersForBuilding}${umfaBuildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bps => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        }),
        map(bm => { return bm })
      );
  }

  getMappedMetersForBuilding(umfaBuildingId: number): Observable<IMappedMeter[]> {
    const url = `${CONFIG.apiURL}/MappedMeters/GetAllMappedMetersForBuilding/${umfaBuildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bps => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        }),
        map(bm => { return bm })
      );
  }
  
  addMappedMeter(data: any): Observable<any> {
    const url = `${CONFIG.apiURL}/MappedMeters/AddMappedMeter`;
    return this.http.post<any>(url, data, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bps => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        }),
        map(bm => { return bm })
      );
  }

  removeMappedMeter(meterId): Observable<any> {
    const url = `${CONFIG.apiURL}/MappedMeters/RemoveMappedMeter/${meterId}`;
    return this.http.delete<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bps => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        }),
        map(bm => { return bm })
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

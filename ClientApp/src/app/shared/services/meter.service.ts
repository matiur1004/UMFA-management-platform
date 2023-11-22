import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONFIG } from "app/core/helpers";
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from "rxjs";
import { IAmrMeter, AmrMeterUpdate, IUtility } from "../../core/models";
import { UserService } from '@shared/services/user.service';
@Injectable({ providedIn: 'root' })
export class MeterService {
  private _meters: BehaviorSubject<any> = new BehaviorSubject([]);
  private _metersWithAlarms: BehaviorSubject<any> = new BehaviorSubject([]);
  private _detailMeterAlarm: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private _userService: UserService) { }

  get meters$(): Observable<any> {
    return this._meters.asObservable();
  }

  get metersWithAlarms$(): Observable<any> {
    return this._metersWithAlarms.asObservable();
  }

  get detailMeterAlarm$(): Observable<any> {
    return this._detailMeterAlarm.asObservable();
  }

  getMetersForUser(userId: number): Observable<IAmrMeter[]> {
    const url = `${CONFIG.apiURL}${CONFIG.metersForUser}${userId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(m => {
          this._meters.next(m);
          //console.log(`getMetersForUser observable returned ${m}`);
        }),
      );
  }

  getMetersForUserChart(userId: number, chartId: number): Observable<IAmrMeter[]> {
    const url = `${CONFIG.apiURL}${CONFIG.metersForUserChart}${userId}/${chartId}?isTenant=${this._userService.userValue.IsTenant}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(m => {
          //console.log(`getMetersForUser observable returned ${m}`);
        }),
      );
  }

  getMeter(meterId: number): Observable<IAmrMeter> {
    if (meterId === 0) {
      return of(this.initializeAmrMeter());
    }
    const url = `${CONFIG.apiURL}${CONFIG.getMeter}${meterId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(m => {
          //console.log(`Http response from getMeter: ${JSON.stringify(m)}`)
        })
      );
  }

  updateMeter(updMeter: AmrMeterUpdate): Observable<IAmrMeter> {
    if (updMeter.Meter.Id === 0) {
      //create a new meter
      url = `${CONFIG.apiURL}${CONFIG.addMeter}`;
      return this.http.post<any>(url, updMeter, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(m => {
            //console.log(`Http response from updateMeter: ${JSON.stringify(m)}`)
          })
        );
    } else {
      var url = `${CONFIG.apiURL}${CONFIG.updateMeter}`;
      return this.http.put<any>(url, updMeter, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(m => {
            //console.log(`Http response from updateMeter: ${JSON.stringify(m)}`)
          })
        );
    }
  }

  getUtilties(): Observable<IUtility[]> {
    const url = `${CONFIG.apiURL}${CONFIG.getUtilities}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(m => {
          //console.log(`Http response from getUtilties: ${JSON.stringify(m)}`)
        })
      );
  }

  initializeAmrMeter(): IAmrMeter {
    // Return an initialized object
    return {
      Id: 0,
      MeterNo: '',
      Description: '',
      UserId: 0,
      BuildingId: 0,
      BuildingName: '',
      UmfaId: 0,
      MakeModelId: 0,
      Make: '',
      Model: '',
      Phase: 1,
      CbSize: 0,
      CtSizePrim: 5,
      CtSizeSec: 5,
      ProgFact: 1,
      Digits: 7,
      Active: true,
      CommsId: '',
      MeterSerial: '',
      UtilityId: 0,
      Utility: '',
    };
  }

  // amr alarm configuration
  getAMRMetersWithAlarms(buildingId) {
    const url = `${CONFIG.apiURL}/AMRMeter/getAMRMetersWithAlarms/${buildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bl => {
          this._metersWithAlarms.next(bl);
        })
      );
  }

  onSelectMeterAlarm(data) {
    this._detailMeterAlarm.next(data);
  }

  destroy() {

  }
  
  //catches errors
  private catchErrors(error: { error: { message: any; }; message: any; }): Observable<Response> {
    if (error && error.error && error.error.message) { //clientside error
      console.log(`Client side error: ${error.error.message}`);
    } else if (error && error.error) { //server side error with custom msg
      console.log(`Server side error: ${error.error}`);
    } else if (error && error.message) { //server side error
      console.log(`Server side error: ${error.message}`);
    } else {
      console.log(`Error occurred: ${JSON.stringify(error)}`);
    }
    return throwError(error);
  }

}

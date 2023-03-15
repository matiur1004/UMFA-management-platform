import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '@core/helpers';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationScheduleService {

  private _senderTypes: BehaviorSubject<any> = new BehaviorSubject([]);
  private _summaryTypes: BehaviorSubject<any> = new BehaviorSubject([]);
  
  constructor(private http: HttpClient) { }

  get senderTypes$(): Observable<any> {
    return this._senderTypes.asObservable();
  }

  get summaryTypes$(): Observable<any> {
    return this._summaryTypes.asObservable();
  }

  getAllNotificationSendTypes() {
    const url = `${CONFIG.apiURL}/UserNotificationSchedules/getAllNotificationSendTypes`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bl => {
          this._senderTypes.next(bl);
        })
      );
  }

  getAllNotificationSummaryTypes() {
    const url = `${CONFIG.apiURL}/UserNotificationSchedules/getAllNotificationSummaryTypes`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bl => {
          this._summaryTypes.next(bl);
        })
      );
  }

  getAllForUser(userId) {
    const url = `${CONFIG.apiURL}/UserNotificationSchedules/getAllUserForUser/${userId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bl => {
        })
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

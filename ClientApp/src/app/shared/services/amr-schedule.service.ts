import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '@core/helpers';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AMRScheduleService {

    private _scadaRequestHeaders: BehaviorSubject<any> = new BehaviorSubject([]);
    private _scadaRequestHeaderDetail: BehaviorSubject<any> = new BehaviorSubject([]);
    private _scadaRequestDetails: BehaviorSubject<any> = new BehaviorSubject([]);
    private _scheduleStatus: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(private http: HttpClient, private notificationService: NotificationService,) { }

    get scadaRequestHeaders$(): Observable<any> {
      return this._scadaRequestHeaders.asObservable();
    }

    get scadaRequestHeaderDetail$(): Observable<any> {
        return this._scadaRequestHeaderDetail.asObservable();
    }

    get scheduleStatus$(): Observable<any> {
      return this._scheduleStatus.asObservable();
    }

    get scadaRequestDetails$(): Observable<any> {
      return this._scadaRequestDetails.asObservable();
    }

    getScadaRequestHeaders() {
        const url = `${CONFIG.apiURL}/ScadaRequestHeaders/getScadaRequestHeaders`;
        return this.http.get<any>(url, { withCredentials: true })
          .pipe(
            catchError(err => this.catchErrors(err)),
            tap(bl => {
              this._scadaRequestHeaders.next(bl);
            })
          );
    }

    getScadaRequestHeaderDetail(id) {
      const url = `${CONFIG.apiURL}/ScadaRequestHeaders/getScadaRequestHeader/${id}`;
      return this.http.get<any>(url, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
              this._scadaRequestHeaderDetail.next(bl);
          })
        );
    }

    getScheduleStatus() {
      const url = `${CONFIG.apiURL}/ScheduleStatus/getAll`;
        return this.http.get<any>(url, { withCredentials: true })
          .pipe(
            catchError(err => this.catchErrors(err)),
            tap(res => {
              this._scheduleStatus.next(res);
            })
          );
    }

    getScadaRequestDetails() {
      const url = `${CONFIG.apiURL}/ScadaRequestDetails/getScadaRequestDetails`;
      return this.http.get<any>(url, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
              this._scadaRequestDetails.next(bl);
          })
        );
    }

    deleteScadaRequestHeader(id) {
      const url = `${CONFIG.apiURL}/ScadaRequestHeaders/deleteScadaRequestHeader/${id}`;
      return this.http.delete<any>(url, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
            this.notificationService.message('Removed successfully!');
          })
        );
    }

    deleteScadaRequestDetail(id){
      const url = `${CONFIG.apiURL}/ScadaRequestDetails/deleteScadaRequestDetail/${id}`;
      return this.http.delete<any>(url, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
            this.notificationService.message('Removed successfully!');
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
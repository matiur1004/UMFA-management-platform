import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '@core/helpers';
import { BehaviorSubject, catchError, Observable, of, tap, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AMRScheduleService {

    private _scadaRequestHeaders: BehaviorSubject<any> = new BehaviorSubject([]);
    private _scadaRequestHeaderDetail: BehaviorSubject<any> = new BehaviorSubject([]);
    private _scadaRequestDetails: BehaviorSubject<any> = new BehaviorSubject([]);
    private _scheduleStatus: BehaviorSubject<any> = new BehaviorSubject([]);
    private _jobStatus: BehaviorSubject<any> = new BehaviorSubject([]);
    private _meters: BehaviorSubject<any> = new BehaviorSubject([]);
    private _newScada: BehaviorSubject<any> = new BehaviorSubject({});

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

    get jobStatus$(): Observable<any> {
      return this._jobStatus.asObservable();
    }

    get meters$(): Observable<any> {
      return this._meters.asObservable();
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
      if(id == 0) {
        return of(null)
          .pipe(
            catchError(err => this.catchErrors(err)),
            tap(bl => {
                this._scadaRequestHeaderDetail.next(bl);
            })
          );
      } else {
        const url = `${CONFIG.apiURL}/ScadaRequestHeaders/getScadaRequestHeader/${id}`;
        return this.http.get<any>(url, { withCredentials: true })
          .pipe(
            catchError(err => this.catchErrors(err)),
            tap(bl => {
                this._scadaRequestHeaderDetail.next(bl);
            })
          );
      }
      
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

    getScadaRequestDetails(headerId) {
      const url = `${CONFIG.apiURL}/ScadaRequestDetails/getScadaRequestDetailByHeaderId/${headerId}`;
      return this.http.get<any>(url, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
              this._scadaRequestDetails.next(bl);
          })
        );
    }

    createOrUpdateRequestHeaderTable(formData) {
      const url = `${CONFIG.apiURL}/ScadaRequestHeaders/createOrUpdateRequestHeaderTable`;
      return this.http.post<any>(url, formData, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
            this.notificationService.message(formData['Id'] ? 'Updated successfully!' : 'Created successfully');
          })
        );
    }

    createOrUpdateRequestDetailTable(formData) {
      const url = `${CONFIG.apiURL}/ScadaRequestDetails/createOrUpdateRequestDetailTable`;
      return this.http.post<any>(url, formData, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
            this.notificationService.message(formData['Id'] ? 'Updated successfully!' : 'Created successfully');
          })
        );
    }

    addScadaRequestDetailItem(formData) {
      const url = `${CONFIG.apiURL}/ScadaRequestDetails/addScadaRequestDetailItem`;
      return this.http.post<any>(url, formData, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
            this.notificationService.message('Created successfully');
          })
        );
    }

    updateRequestHeaderStatus(detailId) {
      const url = `${CONFIG.apiURL}/ScadaRequestHeaders/updateRequestHeaderStatus/${detailId}`;
      return this.http.post<any>(url, {}, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
            this.notificationService.message('Reset successfully!');
          })
        );
    }

    updateRequestDetailStatus(detailId) {
      const url = `${CONFIG.apiURL}/ScadaRequestDetails/updateRequestDetailStatus/${detailId}`;
      return this.http.post<any>(url, {}, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(bl => {
            this.notificationService.message('Reset successfully!');
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

    getJobStatus() {
      const url = `${CONFIG.apiURL}/JobStatus/getAll`;
      return this.http.get<any>(url, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(res => {
            this._jobStatus.next(res);
          })
        );
    }

    getAmrMetersForBuilding(buildingId) {
      const url = `${CONFIG.apiURL}/ScadaRequestDetails/getAmrMetersForBuilding/${buildingId}`;
      return this.http.get<any>(url, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          tap(res => {
            this._meters.next(res);
          })
        );
    }

    moveToDifferentSchedule(formData) {
      const url = `${CONFIG.apiURL}/AMRMeter/meter/schedules`;
      return this.http.put<any>(url, formData, { withCredentials: true})
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(res => {
          this._newScada.next(res);
        })
      )
    }

    downloadSchedules(formData) {
      const url = `${CONFIG.apiURL}/AMRMeter/meter/jobs`
      return this.http.post<any>(url, formData, { withCredentials: true})
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(res => {
          this.notificationService.message('ACCEPTED');
        })
      )
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
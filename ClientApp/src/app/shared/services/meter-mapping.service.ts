import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '@core/helpers';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class MeterMappingService {

  private _registerTypes: BehaviorSubject<any> = new BehaviorSubject([]);
  private _timeOfUses: BehaviorSubject<any> = new BehaviorSubject([]);
  private _supplyTypes: BehaviorSubject<any> = new BehaviorSubject([]);
  private _supplyToItems: BehaviorSubject<any> = new BehaviorSubject([]);
  private _locationTypes: BehaviorSubject<any> = new BehaviorSubject([]);
  
  constructor(private http: HttpClient, private notificationServices: NotificationService) { }

  get registerTypes$(): Observable<any> {
    return this._registerTypes.asObservable();
  }

  get timeOfUses$(): Observable<any> {
    return this._timeOfUses.asObservable();
  }

  get supplyTypes$(): Observable<any> {
    return this._supplyTypes.asObservable();
  }

  get supplyToItems$(): Observable<any> {
    return this._supplyToItems.asObservable();
  }

  get locationTypes$(): Observable<any> {
    return this._locationTypes.asObservable();
  }

  getAllRegisterTypes() {
    const url = `${CONFIG.apiURL}/MappedMeters/getAllRegisterTypes`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(bl => {
          this._registerTypes.next(bl);
        })
      );
  }

  getAllTimeOfUse() {
    const url = `${CONFIG.apiURL}/MappedMeters/getAllTimeOfUse`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(res => {
          this._timeOfUses.next(res);
        })
      );
  }

  getAllSupplyTypes() {
    const url = `${CONFIG.apiURL}/MappedMeters/getAllSupplyTypes`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(res => {
          this._supplyTypes.next(res);
        })
      );
  }

  getAllSupplyTo() {
    const url = `${CONFIG.apiURL}/MappedMeters/getAllSuppliesTo`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(res => {
          this._supplyToItems.next(res);
        })
      );
  }

  getAllLocationTypes() {
    const url = `${CONFIG.apiURL}/MappedMeters/getAllLocationTypes`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        tap(res => {
          this._locationTypes.next(res);
        })
      );
  }

  updateMappedMeter(formData, Id) {
    const url = `${CONFIG.apiURL}/MappedMeters/UpdateMappedMeter/${Id}`;
    return this.http.put<any>(url, formData, {withCredentials: true})
    .pipe(
      catchError(err => this.catchErrors(err)),
      tap(res => {
        this.notificationServices.message("Updated Successfully.");
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

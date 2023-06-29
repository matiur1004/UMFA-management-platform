import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONFIG } from '@core/helpers';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UmfaService {

    private _shops: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(private http: HttpClient) { }

    get shops$(): Observable<any> {
        return this._shops.asObservable();
    }

    getUmfaShops(buildingId, periodId) {
        const url = `${CONFIG.apiURL}/Umfa/shops?buildingId=${buildingId}&periodId=${periodId}`;
        return this.http.get<any>(url, { withCredentials: true })
          .pipe(
            catchError(err => this.catchErrors(err)),
            tap(bl => {
              this._shops.next(bl);
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
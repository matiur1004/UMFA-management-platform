import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONFIG } from "@core/helpers";
import { BehaviorSubject, Observable, catchError, tap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserNotificationsService {

    private _userNotifications: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(private http: HttpClient) { }

    get userNotifications$(): Observable<any> {
        return this._userNotifications.asObservable();
    }

    getUserAlarmNotificationConfig(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/UserAlarmNotificationsConfig/getUserAlarmNotificationConfig`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._userNotifications.next(m);
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }
    
    setUserAlarmNotification(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/UserAlarmNotificationsConfig/setUserAlarmNotification`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
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
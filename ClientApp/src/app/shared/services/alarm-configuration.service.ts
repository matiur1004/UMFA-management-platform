import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ALERT_MODAL_CONFIG } from "@core/config/modal.config";
import { CONFIG } from "@core/helpers";
import { UmfaUtils } from "@core/utils/umfa.utils";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AlarmConfigurationService {

    profileInfo: any;
    
    constructor(
        private http: HttpClient,
        private _ufUtils: UmfaUtils
    ) { }
    
    // AlarmNightFlow/getAlarmConfigNightFlow
    getAlarmConfigNightFlow(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmNightFlow/getAlarmConfigNightFlow`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmAnalyzeNightFlow(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmNightFlow/getAlarmAnalyzeNightFlow`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    showAlert(title: string) {
        const dialogRef = this._ufUtils.fuseConfirmDialog(
        ALERT_MODAL_CONFIG,
          '',
        title);
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

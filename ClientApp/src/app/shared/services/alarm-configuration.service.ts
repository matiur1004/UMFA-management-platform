import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ALERT_MODAL_CONFIG } from "@core/config/modal.config";
import { CONFIG } from "@core/helpers";
import { UmfaUtils } from "@core/utils/umfa.utils";
import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: 'root' })
export class AlarmConfigurationService {

    profileInfo: any;
    selectedBuilding: number;
    selectedPartner: number;
    
    private _alarmMeterDetail: BehaviorSubject<any> = new BehaviorSubject(null);
    private _metersWithAlarms: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(
        private http: HttpClient,
        private _ufUtils: UmfaUtils,
        private _notificationService: NotificationService
    ) { }
    
    get alarmMeterDetail$(): Observable<any> {
        return this._alarmMeterDetail.asObservable();
    }

    get metersWithAlarms$(): Observable<any> {
        return this._metersWithAlarms.asObservable();
    }
    
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

    getAlarmConfigBurstPipe(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmBurstPipe/getAlarmConfigBurstPipe`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmAnalyzeBurstPipe(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmBurstPipe/getAlarmAnalyzeBurstPipe`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmConfigLeakDetection(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmLeakDetection/getAlarmConfigLeakDetection`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmAnalyzeLeakDetection(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmLeakDetection/getAlarmAnalyzeLeakDetection`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmConfigAvgUsage(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmAverageUsage/getAlarmConfigAvgUsage`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmAnalyzeAvgUsage(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmAverageUsage/getAlarmAnalyzeAvgUsage`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmConfigPeakUsage(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmPeakUsage/getAlarmConfigPeakUsage`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmAnalyzePeakUsage(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmPeakUsage/getAlarmAnalyzePeakUsage`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }


    getAlarmConfigDailyUsage(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmDailyUsage/getAlarmConfigDailyUsage`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmAnalyzeDailyUsage(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmDailyUsage/getAlarmAnalyzeDailyUsage`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getAlarmMeterDetail(id) {
        const url = `${CONFIG.apiURL}/AMRMeterAlarms/getSingle/${id}`;
        return this.http.get<any>(url, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._alarmMeterDetail.next(m);
                }),
            );
    }

    createOrUpdateAMRMeterAlarm(formData): Observable<any> {
        const url = `${CONFIG.apiURL}/AMRMeterAlarms/createOrUpdateAMRMeterAlarmByAlarmTypeName`;
        return this.http.post<any>(url, formData, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._notificationService.message(formData['AMRMeterAlarmId'] ? 'Updated successfully' : 'Created successfully');
                }),
            );
    }

    getAlarmsByBuilding(buildingId) : Observable<any> {
        const url = `${CONFIG.apiURL}/AlarmsPerBuilding/getAlarmsByBuilding/${buildingId}`;
        return this.http.get<any>(url, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._metersWithAlarms.next(m);
                }),
            );
    }

    delete(id): Observable<any> {
        const url = `${CONFIG.apiURL}/AMRMeterAlarms/delete/${id}`;
        return this.http.delete<any>(url, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._notificationService.message('Deleted successfully!');
                }),
            );
    }

    showAlert(title: string) {
        const dialogRef = this._ufUtils.fuseConfirmDialog(
        ALERT_MODAL_CONFIG,
          '',
        title);
    }

    destroy() {
        this._alarmMeterDetail.next(null);
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

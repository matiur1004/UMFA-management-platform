import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "@shared/services";
import { CONFIG } from "app/core/helpers";
import { IHomePageStats } from "app/core/models";
import { Observable, throwError } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";


@Injectable({ providedIn: 'root' })
export class DashboardService {

  private statsSubject: BehaviorSubject<IHomePageStats>;
  private _data: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenantSlip: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenantSlipCriteria: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenantSlipTenants: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenantSlipTenantShops: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenantSlipsReports: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenantSlipDetail: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenantSlipData: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenantSlipDownloads: BehaviorSubject<any> = new BehaviorSubject(null);
  private _buildingReports: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopList: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shops: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopDetail: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopDetailDashboard: BehaviorSubject<any> = new BehaviorSubject(null);

  private _reportsArchives: BehaviorSubject<any> = new BehaviorSubject(null);
  
  public stats$: Observable<IHomePageStats>;
  public alarmTriggeredId: any;

  private _alarmTriggerDetail: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private router: Router, 
    private http: HttpClient,
    private _notificationService: NotificationService){
    this.statsSubject = new BehaviorSubject<IHomePageStats>(null);
    this.stats$ = this.statsSubject.asObservable();
  }

  get tenantSlip$(): Observable<any> {
    return this._tenantSlip.asObservable();
  }

  get tenantSlipDetail$(): Observable<any> {
    return this._tenantSlipDetail.asObservable();
  }

  get tenantSlipData$(): Observable<any> {
    return this._tenantSlipData.asObservable();
  }
  
  public get StatsValue(): IHomePageStats {
    return this.statsSubject.value;
  }

  get tenantSlipCriteria$(): Observable<any> {
    return this._tenantSlipCriteria.asObservable();
  }

  get tenantSlipTenants$(): Observable<any> {
    return this._tenantSlipTenants.asObservable();
  }
  
  get tenantSlipTenantShops$(): Observable<any> {
    return this._tenantSlipTenantShops.asObservable();
  }

  get tenantSlipsReports$(): Observable<any> {
    return this._tenantSlipsReports.asObservable();
  }

  get tenantSlipDownloads$(): Observable<any> {
    return this._tenantSlipDownloads.asObservable();
  }
  
  get reportsArchives$(): Observable<any> {
    return this._reportsArchives.asObservable();
  }

  get buildingReports$(): Observable<any> {
    return this._buildingReports.asObservable();
  }

  get shopList$(): Observable<any> {
    return this._shopList.asObservable();
  }

  get shops$(): Observable<any> {
    return this._shops.asObservable();
  }

  get shopDetail$(): Observable<any> {
    return this._shopDetail.asObservable();
  }

  get shopDetailDashboard$(): Observable<any> {
    return this._shopDetailDashboard.asObservable();
  }

  /**
     * Getter for data
     */
  get data$(): Observable<any>
  {
      return this._data.asObservable();
  }
  
  get alarmTriggerDetail$(): Observable<any>{
      return this._alarmTriggerDetail.asObservable();
  }

  getStats(userId) {
    const url = `${CONFIG.apiURL}${CONFIG.dashboardStats}/${userId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        // tap(s =>
        //  console.log(`Http response from getStats: ${JSON.stringify(s)}`)
        // ),
        map(stats => {
          this.statsSubject.next(stats);
          return stats;
        })
      );
  }

  getBuildingStats(buildingId) {
    const url = `${CONFIG.apiURL}/Dashboard/getDBBuildingStats/${buildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getTenantSlips(buildingId) {
    const url = `${CONFIG.apiURL}/TenantSlips/CardInfo?buildingId=${buildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(res => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getTenantSlipsReports(buildingId, periodId, reportTypeId) {
    const url = `${CONFIG.apiURL}/TenantSlips/Reports?buildingId=${buildingId}&periodId=${periodId}&reportTypeId=${reportTypeId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(res => {
          this._tenantSlipsReports.next(res);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getTenantSlipsCriteria(buildingId) {
    const url = `${CONFIG.apiURL}/TenantSlips/Criteria?buildingId=${buildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(res => {
          this._tenantSlipCriteria.next({...res, BuildingId: buildingId});
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getTenantSlipData(params) {
    const url = `${CONFIG.apiURL}/TenantSlips/Data`;
    return this.http.put<any>(url, params, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(res => {
          this._tenantSlipData.next(res);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getTenantsWithBuildingAndPeriod(buildingId, periodId) {
    const url = `${CONFIG.apiURL}/Umfa/tenants?buildingId=${buildingId}&periodId=${periodId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(res => {
          this._tenantSlipTenants.next(res);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getTenantShops(buildingId, periodId, tenantId, reportType) {
    const url = `${CONFIG.apiURL}/Umfa/tenant-shops?buildingId=${buildingId}&periodId=${periodId}&tenantId=${tenantId}&reportTypeId=${reportType}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(res => {
          this._tenantSlipTenantShops.next(res);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getAlarmTriggered(alarmTriggeredId) {
    const url = `${CONFIG.apiURL}/AlarmTriggered/getAlarmTriggered`;
    return this.http.post<any>(url, {AMRMeterTriggeredAlarmId: alarmTriggeredId}, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._alarmTriggerDetail.next(bl);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  updateAcknowledged(alarmTriggeredId) {
    const url = `${CONFIG.apiURL}/AlarmTriggered/updateAcknowledged`;
    return this.http.post<any>(url, {AMRMeterTriggeredAlarmId: alarmTriggeredId}, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._notificationService.message('Acknowledged successfully!');
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getReportsArchives(userId) {
    const url = `${CONFIG.apiURL}/Reports/Archives?userId=${userId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._reportsArchives.next(bl);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  onReportsArchives(data) {
    const url = `${CONFIG.apiURL}/Reports/Archives`;
    return this.http.post<any>(url, data, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getShopsByBuildingId(buildingId) {
    const url = `${CONFIG.apiURL}/Dashboard/buildings/${buildingId}/shops`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._shops.next(bl);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  getShopDashboardDetail(buildingId, shopId, history = 36) {
    const url = `${CONFIG.apiURL}/Dashboard/buildings/${buildingId}/shops/${shopId}?history=${history}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._shopDetail.next(bl);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  showShopDetailDashboard(data) {
    this._shopDetailDashboard.next(data);
  }

  destroyTenantSlips() {
    this._tenantSlipsReports.next(null);
  }

  destroyShopList() {
    
  }

  destroyShopDetail() {
    this._shopDetailDashboard.next(null);
  }

  showTenantSlip(buildingId) {
    this._tenantSlip.next(buildingId);
  }
  
  showTenantSlipDetail(data) {
    this._tenantSlipDetail.next(data);
  }

  showDownloads() {
    this._tenantSlipDownloads.next(true);
  }

  showReports(buildingId) {
    this._buildingReports.next(buildingId);
  }

  showShopList(data) {
    this._shopList.next(data);
  }

  destroyTenantSlipDetail() {
    this._tenantSlipDetail.next(null);
  }

  destroy() {
    this._buildingReports.next(null);
    this._tenantSlip.next(null);
    this._tenantSlipDetail.next(null);
    this._tenantSlipDownloads.next(null);
    this._alarmTriggerDetail.next(null);
    this._shopList.next(null);
  }

  cancel() {
    this.statsSubject.next(null);
  }

  catchAuthErrors(error: { error: { message: any; }; message: any; }): Observable<Response> {
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

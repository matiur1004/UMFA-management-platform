import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { IUmfaMeter } from "@core/models/umfameter.model";
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
  private _tenantsList: BehaviorSubject<any> = new BehaviorSubject(null);
  private _tenants: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopDetail: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopDetailDashboard: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopBilling: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopBillingDetail: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopOccupation: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopOccupationDetails: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopAssignedMeters: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopAssignedMetersDetails: BehaviorSubject<any> = new BehaviorSubject(null);
  private _metersForBuilding: BehaviorSubject<any> = new BehaviorSubject(null);

  private _shopReadings: BehaviorSubject<any> = new BehaviorSubject(null);
  private _shopReadingsDetails: BehaviorSubject<any> = new BehaviorSubject(null);

  private _reportsArchives: BehaviorSubject<any> = new BehaviorSubject(null);
  private _clientFeedbackReports: BehaviorSubject<any> = new BehaviorSubject(null);
  
  public stats$: Observable<IHomePageStats>;
  public alarmTriggeredId: any;
  public selectedShopInfo: any;
  public selectedTenantSlipInfo: any;
  public selectedTriggeredAlarmInfo: any;
  public isTenant: boolean;

  private _alarmTriggerDetail: BehaviorSubject<any> = new BehaviorSubject(null);
  private _triggeredAlarmsPage: BehaviorSubject<any> = new BehaviorSubject(null);
  private _triggeredAlarmsList: BehaviorSubject<any> = new BehaviorSubject(null);
  private _triggeredAlarmDetailPage: BehaviorSubject<any> = new BehaviorSubject(null);
  
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

  get shopBilling$(): Observable<any> {
    return this._shopBilling.asObservable();
  }

  get shopBillingDetail$(): Observable<any> {
    return this._shopBillingDetail.asObservable();
  }
  
  get shopOccupation$(): Observable<any> {
    return this._shopOccupation.asObservable();
  }

  get shopOccupationsDashboard$(): Observable<any> {
    return this._shopOccupationDetails.asObservable();
  }

  get shopAssignedMeters$(): Observable<any> {
    return this._shopAssignedMeters.asObservable();
  }

  get shopAssignedMetersDashboard$(): Observable<any> {
    return this._shopAssignedMetersDetails.asObservable();
  }

  get shopReadings$(): Observable<any> {
    return this._shopReadings.asObservable();
  }

  get shopReadingsDashboard$(): Observable<any> {
    return this._shopReadingsDetails.asObservable();
  }

  get metersForBuilding$(): Observable<any> {
    return this._metersForBuilding.asObservable();
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

  get triggeredAlarmsPage$(): Observable<any>{
    return this._triggeredAlarmsPage.asObservable();
  }

  get triggeredAlarmsList$(): Observable<any>{
    return this._triggeredAlarmsList.asObservable();
  }

  get triggeredAlarmDetailPage$(): Observable<any>{
    return this._triggeredAlarmDetailPage.asObservable();
  }
  
  get clientFeedbackReports$(): Observable<any>{
    return this._clientFeedbackReports.asObservable();
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

  getTenantStats(userId) {
    const url = `${CONFIG.apiURL}/Dashboard/tenants/${userId}`;
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
          this.alarmTriggeredId = alarmTriggeredId;
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

  getShopDashboardBilling(buildingId, shopId, history = 12) {
    const url = `${CONFIG.apiURL}/Dashboard/buildings/${buildingId}/shops/${shopId}/billing-details?history=${history}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._shopBillingDetail.next(bl);
        })
      );
  }

  getShopDashboardOccupations(buildingId, shopId) {
    const url = `${CONFIG.apiURL}/Dashboard/buildings/${buildingId}/shops/${shopId}/occupations`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._shopOccupationDetails.next(bl);
        })
      );
  }

  getShopDashboardAssignedMeters(buildingId, shopId) {
    const url = `${CONFIG.apiURL}/Dashboard/buildings/${buildingId}/shops/${shopId}/assigned-meters`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._shopAssignedMetersDetails.next(bl);
        })
      );
  }

  getMetersForBuilding(buildingId: number, shopId): Observable<IUmfaMeter[]> {
    const url = `${CONFIG.apiURL}/Dashboard/buildings/${buildingId}/shops/${shopId}/assigned-meters`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => err),
        tap(bps => {
          this._metersForBuilding.next(bps);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        }),
      );
  }
  
  getShopBillingsByMeter(meterId, shopId, buildingId) {
    const url = `${CONFIG.apiURL}/Dashboard/buildings/${buildingId}/shops/${shopId}/meters/${meterId}/readings`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._shopReadingsDetails.next(bl);
        })
      );
  }

  getTriggeredAlarmsList(userId, buildingId) {
    const url = `${CONFIG.apiURL}/AlarmTriggered?umfaUserId=${userId}&umfaBuildingId=${buildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(bl => {
          this._triggeredAlarmsList.next(bl);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }
  
  getClientFeedbackReports(buildingId) {
    const url = `${CONFIG.apiURL}/Reports/FeedbackReports?BuildingId=${buildingId}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(res => {
          this._clientFeedbackReports.next(res);
          //console.log(`Http response from getBuildingsForUser: ${m.length} buildings retrieved`)
        })
      );
  }

  submitClientFeedbackReport(buildingId, periodId) {
    const url = `${CONFIG.apiURL}/Reports/FeedbackReports`;
    return this.http.post<any>(url, {buildingId, periodId}, { withCredentials: true })
      .pipe(
        catchError(err => this.catchAuthErrors(err)),
        tap(res => {
          this._notificationService.message('Client feedback reported successfully!');
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
    this._shops.next(null);
  }

  destroyTenantsList() {
    this._tenants.next(null);
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

  showReports(data) {
    this._buildingReports.next(data);
  }

  showShopList(data) {
    this._shopList.next(data);
  }

  destroyTenantSlipDetail() {
    this._tenantSlipDetail.next(null);
  }

  showShopBilling(data) {
    this._shopBilling.next(data);
  }

  showShopOccupation(data) {
    this._shopOccupation.next(data);
  }

  showTriggeredAlarms(data) {
    this._triggeredAlarmsPage.next(data);
  }

  destroyShopOccupation() {
    this._shopOccupation.next(null);
    this._shopOccupationDetails.next(null);
  }

  showAssignedMeters(data) {
    this._shopAssignedMeters.next(data);
  }

  destroyShopAssignedMeters() {
    this._shopAssignedMeters.next(null);
    //this._shopAssignedMetersDetails.next(null);
  }

  destroyShopAssignedMeterDetails() {
    this._shopAssignedMetersDetails.next(null);
  }

  showReadings(data) {
    this._shopReadings.next(data);
  }

  destroyShopReadings() {
    this._shopReadings.next(null);
    this._shopReadingsDetails.next(null);
  }

  showTriggeredAlarmDetail(data) {
    this._triggeredAlarmDetailPage.next(data);
  }

  destroyTriggeredAlarm() {
    this._triggeredAlarmDetailPage.next(null);
    this._triggeredAlarmsPage.next(null);
  }

  destroyTriggeredAlarmList() {
    this._triggeredAlarmsList.next(null);
  }

  destroyClientFeedbackReports() {
    this._clientFeedbackReports.next(null);
  }

  destroy() {
    this._buildingReports.next(null);
    this._tenantSlip.next(null);
    this._tenantSlipDetail.next(null);
    this._tenantSlipDownloads.next(null);
    this._alarmTriggerDetail.next(null);
    this._triggeredAlarmDetailPage.next(null);
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

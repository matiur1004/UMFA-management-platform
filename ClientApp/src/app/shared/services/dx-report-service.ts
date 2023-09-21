import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, of, tap, throwError } from "rxjs";
import { IBuildingRecoveryParams, IConsumptionSummaryReconReportParams, IConsumptionSummaryReportParams, IDXReport, IShopCostVarianceParams, IShopUsageVarianceParams, IUmfaBuilding, IUmfaPartner, IUmfaPeriod, IUtilityReportParams } from "../../core/models";
import { BuildingService } from "./building.service";
import { CONFIG } from "@core/helpers";
import { HttpClient } from "@angular/common/http";
import { UmfaService } from "./umfa.service";

@Injectable({ providedIn: 'root' })
export class DXReportService {
    private _shopCostVariance: BehaviorSubject<any> = new BehaviorSubject(null);
    private _reportChanged: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _shopUsageVariance: BehaviorSubject<any> = new BehaviorSubject(null);
    private _buildingRecovery: BehaviorSubject<any> = new BehaviorSubject(null);
    private _utilityRecoveryExpense: BehaviorSubject<any> = new BehaviorSubject(null);
    private _consumptionSummary: BehaviorSubject<any> = new BehaviorSubject(null);
    private _consumptionSummaryRecon: BehaviorSubject<any> = new BehaviorSubject(null);
    private _isFormValid: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private buildingService: BuildingService,
        private http: HttpClient,
        private umfaService: UmfaService,
    ) {
        this.ErrorSubject = new BehaviorSubject<string>(null);
        this.Error$ = this.ErrorSubject.asObservable();
        this.bsBuildings = new BehaviorSubject<IUmfaBuilding[]>(null);
        this.obsBuildings = this.bsBuildings.asObservable();
        this.bsPartners = new BehaviorSubject<IUmfaPartner[]>(null);
        this.obsPartners = this.bsPartners.asObservable();
        this.bsPeriods = new BehaviorSubject<IUmfaPeriod[]>(null);
        this.obsPeriods = this.bsPeriods.asObservable();
        this.bsEndPeriods = new BehaviorSubject<IUmfaPeriod[]>(null);
        this.obsEndPeriods = this.bsEndPeriods.asObservable();
        this.bsLoadReport = new BehaviorSubject<IDXReport>(null);
        this.obsLoadReport = this.bsLoadReport.asObservable();
        this.bsShopLoadReport = new BehaviorSubject<IDXReport>(null);
        this.obsShopLoadReport = this.bsShopLoadReport.asObservable();
    }

    get shopUsageVariance$(): Observable<any> {
        return this._shopUsageVariance.asObservable();
    }

    get buildingRecovery$(): Observable<any> {
        return this._buildingRecovery.asObservable();
    }

    get shopCostVariance$(): Observable<any> {
        return this._shopCostVariance.asObservable();
    }

    get utilityRecoveryExpense$(): Observable<any> {
        return this._utilityRecoveryExpense.asObservable();
    }

    get consumptionSummary$(): Observable<any> {
        return this._consumptionSummary.asObservable();
    }

    get consumptionSummaryRecon$(): Observable<any> {
        return this._consumptionSummaryRecon.asObservable();
    }

    get reportChanged$(): Observable<boolean> {
        return this._reportChanged.asObservable();
    }

    get isFormValid$(): Observable<boolean> {
        return this._isFormValid.asObservable();
    }

    private ErrorSubject: BehaviorSubject<string>;
    public Error$: Observable<string>;

    //reports
    private dxReportList: IDXReport[] = [
        { Id: 6, Name: 'BRR Monthly Detailed', Description: 'BRR Monthly Detailed', DXReportName: 'ConsumptionSummaryRecon' },
        { Id: 1, Name: 'BRR Multiple Months', Description: 'BRR Multiple Months', DXReportName: 'BuildingRecovery' },
        { Id: 5, Name: 'Monthly Detailed Billing', Description: 'Monthly Detailed Billing', DXReportName: 'ConsumptionSummary' },        
        { Id: 3, Name: 'Shop Costs Variances', Description: 'Shop Costs Variances Report', DXReportName: 'ShopCostsVariances' },
        { Id: 2, Name: 'Shop Usage Variance', Description: 'Shop Usage Variance Report', DXReportName: 'ShopUsageVariance' },
        { Id: 4, Name: 'Utility Recovery and Expense', Description: 'Utility Recovery and Expense Report', DXReportName: 'UtilityRecoveryExpense' },

    ];

    recoveriesItems: any[] = [{id: 1, name: 'Client Recoveries'}, {id: 2, name: 'UMFA Recovery'}];
    expenseItems: any[] = [{id: 0, name: 'Client Expense'}, {id: 1, name: 'UMFA Bulk Reading'}, {id: 2, name: 'Council Account'}];
    visibleItems: any[] = [
        {name: 'Client Expense', key: 'ClientExpenseVisible'}, 
        {name: 'Client Recovery', key: 'ClientRecoverableVisible'}, 
        {name: 'Council Account', key: 'CouncilAccountVisible'}, 
        {name: 'UMFA Bulk Reading', key: 'BulkReadingVisible'}, 
        {name: 'UMFA Recovery', key: 'UmfaRecoveryVisible'}, 
        {name: 'Potential Recovery', key: 'PotentialRecVisible'}, 
        {name: 'Non Recoverable', key: 'NonRecVisible'}, 
        {name: 'UMFA Reading Dates', key: 'UmfaReadingDatesVisible'}, 
        {name: 'Council Reading Dates', key: 'CouncilReadingDatesVisible'}
      ];
    public dxReportList$ = of(this.dxReportList);

    private tenantOptions: any[] = [
        { Id: 1, Name: 'Show Latest' },
        { Id: 2, Name: 'Show All' },
        { Id: 3, Name: 'Show Each' },
    ];
    public tenantOptions$ = of(this.tenantOptions);

    private selectedReport: IDXReport;

    //Buildings
    public buildings: IUmfaBuilding[];
    private bsBuildings: BehaviorSubject<IUmfaBuilding[]>;
    public obsBuildings: Observable<IUmfaBuilding[]>;

    public loadBuildings(userId: number): void {
        this.buildingService.getBuildingsForUser(userId).subscribe({
            next: bldgs => {
                this.bsBuildings.next(bldgs);
                this.buildings = bldgs;
                // this.bsPartners.next(<IUmfaPartner[]>[]);
                // this.bsPeriods.next(<IUmfaPeriod[]>[]);
                // this.bsEndPeriods.next(<IUmfaPeriod[]>[]);
            },
            error: err => { this.catchErrors(err); },
            complete: () => { }
        });
    }

    //partners
    private partners: IUmfaPartner[];
    private bsPartners: BehaviorSubject<IUmfaPartner[]>;
    public obsPartners: Observable<IUmfaPartner[]>;

    public loadPartners(userId: number): void {
        this.buildingService.getPartnersForUser(userId).subscribe({
            next: ps => {
                this.bsPartners.next(ps);
                this.partners = ps;
            },
            error: err => { this.catchErrors(err); },
            complete: () => { }
        });
    }

    public selectPartner(partnerId: number) {
        if(this.buildings && this.buildings.length > 0) {
            const filteredBuildings = this.buildings.filter(bld => bld.PartnerId == partnerId);            
            this.bsBuildings.next(filteredBuildings);
        }        
    }

    //Periods
    private periods: IUmfaPeriod[];
    private bsPeriods: BehaviorSubject<IUmfaPeriod[]>;
    public obsPeriods: Observable<IUmfaPeriod[]>;
    private bsEndPeriods: BehaviorSubject<IUmfaPeriod[]>;
    public obsEndPeriods: Observable<IUmfaPeriod[]>;

    public loadPeriods(umfaBuildingId: number) {
        if (umfaBuildingId == 0 || umfaBuildingId == null) { this.periods = []; this.bsPeriods.next([]); }
        else {
            this.buildingService.getPeriodsForBuilding(umfaBuildingId).subscribe({
                next: bps => {
                    this.periods = bps;
                    this.bsPeriods.next(bps);
                },
                error: err => { this.catchErrors(err); },
                complete: () => { }
            });
        }

    }

    public selectStartPeriod(periodId: number) {
        if (periodId == 0 || periodId == null) {
            this.bsEndPeriods.next([]);
        } else {
            const endPeriods = this.periods.filter(p => p.PeriodId >= periodId);
            this.bsEndPeriods.next(endPeriods);
        }
    }

    //forms
    private frmSelectValid: boolean = false;
    private frmCriteriaValid: boolean = false;
    private showCrit = false;
    private showResults = false;
    private bsLoadReport: BehaviorSubject<IDXReport>;
    public obsLoadReport: Observable<IDXReport>;

    private bsShopLoadReport: BehaviorSubject<IDXReport>;
    public obsShopLoadReport: Observable<IDXReport>;

    public IsFrmsValid(): boolean {
        return this.frmCriteriaValid && this.frmSelectValid;
    }

    public ShowCrit(): boolean {
        return this.showCrit;
    }

    public setFrmValid(frm: number, valid: boolean) {
        switch (frm) {
            case 1: {
                this.frmSelectValid = valid;
                this.showCrit = valid;
                break;
            }
            case 2: {
                this.frmCriteriaValid = valid;
                break;
            }
            default: {
                break;
            }
        }
    }

    showFormValid(status) {
        this._isFormValid.next(status);
    }

    public ShowResults(value: boolean) {
        if (value) this.bsLoadReport.next(this.selectedReport);
        this.showResults = value;
    }

    public ShowShopResults(value: boolean) {
        if (value) this.bsShopLoadReport.next(this.selectedReport);
    }

    public ShowResultsPage(): boolean {
        if (this.frmSelectValid && this.frmCriteriaValid && this.BRParams && this.showResults) return true;
        else return false;
    }

    //Report Params
    private BRParams: IBuildingRecoveryParams;
    private SUVParams: IShopUsageVarianceParams;
    private SCVParams: IShopCostVarianceParams;
    private UREParams: IUtilityReportParams;
    private CSParams: IConsumptionSummaryReportParams;
    private CSRParams: IConsumptionSummaryReconReportParams;

    get BuildingRecoveryParams(): IBuildingRecoveryParams {
        return this.BRParams;
    }

    set BuildingRecoveryParams(value: IBuildingRecoveryParams) {
        this.BRParams = value;
        if (this.selectedReport && this.selectedReport.Id != 0) {
            switch (this.selectedReport.Id) {
                case 1: {
                    if (this.BRParams)
                        this.selectedReport.DXReportName = `BuildingRecovery?${this.BRParams.StartPeriodId},${this.BRParams.EndPeriodId}`;
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    get ShopUsageVarianceParams(): IShopUsageVarianceParams {
        return this.SUVParams;
    }

    set ShopUsageVarianceParams(value: IShopUsageVarianceParams) {
        this.SUVParams = value;
        if (this.selectedReport && this.selectedReport.Id != 0) {
            switch (this.selectedReport.Id) {
                case 2: {
                    if (this.SUVParams)
                        this.selectedReport.DXReportName = `ShopUsageVariance?${this.SUVParams.BuildingId},${this.SUVParams.FromPeriodId},${this.SUVParams.ToPeriodId},${this.SUVParams.AllTenants}`;
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    get ShopCostVarianceParams(): IShopCostVarianceParams {
        return this.SCVParams;
    }

    set ShopCostVarianceParams(value: IShopCostVarianceParams) {
        this.SCVParams = value;
        if (this.selectedReport && this.selectedReport.Id != 0) {
            switch (this.selectedReport.Id) {
                case 2: {
                    if (this.SCVParams)
                        this.selectedReport.DXReportName = `ShopUsageVariance?${this.SUVParams.BuildingId},${this.SUVParams.FromPeriodId},${this.SUVParams.ToPeriodId},${this.SUVParams.AllTenants}`;
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    get UtilityReportParams(): IUtilityReportParams {
        return this.UREParams;
    }

    set UtilityReportParams(value: IUtilityReportParams) {
        this.UREParams = value;
        if (this.selectedReport && this.selectedReport.Id != 0) {
            switch (this.selectedReport.Id) {
                case 3: {
                    if (this.UREParams)
                        this.selectedReport.DXReportName = `ShopUsageVariance?${this.SUVParams.BuildingId},${this.SUVParams.FromPeriodId},${this.SUVParams.ToPeriodId},${this.SUVParams.AllTenants}`;
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    get ConsumptionSummaryReportParams(): IConsumptionSummaryReportParams {
        return this.CSParams;
    }

    set ConsumptionSummaryReportParams(value: IConsumptionSummaryReportParams) {
        this.CSParams = value;
        if (this.selectedReport && this.selectedReport.Id != 0) {
            switch (this.selectedReport.Id) {
                case 3: {
                    if (this.CSParams)
                        this.selectedReport.DXReportName = `ShopUsageVariance?${this.SUVParams.BuildingId},${this.SUVParams.FromPeriodId},${this.SUVParams.ToPeriodId},${this.SUVParams.AllTenants}`;
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    get ConsumptionSummaryReconReportParams(): IConsumptionSummaryReconReportParams {
        return this.CSRParams;
    }

    set ConsumptionSummaryReconReportParams(value: IConsumptionSummaryReconReportParams) {
        this.CSRParams = value;
        if (this.selectedReport && this.selectedReport.Id != 0) {
        }
    }
    
    
    get SelectedReportId(): number {
        return this.selectedReport ? this.selectedReport.Id : null;
    }

    set SelectedReportId(id: number) {
        this.selectedReport = this.dxReportList.find(r => r.Id == id);
    }

    public sendError(msg: string) {
        this.ErrorSubject.next(msg);
    }

    resetAll(): void {
        this.ErrorSubject.next(null);
        //this.bsBuildings.next([]);
        //this.bsPartners.next(null);
        this.bsPeriods.next(null);
        this.bsEndPeriods.next(null);
        this.bsLoadReport.next(null);
        this.BRParams = null;
        this.showCrit = false;
        this.showCrit = false;
        this.umfaService.setShops(null);
    }

    ReportSelectionChanged() {
        this.showCrit = false;
        this.frmCriteriaValid = false;
        this.frmSelectValid = false;
        this.SelectedReportId = 0;
        this.showResults = false;
        this.BRParams = null;
        this._reportChanged.next(true);
    }

    getReportForBuildingRecovery() {
        let url = `${CONFIG.apiURL}/Reports/`;
        if(this.BuildingRecoveryParams.Utility == 'Electricity') url += 'BuildingRecoveryElectricity';
        if(this.BuildingRecoveryParams.Utility == 'Water') url += 'BuildingRecoveryWater';
        if(this.BuildingRecoveryParams.Utility == 'Sewerage') url += 'BuildingRecoverySewer';
        if(this.BuildingRecoveryParams.Utility == 'Disel') url += 'BuildingRecoveryDiesel';
        url += `?startPeriodId=${this.BuildingRecoveryParams.StartPeriodId}&endPeriodId=${this.BuildingRecoveryParams.EndPeriodId}`;
        
        return this.http.get<any>(url, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._buildingRecovery.next(m);
                }),
            );
    }

    getReportDataForShop() {
        const url = `${CONFIG.apiURL}/Reports/ShopUsageVarianceReport`;
        const queryParams = '?' +
            Object.keys(this.SUVParams)
                .map(key => {
                    return `${key}=${encodeURIComponent(this.SUVParams[key])}`;
                })
                .join('&');
        return this.http.get<any>(url + queryParams, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._shopUsageVariance.next(m);
                    //console.log(`getMetersForUser observable returned ${m}`);
                }),
            );
    }

    getReportDataForShopCosts() {
        const url = `${CONFIG.apiURL}/Reports/ShopCostVarianceReport`;
        const queryParams = '?' +
            Object.keys(this.SCVParams)
                .map(key => {
                    return `${key}=${encodeURIComponent(this.SCVParams[key])}`;
                })
                .join('&');
        return this.http.get<any>(url + queryParams, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._shopCostVariance.next(m);
                }),
            );
    }

    getReportDataForUtility() {
        const url = `${CONFIG.apiURL}/Reports/UtilityRecoveryReport`;
        const queryParams =
            '?' +
            Object.keys(this.UREParams)
                .map(key => {
                    return `${key}=${encodeURIComponent(this.UREParams[key])}`;
                })
                .join('&');
        return this.http.get<any>(url + queryParams, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._utilityRecoveryExpense.next(m);
                }),
            );
    }

    getReportDataForConsumptionSummary() {
        const url = `${CONFIG.apiURL}/Reports/ConsumptionSummaryReport`;
        return this.http.put<any>(url, this.CSParams, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._consumptionSummary.next(m);
                }),
            );
    }

    getReportDataForConsumptionSummaryRecon() {
        const url = `${CONFIG.apiURL}/Reports/ConsumptionSummaryReconReport?periodId=${this.CSRParams.PeriodId}`;
        return this.http.get<any>(url, { withCredentials: true })
            .pipe(
                catchError(err => this.catchErrors(err)),
                tap(m => {
                    this._consumptionSummaryRecon.next(m);
                }),
            );
    }

    setBuildingRecovery(data) {
        this._buildingRecovery.next(data);
    }

    setShopUsageVariance(data) {
        this._shopUsageVariance.next(data);
    }

    setShopCostVariance(data) {
        this._shopCostVariance.next(data);
    }

    setUtility(data) {
        this._utilityRecoveryExpense.next(data);
    }

    setConsumptionSummary(data) {
        this._consumptionSummary.next(data);
    }

    setConsumptionSummaryRecon(data) {
        this._consumptionSummaryRecon.next(data);
    }
    
    destroyReportViewer() {
        this.SelectedReportId = 0;
        this._isFormValid.next(false);
        this._consumptionSummary.next(null);
        this._consumptionSummaryRecon.next(null);
        this._utilityRecoveryExpense.next(null);
        this._shopUsageVariance.next(null);
        this._shopCostVariance.next(null);
        this._buildingRecovery.next(null);
    }

    destroyBuildingsAndPartners() {
        this.bsPartners.next([]);
        this.bsBuildings.next([]);
        this.buildings = null;
    }

    catchErrors(error: { error: { message: any; }; message: any; }): Observable<Response> {
        if (error && error.error && error.error.message) { //clientside error
            console.log(`Client side error: ${error.error.message}`);
            this.ErrorSubject.next(error.error.message);
        } else if (error && error.message) { //server side error
            console.log(`Server side error: ${error.message}`);
            this.ErrorSubject.next(error.message);
        } else {
            console.log(`Error occurred: ${JSON.stringify(error)}`);
            this.ErrorSubject.next(JSON.stringify(error));
        }
        return throwError(error);
    }

}

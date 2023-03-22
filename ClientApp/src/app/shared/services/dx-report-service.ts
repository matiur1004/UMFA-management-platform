import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { IBuildingRecoveryParams, IDXReport, IUmfaBuilding, IUmfaPartner, IUmfaPeriod } from "../../core/models";
import { BuildingService } from "./building.service";

@Injectable({ providedIn: 'root' })
export class DXReportService {

  constructor(private buildingService: BuildingService) {
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
  }

  private ErrorSubject: BehaviorSubject<string>;
  public Error$: Observable<string>;

  //reports
  private dxReportList: IDXReport[] = [{ Id: 1, Name: 'Building Recovery', Description: 'Building Recovery Report', DXReportName: 'BuildingRecovery' }];
  public dxReportList$ = of(this.dxReportList);
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
    const filteredBuildings = this.buildings.filter(bld => bld.PartnerId == partnerId);
    this.bsBuildings.next(filteredBuildings);
  }

  //Periods
  private periods: IUmfaPeriod[];
  private bsPeriods: BehaviorSubject<IUmfaPeriod[]>;
  public obsPeriods: Observable<IUmfaPeriod[]>;
  private bsEndPeriods: BehaviorSubject<IUmfaPeriod[]>;
  public obsEndPeriods: Observable<IUmfaPeriod[]>;

  public loadPeriods(umfaBuildingId: number) {
    this.buildingService.getPeriodsForBuilding(umfaBuildingId).subscribe({
      next: bps => {
        this.periods = bps;
        this.bsPeriods.next(bps);
      },
      error: err => { this.catchErrors(err); },
      complete: () => { }
    });
  }

  public selectStartPeriod(periodId: number) {
    if (periodId == 0) {
      this.bsEndPeriods.next(<IUmfaPeriod[]>{});
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

  public ShowResults(value: boolean) {
    if (value) this.bsLoadReport.next(this.selectedReport);
    this.showResults = value;
  }

  public ShowResultsPage(): boolean {
    if (this.frmSelectValid && this.frmCriteriaValid && this.BRParams && this.showResults) return true;
    else return false;
  }

  //Report Params
  private BRParams: IBuildingRecoveryParams;
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

  get SelectedReportId(): number {
    return this.selectedReport.Id;
  }

  set SelectedReportId(id: number) {
    this.selectedReport = this.dxReportList.find(r => r.Id == id);
  }

  public sendError(msg: string) {
    this.ErrorSubject.next(msg);
  }

  resetAll(): void {
    this.ErrorSubject.next(null);
    this.bsBuildings.next([]);
    this.bsPartners.next(null);
    this.bsPeriods.next(null);
    this.bsEndPeriods.next(null);
    this.bsLoadReport.next(null);
    this.BRParams = null;
    this.showCrit = false;
    this.showCrit = false;
  }

  ReportSelectionChanged() {
    this.showCrit = false;
    this.frmCriteriaValid = false;
    this.frmSelectValid = false;
    this.SelectedReportId = 0;
    this.showResults = false;
    this.BRParams = null;
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
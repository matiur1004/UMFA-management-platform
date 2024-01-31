import { Time } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { formatDateString, formatTimeString } from "@core/utils/umfa.help";
import { CONFIG } from "app/core/helpers";
import { BehaviorSubject, catchError, map, Observable, of, throwError } from "rxjs";
import { IAmrChart, IAmrChartDemProfParams, IAmrChartWaterProfParams, IDemandProfileResponse, ITouHeader, IWaterProfileResponse } from "../../core/models";

@Injectable({ providedIn: 'root' })
export class AmrDataService {

  //Common properties
  private amrChartList: IAmrChart[] = [
    { Id: 1, Name: 'Demand Profile', Description: 'Show the demand profile with energy included' },
    { Id: 2, Name: 'Water Profile', Description: 'Show the flow profile for water meters' }
  ];

  public amrChartList$ = of(this.amrChartList);
  private selectedChart: IAmrChart;

  get SelectedChart(): IAmrChart { return this.selectedChart; }

  set SelectedChart(value: IAmrChart) {
    this.selectedChart = value;
    this.bsSelectedChart.next(value);
  }

  private frmSelectValid: boolean = false;
  private frmCriteriaValid: boolean = false;

  public IsFrmsValid(): boolean { return this.frmCriteriaValid && this.frmSelectValid; }

  public setFrmValid(frm: number, valid: boolean) {
    switch (frm) {
      case 1: {
        this.frmSelectValid = valid;
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

  public setError(msg: string) {
    this.bsFrmErrorSubject.next(msg);
  }

  public displayChart(show: boolean): void {
    this.bsProfChart.next(show);
  }

  private bsDemandDataSource: BehaviorSubject<IDemandProfileResponse>;
  public obsDemandDataSource: Observable<IDemandProfileResponse>;
  private bsWaterDataSource: BehaviorSubject<IWaterProfileResponse>;
  public obsWaterDataSource: Observable<IWaterProfileResponse>;

  private bsSelectedChart: BehaviorSubject<IAmrChart>;
  public obsSelectedChart: Observable<IAmrChart>;
  private bsProfChart: BehaviorSubject<boolean>;
  public obsProfChart$: Observable<boolean>;

  private bsFrmErrorSubject: BehaviorSubject<string>;
  public obsFrmError$: Observable<string>;

  //Demand profile properties
  private demChartParams: IAmrChartDemProfParams;
  get DemChartParams(): IAmrChartDemProfParams { return this.demChartParams; }
  set DemChartParams(value: IAmrChartDemProfParams) { this.demChartParams = value; }

  private bsDemSubject: BehaviorSubject<IDemandProfileResponse>;
  public obsDemProfile$: Observable<IDemandProfileResponse>;

  private bsTouHeaderSub: BehaviorSubject<ITouHeader[]>;
  public obsTouHeaders$: Observable<ITouHeader[]>;

  //Water profile properties
  private waterChartParams: IAmrChartWaterProfParams;
  get WaterChartParams(): IAmrChartWaterProfParams { return this.waterChartParams; }
  set WaterChartParams(value: IAmrChartWaterProfParams) { this.waterChartParams = value; }

  private bsWaterProfile: BehaviorSubject<IWaterProfileResponse>;
  public obsWaterProfile$: Observable<IWaterProfileResponse>;

  private bsMeterGraphProfile: BehaviorSubject<any>;
  public obsMeterGraphProfile$: Observable<any>;

  constructor(private router: Router, private http: HttpClient) {
    this.bsSelectedChart = new BehaviorSubject<IAmrChart>(null);
    this.obsSelectedChart = this.bsSelectedChart.asObservable();
    this.bsDemSubject = new BehaviorSubject<IDemandProfileResponse>(null);
    this.obsDemProfile$ = this.bsDemSubject.asObservable();
    this.bsTouHeaderSub = new BehaviorSubject<ITouHeader[]>(null);
    this.obsTouHeaders$ = this.bsTouHeaderSub.asObservable();
    this.bsFrmErrorSubject = new BehaviorSubject<string>(null);
    this.obsFrmError$ = this.bsFrmErrorSubject.asObservable();
    this.bsProfChart = new BehaviorSubject<boolean>(false);
    this.obsProfChart$ = this.bsProfChart.asObservable();
    this.bsWaterProfile = new BehaviorSubject<IWaterProfileResponse>(null);
    this.obsWaterProfile$ = this.bsWaterProfile.asObservable();

    this.bsMeterGraphProfile = new BehaviorSubject<any>(null);
    this.obsMeterGraphProfile$ = this.bsMeterGraphProfile.asObservable();

    this.bsDemandDataSource = new BehaviorSubject<IDemandProfileResponse>(null);
    this.obsDemandDataSource = this.bsDemandDataSource.asObservable();
    this.bsWaterDataSource = new BehaviorSubject<IWaterProfileResponse>(null);
    this.obsWaterDataSource = this.bsWaterDataSource.asObservable();
  }

  //common methods
  destroyAll() {
    this.selectedChart = null;
    this.frmSelectValid = false;
    this.frmCriteriaValid = false;
    this.demChartParams = null;
    this.bsSelectedChart.next(null);
    this.bsProfChart.next(null);
    this.bsDemSubject.next(null);
    this.bsTouHeaderSub.next(null);
  }

  catchErrors(error: { error: { message: any; }; message: any; }): Observable<Response> {
    if (error && error.error && error.error.message) { //clientside error
      console.log(`Client side error: ${error.error.message}`);
    } else if (error && error.message) { //server side error
      console.log(`Server side error: ${error.message}`);
    } else {
      console.log(`Error occurred: ${JSON.stringify(error)}`);
    }
    return throwError(error);
  }

  //Demand profile methods
  public get DemandProfileValue(): IDemandProfileResponse { return this.bsDemSubject.value; }

  public get TouHeaders(): ITouHeader[] { return this.bsTouHeaderSub.value; }

  sendDemandDataSource(ds: IDemandProfileResponse) {
    return this.bsDemandDataSource.next(ds);
  }

  getDemandDataSource() {
    return this.obsDemandDataSource;
  }

  sendWaterDataSource(ds: IWaterProfileResponse) {
    return this.bsWaterDataSource.next(ds);
  }

  getWaterDataSource() {
    return this.obsWaterDataSource;
  }

  getDemandProfile(meterId: number, sDate: Date, eDate: Date, touHeaderId: number) {
    this.bsDemSubject.next(null);
    const url = `${CONFIG.apiURL}${CONFIG.getDemandProfile}?MeterID=${meterId}&StartDate=${formatDateString(sDate)}&EndDate=${formatDateString(eDate)}&TouHeaderId=${touHeaderId}`;
    this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        //tap(p =>
        //  console.log(`Http response from getDemandProfile: ${p.Status}`)
        //),
        map((prof: IDemandProfileResponse) => {
          this.bsDemSubject.next(prof);
          return prof;
        })
      ).subscribe();
  }

  getTouHeaders(): Observable<ITouHeader[]> {
    const touUrl = `${CONFIG.apiURL}${CONFIG.getTouHeaders}`;
    if (!this.TouHeaders) {
      return this.http.get<any>(touUrl, { withCredentials: true })
        .pipe(
          catchError(err => this.catchErrors(err)),
          //tap(p =>
          //  console.log(`Http response from getNewDemandTOUProfile headers: ${JSON.stringify(p)}`)
          //),
          map((th: ITouHeader[]) => {
            this.bsTouHeaderSub.next(th);
            return th;
          })
        );
    } else return this.obsTouHeaders$;
  }

  //Water profile methods
  public get WaterProfileValue(): IWaterProfileResponse { return this.bsWaterProfile.value; }

  getWaterProfile(meterId: number, sDate: Date, eDate: Date, nfsTime: Time, nfeTime: Time) {
    this.bsWaterProfile.next(null);
    let url = `${CONFIG.apiURL}${CONFIG.getWaterProfile}?MeterID=${meterId}&StartDate=${formatDateString(sDate)}&EndDate=${formatDateString(eDate)}`;
    url += `&NightFlowStart=${formatTimeString(nfsTime)}&NightFlowEnd=${formatTimeString(nfeTime)}`;
    this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        //tap(p =>
        //  console.log(`Http response from getDemandProfile: ${p.Status}`)
        //),
        map((prof: IWaterProfileResponse) => {
          this.bsWaterProfile.next(prof);
          return prof;
        })
      ).subscribe();
  }

  getMeterProfileForGraph(meterId: number, sDate: Date, eDate: Date, nfsTime: Time, nfeTime: Time, applyNightFlow: boolean) {
    this.bsMeterGraphProfile.next(null);
    let url = `${CONFIG.apiURL}/AMRMeterGraphs/getGraphProfile?MeterID=${meterId}&StartDate=${formatDateString(sDate)}&EndDate=${formatDateString(eDate)}`;
    url += `&NightFlowStart=${formatTimeString(nfsTime)}&NightFlowEnd=${formatTimeString(nfeTime)}&applyNightFlow=${applyNightFlow}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        //tap(p =>
        //  console.log(`Http response from getDemandProfile: ${p.Status}`)
        //),
        map((prof: any) => {
          this.bsMeterGraphProfile.next(prof);
          return prof;
        })
      );
  }

  getMeterProfileForGraphOfElectricity(meterId: number, sDate: Date, eDate: Date, nfsTime: Time, nfeTime: Time, applyNightFlow: boolean) {
    this.bsMeterGraphProfile.next(null);
    let url = `${CONFIG.apiURL}/AMRData/demand-alarms-profiles?MeterId=${meterId}&SDate=${formatDateString(sDate)}&EDate=${formatDateString(eDate)}`;
    url += `&NightFlowStart=${formatTimeString(nfsTime)}&NightFlowEnd=${formatTimeString(nfeTime)}&applyNightFlow=${applyNightFlow}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors(err)),
        //tap(p =>
        //  console.log(`Http response from getDemandProfile: ${p.Status}`)
        //),
        map((prof: any) => {
          this.bsMeterGraphProfile.next(prof);
          return prof;
        })
      );
  }
}

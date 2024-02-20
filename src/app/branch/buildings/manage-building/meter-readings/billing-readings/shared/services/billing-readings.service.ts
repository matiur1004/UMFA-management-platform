import {Injectable} from '@angular/core';
import {
  BillingReadingsFilterDetailViewModel,
  BillingReadingsFilterModel,
  MeterReadingChartViewModel,
  ReadingsValidationViewModel
} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {MeterReadingDetails} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/reducers/billing-readings.store';
import {NewFileViewModel, PagingViewModel} from '@models';
import {HttpHelperService} from '@services';

@Injectable()
export class BuildingBillingReadingsService {

  private readonly FILTER_OPTIONS: string = '/api/v1/readings/{0}/filters/{1}';
  private readonly CHART_URL: string = '/api/v1/chart/{0}/meters';
  private readonly CHART_STATS_URL: string = '/api/v1/chart/{0}/meters/{1}';
  private readonly FILTERS_URL: string = '/api/v1/readings/{0}/filters';
  private readonly BILLING_METER_READINGS: string = '/api/v1/readings/{0}/byperiod/{1}';
  private readonly ADD_READINGS_BULK_READINGS: string = '/api/v1/readings/{0}/bulk';
  private readonly RESET_READING: string = '/api/v1/readings/{0}/reset/{1}';
  private readonly ESTIMATE: string = '/api/v1/readings/{0}/estimate/{1}';
  private readonly POST_ESTIMATE: string = '/api/v1/readings/{0}/estimate/';
  private readonly CONFIRM_URL: string = '/api/v1/readings/{0}/{1}/confirm';
  private readonly EXPORT_READINGS_TO_CSV: string = '/api/v1/readings/{0}/byperiod/{1}/export';
  private readonly IMPORT_FROM_FILE_URL: string = '/api/v1/readings/{0}/import';
  private readonly METER_READING_FOR_DATE: string = '/api/v1/readings/{0}/{1}/{2}/{3}/{4}/{5}';

  constructor(private http: HttpHelperService) {
  }

  getFilter(buildingId: string, periodId: string) {
    return this.http.authJsonGet<any>(this.FILTER_OPTIONS.replace('{0}', buildingId).replace('{1}', periodId));
  }

  public getMeterReadings(buildingId: string, buildingPeriodId: string, filter: any) {

    return this.http.authJsonPost<PagingViewModel<MeterReadingDetails>>(this.BILLING_METER_READINGS.replace('{0}', buildingId).replace('{1}', buildingPeriodId), filter);
  }

  public getMeterReadingsCharts(buildingId: string, filterModel) {
    return this.http.authJsonPost<PagingViewModel<MeterReadingChartViewModel>>(this.CHART_URL.replace('{0}', buildingId), filterModel);
  }

  public getMeterReadingsStatsCharts(buildingId: string, meterId: string, filterModel) {
    return this.http.authJsonPost<MeterReadingChartViewModel>(this.CHART_STATS_URL.replace('{0}', buildingId).replace('{1}', meterId), filterModel);
  }

  public getFilters(buildingId: string) {
    return this.http.authJsonGet<BillingReadingsFilterModel[]>(this.FILTERS_URL.replace('{0}', buildingId));
  }

  public addFilter(buildingId: string, activeFilter: BillingReadingsFilterDetailViewModel, filterName: string) {
    const filterModel = new BillingReadingsFilterModel(activeFilter, buildingId, filterName);
    filterModel.id = null;
    return this.http.authJsonPost<BillingReadingsFilterModel>(this.FILTERS_URL.replace('{0}', buildingId), filterModel);
  }

  public updateFilter(buildingId: string, model: BillingReadingsFilterDetailViewModel, filterName: string) {
    const filterModel = new BillingReadingsFilterModel(model, buildingId, filterName);
    filterModel.active = true;

    return this.http.authJsonPost<BillingReadingsFilterModel>(this.FILTERS_URL.replace('{0}', buildingId), filterModel);
  }

  public deleteFilter(model: BillingReadingsFilterModel) {
    return this.http.authJsonDelete<BillingReadingsFilterModel[]>(this.FILTER_OPTIONS.replace('{0}', model.buildingId).replace('{1}', model.id));
  }

  public getEnterMeterReadings(buildingId: string, buildingPeriodId: string, meterId: string, showFilter: number = null, showFilterAsOfDate: string = null, searchKey: string = '', searchLocation: string = '') {

    const filter = {
      buildingId: buildingId,
      buildingPeriodId: buildingPeriodId,
      meterId: meterId,
      searchText: searchKey,
      locationId: searchLocation,
      readingSources: [],
      supplyTypes: [],
      includeEmptyMeters: true,
      readingCategory: showFilter,
      meterReadingsFilterAsOfDate: showFilterAsOfDate
    };
    return this.http.authJsonPost<PagingViewModel<MeterReadingDetails>>(this.BILLING_METER_READINGS.replace('{0}', buildingId).replace('{1}', buildingPeriodId), filter);
  }

  public addBulkReading(buildingId: string, model: any) {
    return this.http.authMultipartFormDataPost<any>(this.ADD_READINGS_BULK_READINGS.replace('{0}', buildingId), model);
  }

  public resetReading(buildingId: string, buildingPeriodId: string, model: any) {
    return this.http.authJsonPost<any[]>(this.RESET_READING.replace('{0}', buildingId).replace('{1}', buildingPeriodId), model);
  }

  public getEstimationOptions(buildingId: string, buildingPeriodId: string, filter: any) {
    return this.http.authJsonGet<any[]>(this.ESTIMATE.replace('{0}', buildingId).replace('{1}', buildingPeriodId), filter);
  }

  public applyEstimate(buildingId: string, model: any) {
    return this.http.authJsonPost<any[]>(this.POST_ESTIMATE.replace('{0}', buildingId), model);
  }

  public confirmReading(buildingId: string, readingId: string, model: any) {
    return this.http.authJsonPatch(this.CONFIRM_URL.replace('{0}', buildingId).replace('{1}', readingId), model);
  }

  public exportToCsvFile(buildingId: string, buildingPeriodId: string, model: any, fileName: string): void {
    this.http.authDownloadFile(this.EXPORT_READINGS_TO_CSV.replace('{0}', buildingId).replace('{1}', buildingPeriodId), model, fileName);
  }

  public importFromFile(buildingId: string, model: NewFileViewModel) {
    return this.http.authUploadFileAsync(this.IMPORT_FROM_FILE_URL.replace('{0}', buildingId), model);
  }

  public getMeterReadingsForDate(buildingId: string, versionId: string, year: number, month: number, day: number, readingSource: number) {
    return this.http.authJsonGet<ReadingsValidationViewModel[]>(this.METER_READING_FOR_DATE
      .replace('{0}', buildingId)
      .replace('{1}', versionId)
      .replace('{2}', year.toString())
      .replace('{3}', month.toString())
      .replace('{4}', day.toString())
      .replace('{5}', readingSource.toString()))
  }
}

import {
  InvalidateReadingViewModel,
  ReadingDetailsUpdateViewModel,
  ReadingFileInfoViewModel
} from './../models/readings-history.model';
import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {setURL} from '@shared-helpers';
import {MeterViewModel, ReadingPinStatusViewModel, ReadingsHistoryViewModel} from '../models/readings-history.model';
import {HttpParams} from '@angular/common/http';

@Injectable()
export class ReadingsHistoryService {
  private readonly GET_READINGS_HISTORY = '/api/v1/readings/{0}/meter-history';
  private readonly GET_PINNED_READINGS = '/api/v1/readings/{0}/meter-pinned-readings';
  private readonly GET_METERS = '/api/v1/readings/{0}/meter-history/meters';
  private readonly TOGGLE_PIN = '/api/v1/readings/{0}/{1}/toggle-pin';
  private readonly SET_BILLING = '/api/v1/readings/{0}/{1}/set-billing';
  private readonly GET_READING_HISTORY_DETAILS = '/api/v1/readings/{0}/details';
  private readonly INVALIDATE = '/api/v1/readings/{0}/invalidate';
  private readonly UPDATE_READING_DETAILS_URL: string = '/api/v1/readings/{0}/{1}/details';
  private readonly DOWNLOAD_READING_FILE: string = '/api/v1/readings/{0}/{1}/download/{2}';


  constructor(private http: HttpHelperService) {
  }

  public getReadingsHistory(buildingId: string, filter: any) {
    if (!filter['requestParameters.registerId']) {
      delete filter['requestParameters.registerId'];
    }

    if (filter['requestParameters.timeOfUse'] === null) {
      delete filter['requestParameters.timeOfUse'];
    }
    const params = new HttpParams({fromObject: filter});
    var readingsHistory = this.http.authJsonGet<{ items: ReadingsHistoryViewModel[], total: number }>(setURL(this.GET_READINGS_HISTORY, buildingId), params);

    return readingsHistory;
  }

  public getPinnedReadingsHistory(buildingId: string, filter: { meterId: string, registerId: string }) {
    const params = new HttpParams({fromObject: filter});
    var pinnedReadingsHistory = this.http.authJsonGet<ReadingsHistoryViewModel[]>(setURL(this.GET_PINNED_READINGS, buildingId), params);
    return pinnedReadingsHistory
  }

  public getMeters(buildingId: string) {
    return this.http.authJsonGet<MeterViewModel[]>(setURL(this.GET_METERS, buildingId));
  }

  public togglePinReading(buildingId: string, model: ReadingPinStatusViewModel) {
    return this.http.authJsonPut(setURL(this.TOGGLE_PIN, buildingId, model.readingId), model, null, false);
  }

  public setBillingReading({readingId, buildingId}) {
    return this.http.authJsonPut(setURL(this.SET_BILLING, buildingId, readingId), null);
  }

  public getReadingHistoryDetails(readingId: string, parameters: any) {
    var readingsHistoryDetails = this.http.authJsonGet(setURL(this.GET_READING_HISTORY_DETAILS, readingId), parameters);
    return readingsHistoryDetails;
  }

  public invalidateReading(readingId: string, model: InvalidateReadingViewModel) {
    return this.http.authJsonPut(setURL(this.INVALIDATE, readingId), model, null, true);
  }

  public updateReadingDetails(buildingId: string, readingId: string, model: ReadingDetailsUpdateViewModel) {
    return this.http.authMultipartFormDataPut<ReadingDetailsUpdateViewModel>(
      this.UPDATE_READING_DETAILS_URL.replace('{0}', buildingId).replace('{1}', readingId),
      model
    );
  }

  public downloadFile(buildingId: string, fileInfo: ReadingFileInfoViewModel) {
    return this.http.authDownloadFile(
      this.DOWNLOAD_READING_FILE.replace('{0}', buildingId).replace('{1}', fileInfo.readingId).replace('{2}', fileInfo.id),
      {},
      fileInfo.fileDisplayName);
  }
}

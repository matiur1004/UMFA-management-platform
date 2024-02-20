import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {HttpParams} from '@angular/common/http';
import {DocumentStatusViewModel} from '@models';

@Injectable()
export class BuildingVersionHistoryService {

  private readonly HISTORY_URL: string = '/api/v1/histories/building/{0}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getVersionHistory(buildingId: string, searchKey: string = null, order: number = 0) {

    let params: HttpParams = new HttpParams();
    if (searchKey) params = params.append('searchKey', searchKey);
    if (order) params = params.append('order', order.toString());
    return this.httpHelperService.authJsonGet<DocumentStatusViewModel>(this.HISTORY_URL.replace('{0}', buildingId), params);
  }
}

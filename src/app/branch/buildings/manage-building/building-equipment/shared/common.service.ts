import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {HttpParams} from '@angular/common/http';
import {DocumentStatusViewModel} from '@models';
import {BuildingPeriodViewModel} from '../../shared/models/building-period.model';

@Injectable()
export class CommonService {

  private readonly HISTORY_URL: string = '/api/v1/histories/building/{0}';
  private readonly ACTIVE_BUILDING_PERIOD_URL: string = '/api/v1/buildings/{0}/active-period';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getActiveBuildingPeriod(buildingId: string) {
    return this.httpHelperService.authJsonGet<BuildingPeriodViewModel>(this.ACTIVE_BUILDING_PERIOD_URL.replace('{0}', buildingId));
  }


  public getLogs(buildingId: string, searchKey: string = null, order: number = 0) {

    let params: HttpParams = new HttpParams();
    if (searchKey) params = params.append('searchKey', searchKey);
    if (order) params = params.append('order', order.toString());
    return this.httpHelperService.authJsonGet<DocumentStatusViewModel>(this.HISTORY_URL.replace('{0}', buildingId), params);
  }
}

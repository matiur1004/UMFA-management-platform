import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

import {PagingViewModel} from '@models';
import {HttpHelperService} from '@services';

import {BuildingPeriodViewModel} from '../models/building-period.model';
import {BuildingPeriodValidationModel} from '../models/building-period-validation.model';
import {FinalizeBuildingPeriodResult} from '../enums/finalize-bulding-period-result';
import {Observable} from 'rxjs';

@Injectable()
export class BuildingPeriodsService {

  private readonly BUILDING_PERIODS: string = '/api/v1/buildings/{0}/building-periods';
  private readonly BUILDING_PERIODS_LIST: string = '/api/v1/buildings/{0}/building-periods/list';
  private readonly BUILDING_PERIOD: string = '/api/v1/buildings/{0}/building-periods/{1}';
  private readonly BUILDING_PERIOD_FINALIZE: string = '/api/v1/buildings/{0}/building-periods/{1}/finalize';
  private readonly BUILDING_PERIOD_VALIDATE: string = '/api/v1/buildings/{0}/building-periods/{1}/validate';
  private readonly ACTIVE_BUILDING_PERIOD_URL: string = '/api/v1/buildings/{0}/active-period';

  constructor(private http: HttpHelperService) {
  }

  get(buildingId: string, filter: string, offset: number = 0, limit: number | null = null) {
    let params = new HttpParams();

    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (filter) params = params.append('filter', filter);

    return this.http.authJsonGet<PagingViewModel<BuildingPeriodViewModel[]>>(this.BUILDING_PERIODS.replace('{0}', buildingId), params);
  }

  getAllShort(buildingId: string, name: string | null = null) {
    let params = new HttpParams();

    if (name) params = params.append('name', name);

    return this.http.authJsonGet<BuildingPeriodViewModel[]>(this.BUILDING_PERIODS_LIST.replace('{0}', buildingId), params);
  }

  save(buildingId: string, buildingPeriodId: string, model: BuildingPeriodViewModel) {
    return this.http.authJsonPost(this.BUILDING_PERIOD.replace('{0}', buildingId).replace('{1}', buildingPeriodId), model);
  }

  rollback(buildingId: string, buildingPeriodId: string) {
    return this.http.authJsonDelete(this.BUILDING_PERIOD.replace('{0}', buildingId).replace('{1}', buildingPeriodId));
  }

  public finalize(buildingId: string, buildingPeriodId: string, model: BuildingPeriodViewModel): Observable<FinalizeBuildingPeriodResult> {
    return this.http.authJsonPost(this.BUILDING_PERIOD_FINALIZE.replace('{0}', buildingId).replace('{1}', buildingPeriodId), model);
  }

  validate(buildingId: string, buildingPeriodId: string) {
    return this.http.authJsonGet<BuildingPeriodValidationModel>(this.BUILDING_PERIOD_VALIDATE.replace('{0}', buildingId).replace('{1}', buildingPeriodId));
  }

  public getActiveBuildingPeriod(buildingId: string) {
    return this.http.authJsonGet<BuildingPeriodViewModel>(this.ACTIVE_BUILDING_PERIOD_URL.replace('{0}', buildingId));
  }

}

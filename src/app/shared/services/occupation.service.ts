import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {HttpHelperService} from './http-helper.service';
import {
  Dictionary,
  LogViewModel,
  NewFileViewModel,
  OccupationViewModel,
  ShopViewModel,
  TenantShopHistoryViewModel,
  UpdateCommonAreaViewModel,
  VersionResultViewModel,
  VersionViewModel
} from '@models';

import {setURL} from '@shared-helpers';

@Injectable()
export class OccupationService {


  private readonly OCCUPATION_URL: string = '/api/v1/buildings/{0}/occupation';
  private readonly OCCUPATION_WITH_VERSION_URL: string = '/api/v1/buildings/{0}/occupation/{1}';

  private readonly HISTORY_URL: string = '/api/v1/histories/occupation/{0}';
  private readonly HISTORY_SHOP_URL: string = '/api/v1/histories/occupation/{0}/shops/{1}';
  private readonly FULL_HISTORY_URL: string = '/api/v1/histories/building/{0}/logs';
  private readonly REVERT_TO_URL: string = '/api/v1/histories/building/{0}/logs/{1}/revert-to';

  private readonly UPLOAD_FILE_URL: string = '/api/v1/buildings/{0}/occupation/parse-file';

  private readonly BUILDING_FLOORS_URL: string = '/api/v1/buildings/{0}/floors';
  private readonly BUILDING_SHOPS_URL: string = '/api/v1/buildings/{0}/shops';
  private readonly BUILDING_FLOOR_PLAN_URL: string = '/api/v1/buildings/{0}/floor/{1}/plan';

  private readonly COMMON_AREAS_URL: string = '/api/v1/buildings/{0}/common-areas';
  private readonly COMMON_AREA_RELATIONS_URL: string = '/api/v1/buildings/{0}/common-areas/{1}/relations';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getCommonAreaRelations(buildingId: string, commonAreaId: string, versionId: string = null) {
    let params = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    return this.httpHelperService.authJsonGet<Dictionary<string[]>>(
      setURL(this.COMMON_AREA_RELATIONS_URL, buildingId, commonAreaId), params);
  }

  public get(buildingId: string, versionId: string = null) {
    return this.httpHelperService.authJsonGet<VersionResultViewModel>(this.OCCUPATION_WITH_VERSION_URL.replace('{0}', buildingId)
      .replace('{1}', versionId || ''));
  }

  public uploadFile(buildingId: string, model: NewFileViewModel) {
    return this.httpHelperService.authUploadFileAsync(this.UPLOAD_FILE_URL.replace('{0}', buildingId), model);
  }

  public update(buildingId: string, model: VersionViewModel<OccupationViewModel>) {
    return this.httpHelperService.authJsonPost(this.OCCUPATION_URL.replace('{0}', buildingId), model);
  }

  public updateShops(buildingId: string, model: VersionViewModel<ShopViewModel[]>) {
    return this.httpHelperService.authJsonPut(this.BUILDING_SHOPS_URL.replace('{0}', buildingId), model);
  }

  public getLog(buildingId: string, searchKey: string = null, order: number = 0) {

    let params: HttpParams = new HttpParams();
    if (searchKey) params = params.append('searchKey', searchKey);
    if (order) params = params.append('order', order.toString());
    return this.httpHelperService.authJsonGet<LogViewModel[]>(this.HISTORY_URL.replace('{0}', buildingId), params);
  }

  public getFullHistory(buildingId: string, searchKey: string = null, order: number = 0) {

    let params: HttpParams = new HttpParams();
    if (searchKey) params = params.append('searchKey', searchKey);
    if (order) params = params.append('order', order.toString());

    return this.httpHelperService.authJsonGet<any[]>(this.FULL_HISTORY_URL.replace('{0}', buildingId), params);
  }

  public revertTo(buildingId: string, versionId: string) {
    return this.httpHelperService.authJsonPost<any[]>(this.REVERT_TO_URL.replace('{0}', buildingId).replace('{1}', versionId), null);
  }

  public getShopHistory(buildingId: string, shopId: string) {
    return this.httpHelperService.authJsonGet<TenantShopHistoryViewModel[]>(this.HISTORY_SHOP_URL.replace('{0}', buildingId).replace('{1}', shopId), null, false);
  }

  public getBuildingFloors(buildingId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId.toString());

    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_FLOORS_URL, buildingId), params);
  }

  public getBuildingShops(buildingId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId.toString());

    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_SHOPS_URL, buildingId), params);
  }

  public getFloorPlan(buildingId: string, floorId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_FLOOR_PLAN_URL, buildingId, floorId));
  }

  public saveFloorPlan(buildingId: string, model: VersionViewModel<any[]>) {
    return this.httpHelperService.authJsonPost<any>(setURL(this.BUILDING_FLOORS_URL, buildingId), model);
  }

  public updateCommonAreas(buildingId: string, model: VersionViewModel<UpdateCommonAreaViewModel>) {
    return this.httpHelperService.authJsonPut(this.COMMON_AREAS_URL.replace('{0}', buildingId), model);
  }
}

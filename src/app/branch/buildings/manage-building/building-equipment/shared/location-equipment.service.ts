import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {EquipmentViewModel,} from '../shared/models/equipment.model';
import {HttpParams} from '@angular/common/http';
import {PagingViewModel, VersionStatusViewModel} from '@models';

@Injectable()
export class LocationEquipmentService {

  private readonly EQUIPMENTS_FOR_LOCATION_URL: string = '/api/v1/buildings/{0}/locations/{1}/equipment';
  private readonly EQUIPMENT_FOR_LOCATION_URL: string = '/api/v1/buildings/{0}/locations/{1}/equipment/{2}';
  private readonly EQUIPMENT_CLONE_URL: string = '/api/v1/buildings/{0}/meters/{1}/clone';
  private readonly EQUIPMENTS_URL: string = '/api/v1/buildings/{0}/meters/{1}';


  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAllEquipmentsByLocation(buildingId, locationId, searchKey: string = null, order: number = 1, supplyTypeFilter: number = -1, unitIdFilter: string = null, nodeIdFilter: string = null, offset: number | null = null, limit: number | null = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('order', order.toString());
    params = params.append('supplyTypeFilter', supplyTypeFilter.toString());

    if (searchKey) {
      params = params.append('searchKey', searchKey);
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (unitIdFilter) {
      params = params.append('unitIdFilter', unitIdFilter);
    }
    if (nodeIdFilter) {
      params = params.append('nodeIdFilter', nodeIdFilter);
    }


    return this.httpHelperService
      .authJsonGet<PagingViewModel<EquipmentViewModel[]>>(this.EQUIPMENTS_FOR_LOCATION_URL.replace('{0}', buildingId).replace('{1}', locationId), params);
  }

  public getEquipment(buildingId: string, locationId: string, equipmentId: string) {
    return this.httpHelperService.authJsonGet<EquipmentViewModel>(this.EQUIPMENT_FOR_LOCATION_URL.replace('{0}', buildingId).replace('{1}', locationId).replace('{2}', equipmentId));
  }

  public updateEquipment(buildingId: string, locationId: string, model: EquipmentViewModel) {
    return this.httpHelperService.authMultipartFormDataPost<EquipmentViewModel>(this.EQUIPMENT_FOR_LOCATION_URL.replace('{0}', buildingId).replace('{1}', locationId).replace('{2}', model.id), model);
  }

  public cloneEquipment(buildingId: string, equipmentId: string, versionId: string) {
    let params: HttpParams = new HttpParams();

    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonPut<EquipmentViewModel>(this.EQUIPMENT_CLONE_URL.replace('{0}', buildingId).replace('{1}', equipmentId), null, params);
  }

  public updateEquipments(buildingId: string, locationId: string, versionId: string, models: EquipmentViewModel[]) {
    let params: HttpParams = new HttpParams();

    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonPost<VersionStatusViewModel>(this.EQUIPMENTS_FOR_LOCATION_URL.replace('{0}', buildingId).replace('{1}', locationId), models, params, false);
  }

  public deleteEquipment(buildingId: string, locationId: string, equipmentId: string, versionId: string) {
    let params: HttpParams = new HttpParams();

    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonDelete(this.EQUIPMENTS_URL.replace('{0}', buildingId).replace('{1}', equipmentId), params);
  }

}

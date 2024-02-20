import {HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  CommonAreaViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateViewModel,
  LocationViewModel,
  PagingViewModel,
  ShopViewModel,
  SupplyToViewModel,
  TemplateListItemViewModel,
  VersionResultViewModel,
  VersionViewModel
} from '@models';
import {HttpHelperService} from '@services';
import {setURL} from '@shared-helpers';
import {
  EquipmentViewModel,
  MeterDetailViewModel,
  MeterViewModel,
  MeterWriteViewModel,
  ReplaceMeterViewModel,
  UserViewModel
} from './models';
import {ConfirmationPopupMessage} from '@app/shared/models/confirmation-popup-message.model';
import {convertAnyToParams} from '@app/shared/helper/http-helper';

@Injectable()
export class MeterService {

  private readonly GET_EQUIPMENT_TEMPLATES: string = '/api/v1/buildings/{0}/equipment-templates';
  private readonly GET_EQUIPMENT_TEMPLATES_BY_IDS: string = '/api/v1/equipment/{0}/equipment-templates';
  private readonly GET_EQUIPMENT_TEMPLATE: string = '/api/v1/buildings/{0}/equipment-templates/{1}';
  private readonly GET_LOCATIONS: string = '/api/v1/buildings/{0}/locations';
  private readonly GET_SUPPLIES: string = '/api/v1/buildings/{0}/supplies';
  private readonly GET_USERS: string = '/api/v1/user-profiles/users';
  private readonly GET_SHOPS: string = '/api/v1/buildings/{0}/shops';
  private readonly COMMON_AREAS_URL: string = '/api/v1/buildings/{0}/common-areas';
  private readonly GET_METERS: string = '/api/v1/buildings/{0}/meters';
  private readonly GET_METERS_WITH_SUPPLY: string = '/api/v1/buildings/{0}/meters-with-supply';

  private readonly GET_METER_LIST: string = '/api/v1/buildings/{0}/meter-list';

  private readonly METER_URL: string = '/api/v1/buildings/{0}/meters/{1}';
  private readonly BULK_METER_URL: string = '/api/v1/buildings/{0}/bulk-meters';
  private readonly REPLACE_METER_URL: string = '/api/v1/buildings/{0}/meters/{1}/replace';
  private readonly GET_EQUIPMENT_GROUPS: string = '/api/v1/buildings/{0}/equipment-groups';

  private readonly CONNECT_TO_AMR_URL: string = '/api/v1/buildings/{0}/meters/{1}/connect-to-amr-system';
  private readonly GET_READINGS_FROM_AMR_URL: string = '/api/v1/readings/smart-import';

  private readonly GET_SWITCH_BREAKER_URL: string = '/api/v1/buildings/{0}/meters/{1}/switch-breaker';
  private readonly GET_CAN_REMOVE_REGISTER: string = '/api/v1/validate/meter/register/remove';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public canRemoveRegister(versionId: string, meterId: string, registerId: string) {
    const httpParams = new HttpParams()
      .append('versionId', versionId)
      .append('meterId', meterId)
      .append('registerId', registerId);
    return this.httpHelperService.authJsonGet<ConfirmationPopupMessage>(this.GET_CAN_REMOVE_REGISTER, httpParams);
  }

  public getEquipments(buildingId: string) {
    return this.httpHelperService.authJsonGet<TemplateListItemViewModel[]>(
      this.GET_EQUIPMENT_TEMPLATES.replace('{0}', buildingId));
  }

  public getEquipmentsById(buildingId: string, parameters: { templateIds: string[] }) {
    const params: HttpParams = new HttpParams({fromObject: convertAnyToParams(parameters)});
    return this.httpHelperService.authJsonGet<EquipmentTemplateViewModel[]>(
      this.GET_EQUIPMENT_TEMPLATES_BY_IDS.replace('{0}', buildingId), params);
  }

  public getEquipment(buildingId: string, equipmentTemplateId: string) {
    return this.httpHelperService.authJsonGet<EquipmentViewModel>(
      this.GET_EQUIPMENT_TEMPLATE.replace('{0}', buildingId).replace('{1}', equipmentTemplateId));
  }

  public getMeters(buildingId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    if (buildingId) {
      params = params.append('buildingId', buildingId);
    }

    return this.httpHelperService.authJsonGet<MeterDetailViewModel[]>(this.GET_METERS.replace('{0}', buildingId), params);
  }

  public getMetersWithSupply(buildingId: string, versionId: string, registerId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    if (registerId) {
      params = params.append('registerId', registerId);
    }

    return this.httpHelperService.authJsonGet<MeterDetailViewModel[]>(this.GET_METERS_WITH_SUPPLY.replace('{0}', buildingId), params);
  }

  public getMeter(buildingId: string, meterId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonGet<MeterDetailViewModel>(
      this.METER_URL.replace('{0}', buildingId).replace('{1}', meterId), params);
  }

  public getMeterList(buildingId: string, queryModel: { [param: string]: string | string[] }) {
    const params: HttpParams = new HttpParams({fromObject: queryModel});

    return this.httpHelperService.authJsonGet<PagingViewModel<MeterViewModel>>(this.GET_METER_LIST.replace('{0}', buildingId), params);
  }

  public createMeter(buildingId: string, model: VersionViewModel<MeterWriteViewModel>) {
    model.entity.buildingId = buildingId;
    return this.httpHelperService.authMultipartFormDataPut<VersionResultViewModel>(
      this.METER_URL.replace('{0}', buildingId).replace('{1}', ''), model);
  }

  public updateMeter(buildingId: string, model: VersionViewModel<MeterWriteViewModel>) {
    model.entity.buildingId = buildingId;
    return this.httpHelperService.authMultipartFormDataPost<VersionResultViewModel>(
      this.METER_URL.replace('{0}', buildingId).replace('{1}', model.entity.id), model);
  }

  public createBulkMeter(buildingId: string, model: VersionViewModel<MeterWriteViewModel[]>) {
    return this.httpHelperService.authMultipartFormDataPut<VersionResultViewModel>(this.BULK_METER_URL.replace('{0}', buildingId), model);
  }

  public updateBulkMeter(buildingId: string, model: VersionViewModel<MeterWriteViewModel[]>) {
    let params: HttpParams = new HttpParams();
    if (buildingId) {
      params = params.append('buildingId', buildingId);
    }
    return this.httpHelperService.authMultipartFormDataPost<VersionResultViewModel>(
      this.BULK_METER_URL.replace('{0}', buildingId), model, params);
  }

  public replaceMeter(buildingId: string, model: VersionViewModel<ReplaceMeterViewModel>) {
    return this.httpHelperService.authMultipartFormDataPost<VersionResultViewModel>(
      setURL(this.REPLACE_METER_URL, buildingId, model.entity.meter.id), model
    );
  }

  public getLocations(buildingId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonGet<LocationViewModel>(this.GET_LOCATIONS.replace('{0}', buildingId), params);
  }

  public getShops(buildingId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonGet<ShopViewModel[]>(this.GET_SHOPS.replace('{0}', buildingId), params);
  }

  public getCommonAreas(buildingId: string, versionId: string, supplyType: number = null) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    if (supplyType !== undefined && supplyType !== null) {
      params = params.append('supplyType', supplyType.toString());
    }

    return this.httpHelperService.authJsonGet<CommonAreaViewModel[]>(this.COMMON_AREAS_URL.replace('{0}', buildingId), params);
  }

  public getSupplies(buildingId: string, supplyType: number | null) {
    let params: HttpParams = new HttpParams();
    if (supplyType !== undefined && supplyType !== null) {
      params = params.append('supplyType', supplyType.toString());
    }
    return this.httpHelperService.authJsonGet<SupplyToViewModel[]>(this.GET_SUPPLIES.replace('{0}', buildingId), params);
  }

  public getUsers(buildingId: string) {
    return this.httpHelperService.authJsonGet<PagingViewModel<UserViewModel>>(this.GET_USERS);
  }

  public connectToAmrSystem(buildingId: string, meterId: string, versionId: string, importPeriodStartDate: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    params = params.append('importPeriodStartDate', importPeriodStartDate)

    return this.httpHelperService.authJsonGet(this.CONNECT_TO_AMR_URL.replace('{0}', buildingId).replace('{1}', meterId), params);
  }

  public getReadings(buildingId: string, meterId: string) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);
    params = params.append('meterId', meterId);

    return this.httpHelperService.authJsonGet(this.GET_READINGS_FROM_AMR_URL, params);
  }

  public getSwitchBreaker(buildingId: string, meterId: string, versionId: string, breakerState: number) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    params = params.append('breakerState', breakerState.toString());
    return this.httpHelperService.authJsonGet(this.GET_SWITCH_BREAKER_URL.replace('{0}', buildingId).replace('{1}', meterId), params);
  }

  public getEquipmentGroups(buildingId: string) {
    return this.httpHelperService.authJsonGet<EquipmentGroupViewModel[]>(this.GET_EQUIPMENT_GROUPS.replace('{0}', buildingId));
  }
}

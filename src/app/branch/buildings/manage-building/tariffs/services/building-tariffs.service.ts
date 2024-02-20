import {HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

import {HttpHelperService} from '@services';
import {
  CategoryViewModel,
  CreateTariffValueViewModel,
  EquipmentAttributeViewModel,
  RegisterViewModel,
  TariffDetailViewModel,
  TariffValuesViewModel,
  TariffViewModel,
  VersionResultViewModel,
  VersionViewModel
} from '@models';
import {setURL} from '@shared-helpers';


@Injectable()
export class BuildingTariffsService {

  private readonly EQUIPMENT_ATTRIBS_URL: string = 'api/v1/equipment/mc/equipment-attribs';
  private readonly EQUIPMENT_REGISTERS_URL: string = 'api/v1/equipment/mc/registers';
  private readonly BUILDING_TARIFF_CATEGORIES_URL = 'api/v1/tariffs/categories/buildings/{0}';
  private readonly BUILDING_TARIFFS_URL: string = '/api/v1/tariffs/by-building/{0}';
  private readonly TARIFF_URL: string = '/api/v1/tariffs/{0}';
  private readonly DELETE_TARIFF_VERSION_URL: string = '/api/v1/tariffs/{0}/version/{1}';
  private readonly TARIFF_VALUE_URL: string = '/api/v1/tariffs/{0}/values/{1}';
  private readonly TARIFF_VALUE_INCREASE_URL: string = '/api/v1/tariffs/{0}/values/increase';
  private readonly TARIFF_NEW_VERSION_URL: string = '/api/v1/tariffs/{0}/new-version';
  private readonly TARIFF_NEW_SUB_VERSION_URL: string = '/api/v1/tariffs/{0}/new-subversion';
  private readonly TARIFFS_URL: string = '/api/v1/tariffs';
  private readonly CAN_EDIT_SUPPLY_TYPE_URL: string = '/api/v1/tariffs/{0}/can-edit-supply-type';
  private readonly ALL_CATEGORY_URL: string = '/api/v1/branches/all-categories';
  private readonly ALL_COST_PROVIDERS: string = '/api/v1/buildings/{0}/cost-providers';
  private readonly TARIFF_AVAILABLE_DATE_URL: string = '/api/v1/tariffs/next-available-date/{0}';
  private readonly TARIFF_VALUE_VERSION_URL: string = '/api/v1/tariffs/{0}/values/{1}/version';

  constructor(private httpHelperService: HttpHelperService) {

  }

  public getAllCategory() {
    return this.httpHelperService.authJsonGet<CategoryViewModel[]>(this.ALL_CATEGORY_URL);
  }

  public getEquipmentAttributes(isSystem = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('isSystem', isSystem);
    params = params.append('forTariffOnly', 'True');
    return this.httpHelperService.authJsonGet<EquipmentAttributeViewModel[]>(this.EQUIPMENT_ATTRIBS_URL, params);
  }

  public getEquipmentRegisters(isSystem = null): Observable<RegisterViewModel[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('isSystem', isSystem);
    return this.httpHelperService.authJsonGet<RegisterViewModel[]>(this.EQUIPMENT_REGISTERS_URL, params);
  }

  public getBuildingTariffCategories(buildingId): Observable<any> {
    return this.httpHelperService.authJsonGet<any>(setURL(this.BUILDING_TARIFF_CATEGORIES_URL, buildingId));
  }

  public getBuildingTariff(tariffId, buildingId): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);
    return this.httpHelperService.authJsonGet<any>(setURL(this.TARIFF_URL, tariffId), params);
  }

  public updateTariff(model: VersionViewModel<TariffDetailViewModel>, buildingId: string) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);
    return this.httpHelperService.authJsonPut<VersionResultViewModel>(setURL(this.TARIFF_URL, model.id), model, params);
  }

  public addTariffNewVersion(model: VersionViewModel<TariffDetailViewModel>, isSubVersion: boolean) {
    const url = setURL(isSubVersion ? this.TARIFF_NEW_SUB_VERSION_URL : this.TARIFF_NEW_VERSION_URL, model.id)

    return this.httpHelperService.authJsonPost<VersionResultViewModel>(url, model);
  }

  public canEditSupplyType(versionId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.CAN_EDIT_SUPPLY_TYPE_URL, versionId));
  }

  public updateBuildingTariffCategories(buildingId, model): Observable<any> {
    return this.httpHelperService.authJsonPut<any>(setURL(this.BUILDING_TARIFF_CATEGORIES_URL, buildingId), model);
  }

  public getAllTariffs(buildingId: string, searchTerm: string, supplyType: number = -1, order: number = 1, buildingCategoryId: string) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) {
      params = params.append('searchText', searchTerm);
    }
    if (buildingCategoryId) {
      params = params.append('buildingCategoryId', buildingCategoryId);
    }

    params = params.append('supplyTypeFilter', supplyType.toString());
    params = params.append('order', order.toString());
    return this.httpHelperService
      .authJsonGet<VersionViewModel<TariffViewModel>[]>(setURL(this.BUILDING_TARIFFS_URL, buildingId), params);
  }

  public createTariff(model: VersionViewModel<TariffDetailViewModel>) {
    return this.httpHelperService.authMultipartFormDataPost<VersionResultViewModel>(setURL(this.TARIFFS_URL), model);
  }

  public getTariffValue({buildingId, versionId, valueVersionId}) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);
    return this.httpHelperService.authJsonGet<VersionViewModel<TariffValuesViewModel>>(setURL(this.TARIFF_VALUE_URL, versionId, valueVersionId), params);
  }

  public deleteTariffValuesVersion(versionId: string, valueVersionId: string, buildingId: string) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);

    return this.httpHelperService.authJsonDelete(setURL(this.TARIFF_VALUE_VERSION_URL, versionId, valueVersionId));
  }

  public deleteTariffValue(versionId: string, valueId: string, buildingId: string) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);

    return this.httpHelperService.authJsonDelete(setURL(this.TARIFF_VALUE_URL, versionId, valueId));
  }

  public createTariffValueIncrese(versionId: string, model: CreateTariffValueViewModel, buildingId: string) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);
    return this.httpHelperService.authJsonPost(setURL(this.TARIFF_VALUE_INCREASE_URL, versionId), model, params);
  }

  public updateTariffValue({model, buildingId}) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);
    return this.httpHelperService.authJsonPut(setURL(this.TARIFF_VALUE_URL, model.tariffVersionId, model.id), model, params);
  }

  public deleteTariffSubVersion(versionId, buildingId) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);
    return this.httpHelperService.authJsonDelete(setURL(this.TARIFF_URL, versionId), params);
  }

  public deleteTariffVersion(tariffId, majorVersion, buildingId) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);
    return this.httpHelperService.authJsonDelete(setURL(this.DELETE_TARIFF_VERSION_URL, tariffId, majorVersion), params);
  }

  public getCostProviderNodes(buildingId: string, supplyType = null, registerId: string = null) {
    let params: HttpParams = new HttpParams();
    if (supplyType >= 0) {
      params = params.append('supplyType', supplyType);
    }
    if (registerId) {
      params = params.append('registerId', registerId);
    }
    return this.httpHelperService.authJsonGet<any>(setURL(this.ALL_COST_PROVIDERS, buildingId), params);
  }

  public getAvailableDate(tariffId: string) {
    return this.httpHelperService.authJsonGet<Date>(setURL(this.TARIFF_AVAILABLE_DATE_URL, tariffId));
  }

  public createTariffValueVersion(versionId: string, tariffValueId: string, buildingId: string) {
    let params: HttpParams = new HttpParams();
    params = params.append('buildingId', buildingId);

    return this.httpHelperService.authJsonPost(setURL(this.TARIFF_VALUE_VERSION_URL, versionId, tariffValueId), null, params);
  }
}

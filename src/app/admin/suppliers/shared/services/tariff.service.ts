import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {HttpHelperService} from '@services';
import {
  CategoryViewModel,
  CreateTariffValueViewModel,
  TariffDetailViewModel,
  TariffValuesViewModel,
  TariffViewModel,
  VersionResultViewModel,
  VersionViewModel
} from '@models';
import {setURL} from '@shared-helpers';

@Injectable()
export class TariffService {

  private readonly ALL_CATEGORY_URL: string = '/api/v1/branches/all-categories';

  private readonly TARIFFS_URL: string = '/api/v1/tariffs';
  private readonly SUPPLIER_TARIFFS_URL: string = '/api/v1/tariffs/by-supplier/{0}';
  private readonly TARIFF_URL: string = '/api/v1/tariffs/{0}';
  private readonly DELETE_TARIFF_VERSION_URL: string = '/api/v1/tariffs/{0}/version/{1}';
  private readonly TARIFF_NEW_VERSION_URL: string = '/api/v1/tariffs/{0}/new-version';
  private readonly TARIFF_NEW_SUB_VERSION_URL: string = '/api/v1/tariffs/{0}/new-subversion';
  private readonly CAN_EDIT_SUPPLY_TYPE_URL: string = '/api/v1/tariffs/{0}/can-edit-supply-type';
  private readonly TARIFF_VALUE_INCREASE_URL: string = '/api/v1/tariffs/{0}/values/increase';
  private readonly TARIFF_VALUE_VERSION_URL: string = '/api/v1/tariffs/{0}/values/{1}/version';

  private readonly TARIFF_VALUE_URL: string = '/api/v1/tariffs/{0}/values/{1}';
  private readonly TARIFF_AVAILABLE_DATE_URL: string = '/api/v1/tariffs/next-available-date/{0}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAllCategory() {
    return this.httpHelperService.authJsonGet<CategoryViewModel[]>(this.ALL_CATEGORY_URL);
  }

  public getAllTariffs(supplierId: string, searchTerm: string, supplyType: number = -1, order: number = 1, buildingCategoryId: string) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchText', searchTerm);
    if (buildingCategoryId) params = params.append('buildingCategoryId', buildingCategoryId);

    params = params.append('supplyTypeFilter', supplyType.toString());
    params = params.append('order', order.toString());

    return this.httpHelperService.authJsonGet<VersionViewModel<TariffViewModel>[]>(setURL(this.SUPPLIER_TARIFFS_URL, supplierId), params);
  }

  public getTariff(versionId: string) {
    return this.httpHelperService.authJsonGet<VersionViewModel<TariffDetailViewModel>>(setURL(this.TARIFF_URL, versionId));
  }

  public updateTariff(model: VersionViewModel<TariffDetailViewModel>) {
    return this.httpHelperService.authJsonPut<VersionResultViewModel>(setURL(this.TARIFF_URL, model.id), model);
  }

  public createTariff(model: VersionViewModel<TariffDetailViewModel>) {
    return this.httpHelperService.authMultipartFormDataPost<VersionResultViewModel>(setURL(this.TARIFFS_URL), model);
  }

  public addTariffNewVersion(model: VersionViewModel<TariffDetailViewModel>, isSubVersion: boolean) {
    const url = setURL(isSubVersion ? this.TARIFF_NEW_SUB_VERSION_URL : this.TARIFF_NEW_VERSION_URL, model.id);

    return this.httpHelperService.authJsonPost<VersionResultViewModel>(url, model);
  }

  public deleteTariffSubVersion(versionId: string) {
    return this.httpHelperService.authJsonDelete(setURL(this.TARIFF_URL, versionId));
  }

  public deleteTariffVersion(tariffId: string, majorVersion: number) {
    return this.httpHelperService.authJsonDelete(setURL(this.DELETE_TARIFF_VERSION_URL, tariffId, majorVersion));
  }

  public canEditSupplyType(versionId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.CAN_EDIT_SUPPLY_TYPE_URL, versionId));
  }

  public createTariffValueIncrese(supplierId: string, versionId: string, model: CreateTariffValueViewModel) {
    return this.httpHelperService.authJsonPost(setURL(this.TARIFF_VALUE_INCREASE_URL, versionId), model);
  }

  public createTariffValueVersion(versionId: string, tariffValueId: string) {
    return this.httpHelperService.authJsonPost(setURL(this.TARIFF_VALUE_VERSION_URL, versionId, tariffValueId), null);
  }

  public getTariffValue({versionId, valueVersionId}) {
    return this.httpHelperService.authJsonGet<VersionViewModel<TariffValuesViewModel>>(setURL(this.TARIFF_VALUE_URL, versionId, valueVersionId));
  }

  public updateTariffValue(model) {
    return this.httpHelperService.authJsonPut(setURL(this.TARIFF_VALUE_URL, model.tariffVersionId, model.id), model);
  }

  public deleteTariffValuesVersion(versionId: string, valueVersionId: string) {
    return this.httpHelperService.authJsonDelete(setURL(this.TARIFF_VALUE_VERSION_URL, versionId, valueVersionId));
  }

  public deleteTariffValue(versionId: string, valueId: string) {
    return this.httpHelperService.authJsonDelete(setURL(this.TARIFF_VALUE_URL, versionId, valueId));
  }

  public getAvailableDate(tariffId: string) {
    return this.httpHelperService.authJsonGet<Date>(setURL(this.TARIFF_AVAILABLE_DATE_URL, tariffId));
  }
}

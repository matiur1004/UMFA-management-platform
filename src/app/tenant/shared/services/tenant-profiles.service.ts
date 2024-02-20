import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {HttpHelperService} from '@services';
import {setURL} from '@shared-helpers';
import {TenantBuildingPopupViewModel, TenantBuildingViewModel} from '../../profiles/models/profile.model';
import {
  ShopCostsViewModel,
  ShopGeneralInfoViewModel,
  ShopMeterViewModel
} from '../../profiles/models/shop-detail.model';
import {MeterPhotoType} from 'app/branch/buildings/manage-building/building-equipment/shared/models';

@Injectable()
export class TenantProfilesService {

  private readonly GET_TENANT_BUILDINGS_URL: string = '/api/v1/tenant-portal/tenant-profiles';
  private readonly GET_TENANT_BY_CODE_URL: string = '/api/v1/tenant-portal/tenant-by-code';
  private readonly ASSIGN_TENANT_URL: string = '/api/v1/tenant-portal/assign-tenant/{0}';
  private readonly DETACH_TENANT_URL: string = '/api/v1/tenant-portal/detach-tenant/{0}';

  private readonly GET_SHOP_GENERAL_INFO_URL: string = '/api/v1/tenant-portal/buildings/{0}/shops/{1}/general-details';
  private readonly GET_SHOP_ALLOCATED_EQUIPMENT_URL: string = '/api/v1/tenant-portal/buildings/{0}/shops/{1}/meters';
  private readonly GET_SHOP_COSTS_URL: string = '/api/v1/tenant-portal/{0}/shops/{1}/costs';

  private readonly GET_METER_IMAGE_URL: string = '/api/v1/buildings/{0}/meters/{1}/{2}/photo';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getTenantBuildings() {
    return this.httpHelperService.authJsonGet<TenantBuildingViewModel[]>(this.GET_TENANT_BUILDINGS_URL);
  }

  public getTenantBuilding(searchCode: string) {
    let params: HttpParams = new HttpParams();
    params = params.append('searchCode', searchCode);

    return this.httpHelperService.authJsonGet<TenantBuildingPopupViewModel>(this.GET_TENANT_BY_CODE_URL, params, false);
  }

  public addNewProfile(tenantId: string) {
    return this.httpHelperService.authJsonPost(setURL(this.ASSIGN_TENANT_URL, tenantId), null);
  }

  public deleteProfile(tenantId: string) {
    return this.httpHelperService.authJsonDelete(setURL(this.DETACH_TENANT_URL, tenantId));
  }

  public getShopGeneralInfo(buildingId: string, shopId: string) {
    return this.httpHelperService.authJsonGet<ShopGeneralInfoViewModel>(setURL(this.GET_SHOP_GENERAL_INFO_URL, buildingId, shopId));
  }

  public getShopAllocatedEquipment(buildingId: string, shopId: string) {
    return this.httpHelperService.authJsonGet<ShopMeterViewModel[]>(setURL(this.GET_SHOP_ALLOCATED_EQUIPMENT_URL, buildingId, shopId));
  }

  public getShopCosts(buildingId: string, shopId: string) {
    return this.httpHelperService.authJsonGet<ShopCostsViewModel[]>(setURL(this.GET_SHOP_COSTS_URL, buildingId, shopId));
  }

  public getMeterPhotoUrl(buildingId: string, meterId: string, meterPhotoType: MeterPhotoType = MeterPhotoType.ActualPhoto) {
    return setURL(this.GET_METER_IMAGE_URL, buildingId, meterId, meterPhotoType) + '?' + new Date().getTime();
  }
}

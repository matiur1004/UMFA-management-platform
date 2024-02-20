import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';

import {setURL} from '@shared-helpers';
import {HttpParams} from '@angular/common/http';
import {RegisterViewModel, VersionResultViewModel} from '@models';

@Injectable()
export class TariffAssignmentService {

  private readonly BUILDING_DATA_URL = '/api/v1/buildings/{0}';
  private readonly HISTORIES_BUILDING_URL = '/api/v1/histories/building/{0}';
  private readonly BUILDING_OCCUPATION_HISTORIES_URL = '/api/v1/histories/building/{0}/occupation';
  private readonly BRANCH_SUPPLIERS_URL = 'api/v1/branches/{0}/suppliers';
  private readonly BRANCH_TARIFFS_URL = 'api/v1/branches/{0}/tariffs';
  private readonly BRANCHES_ALL_CATEGORIES_URL = 'api/v1/branches/all-categories';
  private readonly BUILDING_TARIFFS_URL = '/api/v1/buildings/{0}/allocated-tariffs';
  private readonly BUILDING_DELETE_TARIFF_URL = '/api/v1/buildings/{0}/allocated-tariffs/{1}';

  private readonly BUILDING_ADDITIONAL_CHARGES_URL = '/api/v1/buildings/{0}/additional-charges';
  private readonly BUILDING_ADDITIONAL_CHARGE_URL = '/api/v1/buildings/{0}/additional-charges/{1}';
  private readonly BUILDING_ADDITIONAL_CHARGE_VALUES_URL = '/api/v1/buildings/{0}/additional-charges/{1}/values';
  private readonly BUILDING_ADDITIONAL_CHARGE_VALUE_URL = '/api/v1/buildings/{0}/additional-charges/{1}/values/{2}';
  private readonly REGISTERS_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/registers';

  constructor(private httpHelperService: HttpHelperService) {

  }

  public getBuildingData(buildingId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_DATA_URL, buildingId));
  }

  public getBuildingHistory(buildingId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.HISTORIES_BUILDING_URL, buildingId));
  }

  public getBuildingHistoryForOccupation(buildingId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_OCCUPATION_HISTORIES_URL, buildingId));
  }

  public getBranchesAllCategories() {
    return this.httpHelperService.authJsonGet(this.BRANCHES_ALL_CATEGORIES_URL);
  }

  public getBranchSuppliers(branchId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.BRANCH_SUPPLIERS_URL, branchId));
  }

  public getBranchTariffs(branchId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.BRANCH_TARIFFS_URL, branchId));
  }

  public getBuildingTariffs(buildingId: string, versionId?: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);
    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_TARIFFS_URL, buildingId), params);
  }

  public addTariffToBuilding(buildingId: string, tariffs: any) {
    return this.httpHelperService.authJsonPut<VersionResultViewModel>(setURL(this.BUILDING_TARIFFS_URL, buildingId), tariffs);
  }

  public deleteTariffFromBuilding(buildingId: string, tariffId: string, versionId?: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);
    return this.httpHelperService.authJsonDelete<VersionResultViewModel>(
      setURL(this.BUILDING_DELETE_TARIFF_URL, buildingId, tariffId), params);
  }

  public getAdditionalCharges(buildingId: string, versionId?: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);
    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_ADDITIONAL_CHARGES_URL, buildingId), params);
  }

  public getAdditionalCharge(buildingId: string, chargeId: string, versionId?: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);
    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_ADDITIONAL_CHARGE_URL, buildingId, chargeId), params);
  }

  public getAdditionalChargeValue(buildingId: string, chargeId: string, valueId: string, versionId?: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);
    return this.httpHelperService.authJsonGet(setURL(this.BUILDING_ADDITIONAL_CHARGE_VALUE_URL, buildingId, chargeId, valueId), params);
  }

  public getAllRegisters(isSystem: any = null) {
    let params: HttpParams = new HttpParams();
    if (isSystem) params = params.append('isSystem', isSystem);
    return this.httpHelperService.authJsonGet<RegisterViewModel[]>(this.REGISTERS_FOR_ADMIN_URL, params);
  }

  public createCharge(buildingId: string, model: any) {
    return this.httpHelperService.authJsonPut<any>(
      setURL(this.BUILDING_ADDITIONAL_CHARGES_URL, buildingId), model);
  }

  public deleteCharge(buildingId: string, chargeId: string, buildingVersionId?: string) {
    let params: HttpParams = new HttpParams();
    if (buildingVersionId) params = params.append('buildingVersionId', buildingVersionId);
    return this.httpHelperService.authJsonDelete<any>(
      setURL(this.BUILDING_ADDITIONAL_CHARGE_URL, buildingId, chargeId), params);
  }

  public updateCharge(buildingId: string, chargeId: string, model: any) {
    return this.httpHelperService.authJsonPost<any>(
      setURL(this.BUILDING_ADDITIONAL_CHARGE_URL, buildingId, chargeId), model);
  }

  public createChargeValue(buildingId: string, chargeId: string, model: any) {
    return this.httpHelperService.authJsonPut<any>(
      setURL(this.BUILDING_ADDITIONAL_CHARGE_VALUES_URL, buildingId, chargeId), model);
  }

  public deleteChargeValue(buildingId: string, chargeId: string, valueId: string, buildingVersionId?: string) {
    let params: HttpParams = new HttpParams();
    if (buildingVersionId) params = params.append('buildingVersionId', buildingVersionId);
    return this.httpHelperService.authJsonDelete<any>(
      setURL(this.BUILDING_ADDITIONAL_CHARGE_VALUE_URL, buildingId, chargeId, valueId), params);
  }

  public updateChargeValue(buildingId: string, chargeId: string, valueId: string, model: any) {
    return this.httpHelperService.authJsonPost<any>(
      setURL(this.BUILDING_ADDITIONAL_CHARGE_VALUE_URL, buildingId, chargeId, valueId), model);
  }
}

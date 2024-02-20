import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {setURL} from '@shared-helpers';
import {SupplyTypeUnitTypeCostViewModel} from '../../shared/models/consumption-report.model';
import {ConfirmationPopupMessage} from '@app/shared/models/confirmation-popup-message.model';
import {HttpParams} from '@angular/common/http';
import {ConfirmationReport} from '@app/shared/models/confirmation-report.model';
import {VersionResultViewModel} from "@app/shared/models";

@Injectable()
export class ConsumptionReportService {

  private readonly COSTS_RECALCULATE_URL = '/api/v1/costs/recalculate/{0}/{1}';
  private readonly TENANTS_LIST_URL = '/api/v1/costs/tenant-costs-report/{0}/{1}';
  private readonly FILTER_OPTIONS_URL = '/api/v1/costs/tenant-costs-report/{0}/{1}/filter-options';
  private readonly TENANT_DETAILS_URL = '/api/v1/costs/tenant-costs-report/{0}/{1}/tenant/{2}';
  private readonly TENANT_OWNER_DETAILS_URL = '/api/v1/costs/tenant-costs-report/{0}/{1}/ownerliability/{2}';
  private readonly TENANT_NOTLIABLE_DETAILS_URL = '/api/v1/costs/tenant-costs-report/{0}/{1}/tenantsnotliable/{2}';
  private readonly TENANT_VACANT_DETAILS_URL = '/api/v1/costs/tenant-costs-report/{0}/{1}/vacant/{2}';
  private readonly VALIDATE_RECALCULATION_URL = '/api/v1/validate/costs/tenant-costs-report/recalculation';
  private readonly COST_TOTALS_URL = '/api/v1/costs/supply-type-unit-type-costs/{0}/{1}';

  constructor(private httpHelperService: HttpHelperService) {

  }

  public getFilterOptions(buildingId: string, buildingPeriodId: string) {
    return this.httpHelperService.authJsonGet<any>(setURL(this.FILTER_OPTIONS_URL, buildingId, buildingPeriodId));
  }

  public getTenantsList(buildingId: string, buildingPeriodId: string, filter: any) {
    return this.httpHelperService.authJsonPost<any>(setURL(this.TENANTS_LIST_URL, buildingId, buildingPeriodId), filter);
  }

  public getTenantCostDetails(buildingId: string, buildingPeriodId: string, tenantId: string, filter: any) {
    return this.httpHelperService.authJsonPost<any>(setURL(this.TENANT_DETAILS_URL, buildingId, buildingPeriodId, tenantId), filter);
  }

  public getTenantOwnerCostDetails(buildingId: string, buildingPeriodId: string, tenantId: string, filter: any) {
    return this.httpHelperService.authJsonPost<any>(setURL(this.TENANT_OWNER_DETAILS_URL, buildingId, buildingPeriodId, tenantId), filter);
  }

  public getTenantNotLiableCostDetails(buildingId: string, buildingPeriodId: string, tenantId: string, filter: any) {
    return this.httpHelperService.authJsonPost<any>(setURL(this.TENANT_NOTLIABLE_DETAILS_URL, buildingId, buildingPeriodId, tenantId), filter);
  }

  public getTenantVacantCostDetails(buildingId: string, buildingPeriodId: string, tenantId: string, filter: any) {
    return this.httpHelperService.authJsonPost<any>(setURL(this.TENANT_VACANT_DETAILS_URL, buildingId, buildingPeriodId, tenantId), filter);
  }
  
  public validateConsumptionReport(buildingId: string, buildingPeriodId: string) {
    const params = new HttpParams().append('buildingId', buildingId).append('buildingPeriodId', buildingPeriodId);
    return this.httpHelperService.authJsonGet<ConfirmationPopupMessage>(setURL(this.VALIDATE_RECALCULATION_URL), params);
  }

  public recalculateCosts(buildingId: string, buildingPeriodId: string, popupData: ConfirmationReport): Observable<VersionResultViewModel> {
    return this.httpHelperService.authJsonPost(setURL(this.COSTS_RECALCULATE_URL, buildingId, buildingPeriodId), popupData);
  }

  public getCostTotals(buildingId: string, buildingPeriodId: string, filter: any) {
    return this.httpHelperService.authJsonPost<SupplyTypeUnitTypeCostViewModel>(setURL(this.COST_TOTALS_URL, buildingId, buildingPeriodId), filter);
  }
}

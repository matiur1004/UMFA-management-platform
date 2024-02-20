import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

import {HttpHelperService} from './http-helper.service';
import {PagingViewModel, TenantViewModel} from '@models';

@Injectable()
export class TenantService {

  private readonly TENANT_URL: string = '/api/v1/buildings/{0}/tenants';
  private readonly TENANT_BY_ID_URL: string = '/api/v1/buildings/{0}/tenants/{1}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAll(buildingId: string, searchTerm: string = '', order: number = 0, offset: number = 0, limit: number | null = Number.MAX_VALUE) {

    let params: HttpParams = new HttpParams();
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (order) {
      params = params.append('order', order.toString());
    }
    if (searchTerm) {
      params = params.append('searchKey', searchTerm);
    }

    return this.httpHelperService.authJsonGet<PagingViewModel<TenantViewModel>>(this.TENANT_URL.replace('{0}', buildingId), params);
  }

  public getById(buildingId: string, tenantId: string) {
    return this.httpHelperService.authJsonGet<TenantViewModel>(this.TENANT_BY_ID_URL.replace('{0}', buildingId).replace('{1}', tenantId));
  }

  public create(buildingId: string, tenant: TenantViewModel, shouldDisplayProgresse: boolean = true) {
    return this.httpHelperService.authMultipartFormDataPut<TenantViewModel>(this.TENANT_URL.replace('{0}', buildingId), tenant, null, shouldDisplayProgresse);
  }

  public update(buildingId: string, tenantId: string, tenant: TenantViewModel) {
    return this.httpHelperService.authMultipartFormDataPost<TenantViewModel>(this.TENANT_BY_ID_URL.replace('{0}', buildingId).replace('{1}', tenantId), tenant);
  }

  public delete(buildingId: string, tenantId: string) {
    return this.httpHelperService.authJsonDelete(this.TENANT_BY_ID_URL.replace('{0}', buildingId).replace('{1}', tenantId));
  }

}

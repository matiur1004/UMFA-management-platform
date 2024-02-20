import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

import {CreateNationalTenantResult, CreateNationalTenantViewModel, NationalTenantViewModel} from '@models';
import {setURL} from '@shared-helpers';
import {HttpHelperService} from './http-helper.service';

@Injectable({
  providedIn: 'root'
})
export class NationalTenantsService {

  private readonly NATIONAL_TENANTS_URL: string = '/api/v1/national-tenants';
  private readonly NATIONAL_TENANT_ENTITY_URL: string = '/api/v1/national-tenants/{0}';
  private readonly LOGO_URL: string = '/api/v1/national-tenants/{0}/logo';

  constructor(private httpService: HttpHelperService) {
  }

  public getNationalTenants() {
    return this.httpService.authJsonGet<NationalTenantViewModel[]>(this.NATIONAL_TENANTS_URL);
  }

  public create(model: CreateNationalTenantViewModel) {
    return this.httpService.authMultipartFormDataPost<CreateNationalTenantResult>(this.NATIONAL_TENANTS_URL, model, null, false).pipe(map(result => {
      let resultModel = <NationalTenantViewModel>{
        id: result.id,
        name: model.name,
        description: model.description,
        logoUrl: result.logoUrl,
        relatedTenantsCount: 0
      }
      return resultModel;
    }));
  }

  public update(model: NationalTenantViewModel): any {
    let url = setURL(this.NATIONAL_TENANT_ENTITY_URL, model.id);
    return this.httpService.authJsonPut<NationalTenantViewModel>(url, model, null, false).pipe(map(() => {
      return model;
    }));
  }

  public delete(nationalTenantId: string) {
    let url = setURL(this.NATIONAL_TENANT_ENTITY_URL, nationalTenantId);
    return this.httpService.authJsonDelete(url);
  }

  public uploadLogo(file: File, nationalTenantId: string) {
    let url = setURL(this.LOGO_URL, nationalTenantId);
    return this.httpService.authMultipartFormDataPatch<string>(url, {logo: file});
  }
}

import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {ServiceViewModel} from '@models';

@Injectable({
  providedIn: 'root'
})
export class ServiceManagerService {

  private readonly MC_SERVICES: string = '/api/v1/services/mc';
  private readonly MC_SERVICES_BY_ID: string = '/api/v1/services/mc/{0}';
  private readonly MC_SERVICES_UPDATE_STATUS_BY_ID: string = '/api/v1/services/mc/{0}/status';

  constructor(private http: HttpHelperService) {
  }

  public getServices() {
    return this.http.authJsonGet<ServiceViewModel[]>(this.MC_SERVICES);
  }

  public getServiceById(serviceId) {
    return this.http.authJsonGet<ServiceViewModel>(this.MC_SERVICES_BY_ID.replace('{0}', serviceId));
  }

  public update(model) {
    return this.http.authJsonPost<ServiceViewModel>(this.MC_SERVICES, model);
  }

  public updateService(model, serviceId) {
    return this.http.authJsonPost<ServiceViewModel>(this.MC_SERVICES_BY_ID.replace('{0}', serviceId), model);
  }

  public create(model, parentId: string = '') {
    return this.http.authJsonPut<ServiceViewModel>(this.MC_SERVICES_BY_ID.replace('{0}', parentId), model);
  }

  public updateServiceStatus(serviceId, model: any) {
    return this.http.authJsonPost<ServiceViewModel>(this.MC_SERVICES_UPDATE_STATUS_BY_ID.replace('{0}', serviceId), model);
  }

  public deleteService(serviceId) {
    return this.http.authJsonDelete<ServiceViewModel[]>(this.MC_SERVICES_BY_ID.replace('{0}', serviceId));
  }
}

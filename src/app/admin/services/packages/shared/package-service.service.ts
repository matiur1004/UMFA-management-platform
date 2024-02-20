import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {PackageOrder, PackageViewModel} from '@models';
import {HttpParams} from '@angular/common/http';

@Injectable()
export class PackageServiceService {
  private readonly PACKAGES: string = '/api/v1/packages';
  private readonly PACKAGES_DEFAULT: string = '/api/v1/packages/default';
  private readonly PACKAGES_BY_ID: string = '/api/v1/packages/{0}';
  private readonly PACKAGES_UPDATE_STATUS_BY_ID: string = '/api/v1/packages/{0}/status';


  constructor(private http: HttpHelperService) {
  }

  get(order: PackageOrder = 1, offset: number = 0, limit: number | null = null) {
    let params: HttpParams = new HttpParams();

    if (order) params = params.append('order', order.toString());
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());

    return this.http.authJsonGet<PackageViewModel[]>(this.PACKAGES, params);
  }

  public getDefault() {
    return this.http.authJsonGet<PackageViewModel>(this.PACKAGES_DEFAULT);
  }

  public create(model) {
    return this.http.authJsonPut<PackageViewModel>(this.PACKAGES, model);
  }

  public update(model) {
    return this.http.authJsonPost<PackageViewModel>(this.PACKAGES, model);
  }

  public getPackage(packageId) {
    return this.http.authJsonGet<PackageViewModel>(this.PACKAGES_BY_ID.replace('{0}', packageId));
  }

  public updatePackage(model, packageId) {
    return this.http.authJsonPost<PackageViewModel>(this.PACKAGES_BY_ID.replace('{0}', packageId), model);
  }

  public deletePackage(packageId) {
    return this.http.authJsonDelete<PackageViewModel>(this.PACKAGES_BY_ID.replace('{0}', packageId));
  }

  public updatePackageStatus(serviceId, model: any) {
    return this.http.authJsonPatch(this.PACKAGES_UPDATE_STATUS_BY_ID.replace('{0}', serviceId), model);
  }

  public patchPackage(model, packageId) {
    return this.http.authJsonPatch<PackageViewModel>(this.PACKAGES_BY_ID.replace('{0}', packageId), model);
  }
}

import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {BuildingPackageDetailViewModel, BuildingPackageViewModel} from './models';
import {HttpParams} from '@angular/common/http';
import {PagingViewModel} from '@models';

@Injectable()
export class BuildingServicesService {

  private readonly BUILDING_PACKAGES: string = '/api/v1/buildings/packages';
  private readonly BUILDING_PACKAGE: string = '/api/v1/buildings/{0}/package';
  private readonly BUILDING_PACKAGE_STATUS: string = '/api/v1/buildings/{0}/package/iscomplete';
  private readonly BUILDING_PACKAGE_BY_ID: string = '/api/v1/buildings/{0}/packages/{1}';

  constructor(private http: HttpHelperService) {
  }

  get(searchTerm: string = '', offset: number = 0, limit: number | null = null, category: number = -1) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchTerm', searchTerm);
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (category) params = params.append('category', category.toString());

    return this.http.authJsonGet<PagingViewModel<BuildingPackageViewModel[]>>(this.BUILDING_PACKAGES, params);
  }

  getDetails(buildingId: string, packageId: string) {
    return this.http.authJsonGet<BuildingPackageDetailViewModel>(this.BUILDING_PACKAGE_BY_ID.replace('{0}', buildingId).replace('{1}', packageId));
  }

  getApplied(buildingId: string) {
    return this.http.authJsonGet<BuildingPackageDetailViewModel>(this.BUILDING_PACKAGE.replace('{0}', buildingId));
  }

  save(buildingId: string, model) {
    return this.http.authJsonPost(this.BUILDING_PACKAGE.replace('{0}', buildingId), model);
  }

  getStatus(buildingId: string) {
    return this.http.authJsonGet<boolean>(this.BUILDING_PACKAGE_STATUS.replace('{0}', buildingId));
  }

  saveCustomizationServices(packageId: string, model) {
    return this.http.authJsonPost(this.BUILDING_PACKAGE.replace('{0}', packageId), model);
  }
}

import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

import {HttpHelperService} from '@services';
import {LocationViewModel, VersionResultViewModel, VersionStatusViewModel, VersionViewModel} from '@models';

@Injectable()
export class LocationService {

  private readonly LOCATIONS_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/locations';
  private readonly DEFAULT_LOCATION_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/locations/default';
  private readonly LOCATION_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/locations/{1}';
  private readonly CLONE_LOCATION_URL: string = '/api/v1/buildings/{0}/locations/{1}/clone';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAllLocationsByBuilding(buildingId: string, versionId: string, searchKey: string, order: number = 1) {
    let params: HttpParams = new HttpParams();
    params = params.append('order', order.toString());

    if (searchKey) params = params.append('searchKey', searchKey);
    if (versionId) params = params.append('versionId', versionId);

    return this.httpHelperService.authJsonGet<LocationViewModel[]>(this.LOCATIONS_FOR_BUILDING_URL.replace('{0}', buildingId), params);
  }

  public getLocation(buildingId: string, locationId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);

    return this.httpHelperService.authJsonGet<LocationViewModel>(this.LOCATION_FOR_BUILDING_URL.replace('{0}', buildingId).replace('{1}', locationId), params);
  }

  public cloneLocation(buildingId: string, locationId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);

    return this.httpHelperService.authJsonPut<VersionStatusViewModel>(this.CLONE_LOCATION_URL.replace('{0}', buildingId).replace('{1}', locationId), null, params);
  }

  public getDefaultLocation(buildingId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);

    return this.httpHelperService.authJsonGet<LocationViewModel>(this.DEFAULT_LOCATION_FOR_BUILDING_URL.replace('{0}', buildingId), params);
  }

  public createLocation(buildingId: string, model: VersionViewModel<LocationViewModel>) {
    return this.httpHelperService.authJsonPut<VersionResultViewModel>(this.LOCATIONS_FOR_BUILDING_URL.replace('{0}', buildingId), model);
  }

  public updateLocation(buildingId: string, locationId: string, model: VersionViewModel<LocationViewModel>) {
    return this.httpHelperService.authJsonPost<VersionResultViewModel>(this.LOCATION_FOR_BUILDING_URL.replace('{0}', buildingId).replace('{1}', locationId), model);
  }

  public updateLocations(buildingId: string, models: LocationViewModel[], versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);

    return this.httpHelperService.authJsonPost<VersionStatusViewModel>(this.LOCATIONS_FOR_BUILDING_URL.replace('{0}', buildingId), models, params, false);
  }

  public deleteLocation(buildingId: string, locationId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) params = params.append('versionId', versionId);

    return this.httpHelperService.authJsonDelete<VersionStatusViewModel>(this.LOCATION_FOR_BUILDING_URL.replace('{0}', buildingId).replace('{1}', locationId), params);
  }
}

import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {NodeSetsViewModel} from '../shared/models';
import {HttpParams} from '@angular/common/http';
import {VersionResultViewModel, VersionStatusViewModel, VersionViewModel} from '@models';

@Injectable()
export class NodeSetsService {

  private readonly NODE_SETS_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/node-sets';
  private readonly NODE_SET_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/node-sets/{1}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAllNodeSetsList(buildingId, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    const url = this.NODE_SETS_FOR_BUILDING_URL.replace('{0}', buildingId);
    return this.httpHelperService
      .authJsonGet<NodeSetsViewModel[]>(url, params);
  }

  public getNodeSet(buildingId: string, nodeId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    const url = this.NODE_SET_FOR_BUILDING_URL.replace('{0}', buildingId).replace('{1}', nodeId);
    return this.httpHelperService.authJsonGet<NodeSetsViewModel>(url, params);
  }

  public createNodeSet(buildingId: string, model: VersionViewModel<NodeSetsViewModel>) {
    const url = this.NODE_SETS_FOR_BUILDING_URL.replace('{0}', buildingId);
    return this.httpHelperService.authJsonPost<VersionResultViewModel>(url, model);
  }

  public updateNodeSet(buildingId: string, model: VersionViewModel<NodeSetsViewModel>) {
    const url = this.NODE_SET_FOR_BUILDING_URL.replace('{0}', buildingId).replace('{1}', model.id);
    return this.httpHelperService.authJsonPut<VersionResultViewModel>(url, model);
  }

  public deleteNodeSet(buildingId: string, nodeId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    const url = this.NODE_SET_FOR_BUILDING_URL.replace('{0}', buildingId).replace('{1}', nodeId);
    return this.httpHelperService.authJsonDelete<VersionStatusViewModel>(url, params);
  }
}

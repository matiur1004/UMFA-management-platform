import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

import {HttpHelperService} from '@services';
import {
  ChildNodeAssignmentViewModel,
  NodeDetailViewModel,
  NodeEditViewModel,
  NodeViewModel,
  SearchFilterUnits,
  SearchFilterUnitsModel
} from '../shared/models';
import {TariffViewModel, VersionResultViewModel, VersionStatusViewModel, VersionViewModel} from '@models';
import {setURL} from '@shared-helpers';
import {ReplaceMeterNodeViewModel} from './models/replace-meter-node.model';

@Injectable()
export class NodeService {

  private readonly NODES_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/nodes';
  private readonly REGISTERS_FOR_NODES: string = '/api/v1/buildings/{0}/unit-nodes';
  private readonly NODE_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/nodes/{1}';
  private readonly ALLOWED_CHILDREN_FOR_NODE: string = '/api/v1/buildings/{0}/allowed-node-children/{1}';
  private readonly BULK_NODES_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/bulk-nodes';

  private readonly TARIFFS_FOR_BUILDING_URL: string = '/api/v1/buildings/{0}/tariffs';
  private readonly GET_NODES_BY_METER: string = '/api/v1/buildings/{0}/nodes/by-meter/{1}';
  private readonly GET_RECOMENDED_CATEGORIES_FOR_TARIFF: string = '/api/v1/tariffs/applicable-categories/buildings/{0}';
  private readonly UPDATE_COST_ALLOCATION: string = '/api/v1/buildings/{0}/nodes/{1}/cost-allocation';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAllNodesByBuilding(buildingId, versionId: string, searchKey: string, order: number = 1, supplyTypeFilter: number = -1, nodeTypeFilter: number = -1, offset: number = 0, limit: number = 0) {
    let params: HttpParams = new HttpParams();
    params = params.append('order', order.toString());
    params = params.append('supplyTypeFilter', supplyTypeFilter.toString());
    params = params.append('nodeTypeFilter', nodeTypeFilter.toString());

    if (searchKey) {
      params = params.append('searchKey', searchKey);
    }
    if (offset) {
      params = params.append('offset', offset.toString());
    }
    if (limit) {
      params = params.append('limit', limit.toString());
    }
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService
      .authJsonGet<NodeViewModel[]>(this.NODES_FOR_BUILDING_URL.replace('{0}', buildingId), params);
  }

  public getAllBulkNodesByBuilding(buildingId: string, versionId: string, supplyType: any, nodeIds: string[] = [], excludeCostProviders: any = true) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }
    if (supplyType !== undefined) {
      params = params.append('supplyTypeFilter', supplyType);
    }
    params = params.append('excludeCostProviders', excludeCostProviders ? 'true' : 'false');

    if (nodeIds && nodeIds.length) {
      nodeIds.forEach((el, index) => {
        params = params.append('nodeIds[' + index + ']', el);
      });
    }

    return this.httpHelperService
      .authJsonGet<NodeDetailViewModel[]>(this.BULK_NODES_FOR_BUILDING_URL.replace('{0}', buildingId), params);
  }

  public updateAllBulkNodesByBuilding(buildingId: string, nodes: any[]) {
    return this.httpHelperService
      .authMultipartFormDataPut<any>(this.BULK_NODES_FOR_BUILDING_URL.replace('{0}', buildingId), nodes);
  }

  public getNode(buildingId: string, nodeId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonGet<NodeDetailViewModel>(this.NODE_FOR_BUILDING_URL.replace('{0}', buildingId).replace('{1}', nodeId), params);
  }

  public getRegistersByNodes(buildingId: string, versionId: string, model: SearchFilterUnits) {
    let params = new HttpParams();

    const newModel = {...model};

    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonPost<SearchFilterUnitsModel[]>(this.REGISTERS_FOR_NODES.replace('{0}', buildingId), newModel, params);
  }

  public createNode(buildingId: string, model: VersionViewModel<NodeEditViewModel>) {
    return this.httpHelperService.authJsonPost<VersionResultViewModel>(this.NODES_FOR_BUILDING_URL.replace('{0}', buildingId), model);
  }

  public updateNode(buildingId: string, model: VersionViewModel<NodeEditViewModel>) {
    return this.httpHelperService.authMultipartFormDataPut<VersionResultViewModel>(setURL(this.NODE_FOR_BUILDING_URL, buildingId, model.entity.id), model);
  }

  public deleteNode(buildingId: string, nodeId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonDelete<VersionStatusViewModel>(this.NODE_FOR_BUILDING_URL.replace('{0}', buildingId).replace('{1}', nodeId), params);
  }

  public getAllowedChildrenForNode(buildingId: string, nodeId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonGet<ChildNodeAssignmentViewModel[]>(
      setURL(this.ALLOWED_CHILDREN_FOR_NODE, buildingId, nodeId), params);
  }


  public getTariffsForBuilding(buildingId: string, supplyType: number = -1, versionId: string = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('supplyType', supplyType.toString());
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonGet<VersionViewModel<TariffViewModel>[]>(
      setURL(this.TARIFFS_FOR_BUILDING_URL, buildingId), params, false);
  }

  public getRecomendedCategoriesForTariffsByNode(buildingId: string, versionId: string, nodeIds: string[]) {
    const url = this.GET_RECOMENDED_CATEGORIES_FOR_TARIFF.replace('{0}', buildingId);
    let params: HttpParams = new HttpParams();
    params = params.append('versionId', versionId);

    return this.httpHelperService.authJsonPost<any[]>(
      setURL(url, buildingId), nodeIds, params, false);
  }

  public getNodesByMeter(buildingId: string, meterId: string, versionId: string) {
    let params: HttpParams = new HttpParams();
    if (versionId) {
      params = params.append('versionId', versionId);
    }

    return this.httpHelperService.authJsonGet<ReplaceMeterNodeViewModel[]>(
      setURL(this.GET_NODES_BY_METER, buildingId, meterId), params);
  }

  public updateCostAllocation(buildingId: string, versionId: string, model: any) {
    const nodeId = model.entity.nodeId;
    let params: HttpParams = new HttpParams();
    if (versionId) {
      model.id = versionId;
    }
    return this.httpHelperService.authJsonPut<VersionResultViewModel>(setURL(this.UPDATE_COST_ALLOCATION, buildingId, nodeId), model, params);
  }
}

import {HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {setURL} from '@shared-helpers';
import {Observable} from 'rxjs';


@Injectable()
export class BuildingEquipmentService {
  private readonly BUILDINGS_EQUIPMENT_TREE_URL: string = '/api/v1/buildings/{0}/equipment-tree';

  constructor(private httpHelperService: HttpHelperService) {

  }

  public getBuildingEquipmentTree(buildingId: string, supplyType: number, versionId?: string): Observable<any> {
    let params: HttpParams = new HttpParams();

    params = params.append('supplyType', supplyType.toString());
    if (versionId) params = params.append('versionId', versionId);

    return this.httpHelperService.authJsonGet(setURL(this.BUILDINGS_EQUIPMENT_TREE_URL, buildingId), params);
  }
}

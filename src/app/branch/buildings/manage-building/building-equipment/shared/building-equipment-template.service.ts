import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {map} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';
import {EquipmentTemplateListItemViewModel, PagingViewModel} from '@models';
import {BuildingEquipTemplateFilterViewModel} from '../shared/models/equipment.model';

@Injectable()
export class BuildingEquipmentTemplateService {

  private readonly EQUIPMENT_TEMPLATES_URL: string = '/api/v1/equipment/{0}/equipment-templates';
  private readonly EQUIPMENT_TEMPLATE_URL_BY_ID: string = '/api/v1/equipment/{0}/equipment-templates/{1}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAllEquipmentTemplates(buildingId: string, filter: BuildingEquipTemplateFilterViewModel, order: number = 1, assignFilter: number = -1, searchKey: string = null, offset: number | null = null, limit: number | null = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('order', order.toString());
    params = params.append('assignFilter', assignFilter.toString());

    if (searchKey) params = params.append('searchKey', searchKey);
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());

    return this.httpHelperService.authMultipartFormDataPost<PagingViewModel<EquipmentTemplateListItemViewModel>>(this.EQUIPMENT_TEMPLATES_URL.replace('{0}', buildingId), filter, params).pipe(map(response => {
      return response;
    }));
  }

  public addEquipmentTemplateForBuilding(buildingId: string, equipmentTemplateId: string) {
    return this.httpHelperService.authJsonPut(this.EQUIPMENT_TEMPLATE_URL_BY_ID.replace('{0}', buildingId).replace('{1}', equipmentTemplateId), null);
  }

  public removeEquipmentTemplateFromBuilding(buildingId: string, equipmentTemplateId: string) {
    return this.httpHelperService.authJsonDelete(this.EQUIPMENT_TEMPLATE_URL_BY_ID.replace('{0}', buildingId).replace('{1}', equipmentTemplateId));
  }
}

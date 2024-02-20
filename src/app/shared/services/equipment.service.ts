/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {
  BrandViewModel,
  EquipmentAttributeUnitsViewModel,
  EquipmentAttributeViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateAttributeViewModel,
  EquipmentTemplateFilterViewModel,
  EquipmentTemplateListItemViewModel,
  EquipmentTemplateViewModel,
  PagingViewModel,
  RegisterEditViewModel,
  RegisterViewModel,
  SupplyToViewModel,
  SupplyType,
  UnitOfMeasurement,
  ObisCodeViewModel
} from '@models';

import {HttpHelperService} from './http-helper.service';
import {EstimatedReadingReasonViewModel} from '@app/shared/models/estimated-reading-reason';

@Injectable()
export class EquipmentService {

  public readonly EQUIPMENT_IMAGE_URL: string = '/api/v1/equipment/mc/equipment-templates/{0}/image';
  private readonly EQUIPMENT_GROUPS_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/equipment-groups';
  private readonly EQUIPMENT_GROUP_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/equipment-groups/{0}';
  private readonly EQUIPMENT_ATTRIBS_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/equipment-attribs';
  private readonly EQUIPMENT_ATTRIB_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/equipment-attribs/{0}';
  private readonly BRANDS_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/brands';
  private readonly BRAND_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/brands/{0}';
  private readonly SUPPLY_LOCATION_TYPES_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/supply-locations';
  private readonly SUPPLY_LOCATION_TYPE_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/supply-locations/{0}';
  private readonly REGISTERS_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/registers';
  private readonly REGISTER_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/registers/{0}';
  private readonly REASONS_FORM_ADMIN_URL: string = '/api/v1/equipment/mc/reasons';
  private readonly REASON_FORM_ADMIN_URL: string = '/api/v1/equipment/mc/reasons/{0}';
  private readonly UNIT_OF_MEASUREMENT_URL: string = '/api/v1/equipment/units-of-measurement';
  private readonly EQUIPMENT_TEMPLATES_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/equipment-templates';
  private readonly EQUIPMENT_TEMPLATE_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/equipment-templates/{0}';
  private readonly EQUIPMENT_TEMPLATES_MODELS_URL: string = '/api/v1/equipment/mc/equipment-templates/models';
  private readonly EQUIPMENT_TEMPLATES_ATTRIBUTES_URL: string = '/api/v1/equipment/mc/equipment-templates/attributes';
  private readonly GET_EQUIPMENT_UNITS_URL: string = '/api/v1/equipment/mc/equipment-attribs/units';
  private readonly OBISCODES_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/obiscodes';
  private readonly OBISCODE_FOR_ADMIN_URL: string = '/api/v1/equipment/mc/obiscodes/{0}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  /* Equipment Groups */

  public getAllEquipmentGroups(searchTerm: string) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchKey', searchTerm);

    return this.httpHelperService.authJsonGet<EquipmentGroupViewModel[]>(this.EQUIPMENT_GROUPS_FOR_ADMIN_URL, params).pipe(map(response => {
      return response;
    }));
  }

  public getEquipmentGroup(equipmentGroupId: string) {
    return this.httpHelperService.authJsonGet<EquipmentGroupViewModel>(this.EQUIPMENT_GROUP_FOR_ADMIN_URL.replace('{0}', equipmentGroupId));
  }

  public createEquipmentGroup(model: EquipmentGroupViewModel) {
    return this.httpHelperService.authMultipartFormDataPut<EquipmentGroupViewModel>(this.EQUIPMENT_GROUPS_FOR_ADMIN_URL, model);
  }

  public updateEquipmentGroup(equipmentGroupId: string, model: EquipmentGroupViewModel) {
    return this.httpHelperService.authMultipartFormDataPost(this.EQUIPMENT_GROUP_FOR_ADMIN_URL.replace('{0}', equipmentGroupId), model);
  }

  public deleteEquipmentGroup(equipmentGroupId: string) {
    return this.httpHelperService.authJsonDelete(this.EQUIPMENT_GROUP_FOR_ADMIN_URL.replace('{0}', equipmentGroupId));
  }

  /* Equipment Attributes */

  public getAllEquipmentAttributes(searchTerm: string, isSystem = null) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchKey', searchTerm);
    params = params.append('isSystem', isSystem);

    return this.httpHelperService.authJsonGet<EquipmentAttributeViewModel[]>(this.EQUIPMENT_ATTRIBS_FOR_ADMIN_URL, params).pipe(map(response => {
      return response;
    }));
  }

  public getEquipmentAttribute(equipmentAttribId: string) {
    return this.httpHelperService.authJsonGet<EquipmentAttributeViewModel>(this.EQUIPMENT_ATTRIB_FOR_ADMIN_URL.replace('{0}', equipmentAttribId));
  }

  public createEquipmentAttribute(model: EquipmentAttributeViewModel) {
    return this.httpHelperService.authMultipartFormDataPut<EquipmentAttributeViewModel>(this.EQUIPMENT_ATTRIBS_FOR_ADMIN_URL, model);
  }

  public updateEquipmentAttribute(equipmentAttribId: string, model: EquipmentAttributeViewModel) {
    if (model.comboSettings && model.comboSettings.length > 0) model.comboSettings.forEach((cs, i) => cs.sequence = i + 1);
    return this.httpHelperService.authMultipartFormDataPost(this.EQUIPMENT_ATTRIB_FOR_ADMIN_URL.replace('{0}', equipmentAttribId), model);
  }

  public deleteEquipmentAttribute(equipmentAttribId: string) {
    return this.httpHelperService.authJsonDelete(this.EQUIPMENT_ATTRIB_FOR_ADMIN_URL.replace('{0}', equipmentAttribId));
  }

  public getEquipmentUnits() {
    return this.httpHelperService.authJsonGet<EquipmentAttributeUnitsViewModel>(this.GET_EQUIPMENT_UNITS_URL);
  }

  /* Equipment Brands */

  public getAllBrands(searchTerm: string) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchKey', searchTerm);
    return this.httpHelperService.authJsonGet<BrandViewModel[]>(this.BRANDS_FOR_ADMIN_URL, params).pipe(map(response => {
      return response;
    }));
  }

  public getBrand(brandId: string) {
    return this.httpHelperService.authJsonGet<BrandViewModel>(this.BRAND_FOR_ADMIN_URL.replace('{0}', brandId));
  }

  public createBrand(model: BrandViewModel) {
    return this.httpHelperService.authMultipartFormDataPut<BrandViewModel>(this.BRANDS_FOR_ADMIN_URL, model);
  }

  public updateBrand(brandId: string, model: BrandViewModel) {
    return this.httpHelperService.authMultipartFormDataPost(this.BRAND_FOR_ADMIN_URL.replace('{0}', brandId), model);
  }

  public deleteBrand(brandId: string) {
    return this.httpHelperService.authJsonDelete(this.BRAND_FOR_ADMIN_URL.replace('{0}', brandId));
  }

  /* Supply To and Locations */

  public getAllSupplyLocationTypes(searchTerm: string, supplyType: SupplyType | null = null) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchKey', searchTerm);
    if (supplyType != null) params = params.append('supplyType', supplyType.toString());

    return this.httpHelperService.authJsonGet<SupplyToViewModel[]>(this.SUPPLY_LOCATION_TYPES_FOR_ADMIN_URL, params).pipe(map(response => {
      return response;
    }));
  }

  public getSupplyLocationType(supplyLocationTypeId: string) {
    return this.httpHelperService.authJsonGet<SupplyToViewModel>(this.SUPPLY_LOCATION_TYPE_FOR_ADMIN_URL.replace('{0}', supplyLocationTypeId));
  }

  public createSupplyLocationType(model: SupplyToViewModel) {
    return this.httpHelperService.authMultipartFormDataPut<SupplyToViewModel>(this.SUPPLY_LOCATION_TYPES_FOR_ADMIN_URL, model);
  }

  public updateSupplyLocationType(supplyToId: string, model: SupplyToViewModel) {
    return this.httpHelperService.authMultipartFormDataPost(this.SUPPLY_LOCATION_TYPE_FOR_ADMIN_URL.replace('{0}', supplyToId), model);
  }

  public deleteSupplyLocationType(supplyToId: string) {
    return this.httpHelperService.authJsonDelete(this.SUPPLY_LOCATION_TYPE_FOR_ADMIN_URL.replace('{0}', supplyToId));
  }

  /* Units Of Measurement */

  public getUnitsOfMeasurement() {
    return this.httpHelperService.authJsonGet<UnitOfMeasurement[]>(this.UNIT_OF_MEASUREMENT_URL).pipe(map(response => {
      return response;
    }));
  }

  /* Registers */

  public getAllRegisters(searchTerm: string) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchKey', searchTerm);

    return this.httpHelperService.authJsonGet<RegisterViewModel[]>(this.REGISTERS_FOR_ADMIN_URL, params).pipe(map(response => {
      return response;
    }));
  }

  public getRegister(registerId: string) {
    return this.httpHelperService.authJsonGet<RegisterViewModel>(this.REGISTER_FOR_ADMIN_URL.replace('{0}', registerId));
  }

  public createRegister(model: RegisterEditViewModel) {
    return this.httpHelperService.authJsonPut<RegisterViewModel>(this.REGISTERS_FOR_ADMIN_URL, model);
  }

  public updateRegister(registerId: string, model: RegisterEditViewModel) {
    return this.httpHelperService.authJsonPost(this.REGISTER_FOR_ADMIN_URL.replace('{0}', registerId), model);
  }

  public deleteRegister(registerId: string) {
    return this.httpHelperService.authJsonDelete(this.REGISTER_FOR_ADMIN_URL.replace('{0}', registerId));
  }

  /* Equipment Reasons */
  public getAllReasons(searchTerm: string) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchKey', searchTerm);

    return this.httpHelperService.authJsonGet<EstimatedReadingReasonViewModel[]>(this.REASONS_FORM_ADMIN_URL, params).pipe(map(response => {
      return response;
    }));
  }

  public getReason(reasonId: string) {
    return this.httpHelperService.authJsonGet<EstimatedReadingReasonViewModel>(this.REASON_FORM_ADMIN_URL.replace('{0}', reasonId));
  }

  public createReason(model: EstimatedReadingReasonViewModel) {
    return this.httpHelperService.authJsonPost<EstimatedReadingReasonViewModel>(this.REASONS_FORM_ADMIN_URL, model);
  }

  public updateReason(reasonId: string, model: EstimatedReadingReasonViewModel) {
    return this.httpHelperService.authJsonPut(this.REASON_FORM_ADMIN_URL.replace('{0}', reasonId), model);
  }

  public deleteReason(reasonId: string) {
    return this.httpHelperService.authJsonDelete(this.REASON_FORM_ADMIN_URL.replace('{0}', reasonId));
  }

  /* Equipment Templates */

  public getAllEquipmentTemplates(filter: EquipmentTemplateFilterViewModel, order = 1, searchKey: string = null, offset: number | null = null, limit: number | null = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('order', order.toString());

    if (searchKey) params = params.append('searchKey', searchKey);
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());

    return this.httpHelperService.authMultipartFormDataPost<PagingViewModel<EquipmentTemplateListItemViewModel>>(this.EQUIPMENT_TEMPLATES_FOR_ADMIN_URL, filter, params).pipe(map(response => {
      return response;
    }));
  }

  public getAllEquipmentTemplateModels() {
    return this.httpHelperService.authJsonGet<string[]>(this.EQUIPMENT_TEMPLATES_MODELS_URL).pipe(map(response => {
      return response;
    }));
  }

  public getAllEquipmentTemplateAttributes() {
    return this.httpHelperService.authJsonGet<EquipmentTemplateAttributeViewModel[]>(this.EQUIPMENT_TEMPLATES_ATTRIBUTES_URL).pipe(map(response => {
      return response;
    }));
  }

  public getEquipmentTemplate(equipmentTemplateId: string) {
    var equipmentTemplate = this.httpHelperService.authJsonGet<EquipmentTemplateViewModel>(this.EQUIPMENT_TEMPLATE_FOR_ADMIN_URL.replace('{0}', equipmentTemplateId));
    return equipmentTemplate;
  }

  public createEquipmentTemplate(model: EquipmentTemplateViewModel) {
    var mdl = this.updateRegisterSequence(model);
    return this.httpHelperService.authMultipartFormDataPut<EquipmentTemplateViewModel>(this.EQUIPMENT_TEMPLATES_FOR_ADMIN_URL, mdl);
  }

  public updateEquipmentTemplate(equipmentTemplateId: string, model: EquipmentTemplateViewModel) {
    var mdl = this.updateRegisterSequence(model);
    return this.httpHelperService.authMultipartFormDataPost(this.EQUIPMENT_TEMPLATE_FOR_ADMIN_URL.replace('{0}', equipmentTemplateId), mdl);
  }

  public updateRegisterSequence(model: EquipmentTemplateViewModel) {
    var seq = 0;
    model.registers.forEach((e) => {
      e.sequenceNumber = ++seq
    });
    return model;
  }

  public deleteEquipmentTemplate(equipmentTemplateId: string) {
    return this.httpHelperService.authJsonDelete(this.EQUIPMENT_TEMPLATE_FOR_ADMIN_URL.replace('{0}', equipmentTemplateId));
  }

  /* Obis Codes */

  public getAllObisCodes(searchTerm: string) {
    let params: HttpParams = new HttpParams();

    if (searchTerm) params = params.append('searchKey', searchTerm);

    return this.httpHelperService.authJsonGet<ObisCodeViewModel[]>(this.OBISCODES_FOR_ADMIN_URL, params).pipe(map(response => {
      return response;
    }));
  }

  public getObisCode(obisCodeId: string) {
    return this.httpHelperService.authJsonGet<ObisCodeViewModel>(this.OBISCODE_FOR_ADMIN_URL.replace('{0}', obisCodeId));
  }

  public createObisCode(model: ObisCodeViewModel) {
    return this.httpHelperService.authJsonPost<ObisCodeViewModel>(this.OBISCODES_FOR_ADMIN_URL, model);
  }

  public updateObisCode(obisCodeId: string, model: ObisCodeViewModel) {
    return this.httpHelperService.authJsonPut(this.OBISCODE_FOR_ADMIN_URL.replace('{0}', obisCodeId), model);
  }

  public deleteObisCode(obisCodeId: string) {
    return this.httpHelperService.authJsonDelete(this.OBISCODE_FOR_ADMIN_URL.replace('{0}', obisCodeId));
  }
}

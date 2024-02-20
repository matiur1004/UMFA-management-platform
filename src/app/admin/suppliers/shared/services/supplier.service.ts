import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {HttpHelperService} from '@services';
import {
  EquipmentAttributeViewModel,
  RegisterViewModel,
  SupplierViewModel,
  SupplyType,
  UnitOfMeasurement
} from '@models';
import {HttpParams} from '@angular/common/http';
import {setURL} from '@shared-helpers';


@Injectable()
export class SupplierService {

  private readonly SUPPLIERS_URL = 'api/v1/tariffs/suppliers/';
  private readonly SUPPLIER_ENTITY_URL = 'api/v1/tariffs/suppliers/{0}';

  private readonly EQUIPMENT_ATTRIBS_URL: string = 'api/v1/equipment/mc/equipment-attribs';
  private readonly EQUIPMENT_REGISTERS_URL: string = 'api/v1/equipment/mc/registers';
  private readonly UNITS_OF_MEASUREMENT_URL: string = 'api/v1/equipment/units-of-measurement';
  private readonly SUPPLIER_TARIFF_CATEGORIES_URL = 'api/v1/tariffs/categories/suppliers/{0}';

  constructor(private httpHelperService: HttpHelperService) {

  }

  public getAll(searchText: string, supplyType: SupplyType | null = null) {
    let params: HttpParams = new HttpParams();
    if (searchText) params = params.append('searchText', searchText);
    if (supplyType !== undefined && supplyType !== null) params = params.append('supplyType', supplyType.toString());

    return this.httpHelperService.authJsonGet<SupplierViewModel[]>(this.SUPPLIERS_URL, params);
  }

  public getSupplier(id: string) {
    return this.httpHelperService.authJsonGet<SupplierViewModel>(setURL(this.SUPPLIER_ENTITY_URL, id));
  }

  public deleteSupplier(id: string) {
    return this.httpHelperService.authJsonDelete(setURL(this.SUPPLIER_ENTITY_URL, id));
  }

  public updateSupplier(supplier: SupplierViewModel) {
    return this.httpHelperService.authMultipartFormDataPut<SupplierViewModel>(setURL(this.SUPPLIER_ENTITY_URL, supplier.id), supplier);
  }

  public createSupplier(supplier) {
    return this.httpHelperService.authMultipartFormDataPost<SupplierViewModel>(this.SUPPLIERS_URL, supplier);
  }

  public getEquipmentAttributes(isSystem = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('isSystem', isSystem);
    params = params.append('forTariffOnly', "True");
    return this.httpHelperService.authJsonGet<EquipmentAttributeViewModel[]>(this.EQUIPMENT_ATTRIBS_URL, params);
  }

  public getEquipmentRegisters(isSystem = null): Observable<RegisterViewModel[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('isSystem', isSystem);
    return this.httpHelperService.authJsonGet<RegisterViewModel[]>(this.EQUIPMENT_REGISTERS_URL, params);
  }

  public getUnitsOfMeasurement(): Observable<UnitOfMeasurement[]> {
    return this.httpHelperService.authJsonGet<UnitOfMeasurement[]>(this.UNITS_OF_MEASUREMENT_URL);
  }


  public getSupplierTariffCategories(supplierId): Observable<any> {
    return this.httpHelperService.authJsonGet<any>(setURL(this.SUPPLIER_TARIFF_CATEGORIES_URL, supplierId));
  }

  public updateSupplierTariffCategories(supplierId, model): Observable<any> {
    return this.httpHelperService.authJsonPut<any>(setURL(this.SUPPLIER_TARIFF_CATEGORIES_URL, supplierId), model);
  }
}

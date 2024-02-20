import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';

import {setURL} from '@shared-helpers';
import {HttpParams} from '@angular/common/http';

@Injectable()
export class SupplierService {

  private readonly SUPPLIERS_URL = 'api/v1/tariffs/suppliers';
  private readonly BRANCH_SUPPLIERS_URL = 'api/v1/branches/{0}/suppliers';
  private readonly BRANCH_SUPPLIER_URL = 'api/v1/branches/{0}/suppliers/{1}';
  private readonly BRANCH_SUPPLIER_TARIFFS_URL = 'api/v1/branches/{0}/suppliers/{1}/tariffs';

  constructor(private httpHelperService: HttpHelperService) {

  }

  public getSuppliers(supplyType: string = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('supplyType', supplyType);
    return this.httpHelperService.authJsonGet(this.SUPPLIERS_URL, params);
  }

  public addSupplierToBranch(branchId: string, supplierId: string) {
    return this.httpHelperService.authJsonPut(setURL(this.BRANCH_SUPPLIER_URL, branchId, supplierId), null);
  }

  public deleteSupplierFromBranch(branchId: string, supplierId: string) {
    return this.httpHelperService.authJsonDelete(setURL(this.BRANCH_SUPPLIER_URL, branchId, supplierId));
  }

  public getBranchSuppliers(branchId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.BRANCH_SUPPLIERS_URL, branchId));
  }

  public getSupplierTariffs(branchId: string, supplierId: string) {
    return this.httpHelperService.authJsonGet(setURL(this.BRANCH_SUPPLIER_TARIFFS_URL, branchId, supplierId));
  }
}

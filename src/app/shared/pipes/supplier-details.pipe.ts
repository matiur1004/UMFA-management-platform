import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'supplierDetails'
})
export class SupplierDetailsPipe implements PipeTransform {

  transform(supplyToId: string, suppliers: any[]): any {
    let res = '<span class="supply-name">N/A</span>';
    if (supplyToId && Array.isArray(suppliers)) {
      const supply = suppliers.find(supply => supply.id === supplyToId);
      if (supply) {
        res = `<span class="supply-name" title="${supply.name}">${supply.name}</span>`;
      }
    }
    return res;
  }

}

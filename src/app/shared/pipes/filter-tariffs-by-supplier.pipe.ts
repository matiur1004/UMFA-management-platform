import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterTariffsBySupplier'
})
export class FilterTariffsBySupplierPipe implements PipeTransform {
  transform(value: any[], selectedSupplier: string): any {
    let res = value;
    if (value) {
      res = value.filter(el => {
        return el.entity.supplierId === (selectedSupplier ? selectedSupplier : null);
      });
    }
    return res;
  }
}

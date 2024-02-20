import {Pipe, PipeTransform} from '@angular/core';
import {AddBuildingTariffViewModel} from '@models';

@Pipe({
  name: 'fiterBranchTariffs'
})
export class FiterBranchTariffsPipe implements PipeTransform {

  transform(listBranchTariffs: AddBuildingTariffViewModel[], filterSupplyType: number, filterSupplier: string, filterBuildingCategories: string[]): any {
    let res = [];

    listBranchTariffs.forEach(el => {
      if (((typeof filterSupplyType !== 'number') || el.entity.supplyType === filterSupplyType)
        && (!filterSupplier || el.entity.supplierId === filterSupplier)
        && (!filterBuildingCategories.length || el.entity.buildingCategoriesIds.some(bcId => filterBuildingCategories.indexOf(bcId) > -1))
      ) {
        res.push(el);
      }
    });

    return res;
  }

}

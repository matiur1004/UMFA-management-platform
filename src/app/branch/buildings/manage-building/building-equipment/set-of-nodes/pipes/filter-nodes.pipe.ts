import {Pipe, PipeTransform} from '@angular/core';
import {NodeDetailViewModel} from '../../shared/models';
import {SearchFilterModel} from '../../shared/models/search-filter.model';

@Pipe({
  name: 'filterNodes'
})
export class FilterNodesPipe implements PipeTransform {

  transform(list: NodeDetailViewModel[], filter: SearchFilterModel): any {
    let res = [];
    if (list && Array.isArray(list) && filter) {
      list.forEach(el => {
        const filterName = filter.name.toLocaleLowerCase();
        if (filterName && el.name.toLocaleLowerCase().indexOf(filterName) === -1) {
          return;
        }
        const nodeType = filter.nodeType;
        if (nodeType !== '' && el.nodeType !== parseInt(nodeType)) {
          return;
        }

        if (filter.supplyToId && el.supplyToId !== filter.supplyToId) {
          return;
        }

        if (filter.locationTypeId && el.supplyToLocationId !== filter.locationTypeId) {
          return;
        }

        if (filter.tariffIds && filter.tariffIds.length > 0 && !el.tariffs.find(tariff => filter.tariffIds.includes(tariff.id))) {
          return;
        }

        if (filter.areaId && !el.shopIds.includes(filter.areaId) && !el.commonAreaIds.includes(filter.areaId)) {
          return;
        }

        if (filter.attributeValueFilter.attributeId) {
          let attribute = el.attributeValues.find(attributeValue => attributeValue.attributeId === filter.attributeValueFilter.attributeId);
          if (attribute) {
            let attributeValue = +attribute.recommendedValue;
            if (filter.attributeValueFilter.min && filter.attributeValueFilter.min > attributeValue) {
              return;
            }
            if (filter.attributeValueFilter.max && filter.attributeValueFilter.max < attributeValue) {
              return;
            }
          }
        }

        res.push(el);
      });
    } else if (!filter) {
      res = list;
    }
    return res;
  }

}

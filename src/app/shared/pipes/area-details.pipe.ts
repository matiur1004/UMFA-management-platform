import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'areaDetails'
})
export class AreaDetailsPipe implements PipeTransform {

  transform(areaId: string, areas: any[]): any {
    let res = '';
    if (areaId && Array.isArray(areas)) {
      const area = areas.find(shop => shop.id === areaId);
      if (area) {
        res = `<div class="area-name" title="${area.name}">${area.name}</div>`;
      }
    }
    return res;
  }

}

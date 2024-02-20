import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'locationTypeDetails'
})
export class LocationTypeDetailsPipe implements PipeTransform {

  transform(locationTypeId: string, supplies: any[]): any {
    let res = '<span class="supply-name">N/A</span>';
    if (locationTypeId && Array.isArray(supplies)) {
      let locationType;
      supplies.forEach(supply => {
        if (supply.locationTypes) {
          supply.locationTypes.forEach(lType => {
            if (lType.id === locationTypeId) {
              locationType = lType;
            }
          })
        }
      })
      if (locationType) {
        res = `<span class="supply-name" title="${locationType.name}">${locationType.name}</span>`;
      }
    }
    return res;
  }

}

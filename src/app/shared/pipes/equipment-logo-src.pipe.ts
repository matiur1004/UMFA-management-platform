import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'equipmentLogoSrc'
})
export class EquipmentLogoSrcPipe implements PipeTransform {

  public readonly EQUIPMENT_IMAGE_URL: string = '/api/v1/equipment/mc/equipment-templates/{0}/image';

  transform(equipmentId: string): string {
    return this.EQUIPMENT_IMAGE_URL.replace(`{0}`, equipmentId) + '?' + Math.random();
  }

}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'tariffHasDuplicationFactor'
})
export class TariffHasDuplicationFactorPipe implements PipeTransform {

  transform(value: string, tariffs: any[]): any {
    return !!tariffs && tariffs.some(t => t && t.id === value && t.entity && t.entity.lineItems && t.entity.lineItems.some(i => i.hasDuplicationFactor));
  }
}

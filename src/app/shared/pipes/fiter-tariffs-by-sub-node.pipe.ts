import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fiterTariffsBySubNode',
  pure: false
})
export class FiterTariffsBySubNodePipe implements PipeTransform {

  transform(tariffs: any[], subNodeId: string = null): any {
    const res = [];
    if (tariffs && Array.isArray(tariffs)) {
      tariffs.forEach(tariff => {
        if ((subNodeId === null && (tariff.nodeId === null || tariff.nodeId === undefined))
          || tariff.nodeId === subNodeId) {
          res.push(tariff);
        }
      });
    }
    return res;
  }

}

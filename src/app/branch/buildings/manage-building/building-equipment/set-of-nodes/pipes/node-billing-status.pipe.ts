import {Pipe, PipeTransform} from '@angular/core';
import {NodeDetailViewModel} from '../../shared/models';

@Pipe({
  name: 'nodeBillingStatus',
  pure: false
})
export class NodeBillingStatusPipe implements PipeTransform {

  transform(node: NodeDetailViewModel): any {
    let res = '';
    if (!node.tariffs || node.tariffs.length === 0) {
      res = 'node-billing-no-tariffs';
    } else {
      let onlyBillings = true;
      let onlyReadOnly = true;
      node.tariffs.forEach(tariff => {
        if (tariff.isBilling) {
          onlyReadOnly = false;
        } else {
          onlyBillings = false;
        }
      });

      if (onlyBillings) {
        res = 'node-billing-only-billing';
      }
      if (onlyReadOnly) {
        res = 'node-billing-only-readonly';
      }
    }
    return res;
  }

}

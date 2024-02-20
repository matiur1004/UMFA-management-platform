import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'markLikeHighlighted'
})
export class MarkLikeHighlightedPipe implements PipeTransform {

  transform(value: any[], nodeId: string): any {
    let res = [];
    if (value) {
      res = [].concat(value);
      res.forEach(el => {
        if (nodeId && el.nodes.some(node => node.id === nodeId)) {
          el.highlight = true;
        } else {
          el.highlight = false;
        }
      });
    }

    return res;
  }

}

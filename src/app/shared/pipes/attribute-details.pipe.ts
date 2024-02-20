import {Pipe, PipeTransform} from '@angular/core';
import {EquipmentAttributeViewModel} from '@models';
import {NodeAttributeValueViewModel} from '../../branch/buildings/manage-building/building-equipment/shared/models';

@Pipe({
  name: 'attributeDetails'
})
export class AttributeDetailsPipe implements PipeTransform {

  transform(nodeAttribute: NodeAttributeValueViewModel, attributes: EquipmentAttributeViewModel[]): any {
    let res = '';

    if (nodeAttribute && Array.isArray(attributes)) {
      const attributeId = nodeAttribute.attributeId;
      const attribute = attributes.find(attribute => attribute.id === attributeId);
      if (attribute) {
        let attributeValue = nodeAttribute.value || nodeAttribute.recommendedValue || '0';
        const attributeName = attribute.name;
        let attributeShortName = attribute.name;
        if (attributeName === 'Notified Maximum Demand') {
          attributeShortName = 'Maximum Demand';
        }
        if (['CB size', 'Notified Maximum Demand'].indexOf(attributeName) !== -1) {
          attributeValue = Math.round(parseFloat(attributeValue) * 100) / 100;
        }
        res = `<div class="attribute-item" title="${attributeName}">`
          + `<label class="attribute-name">${attributeShortName}:</label>`
          + `<span class="attribute-value">${attributeValue}</span>`
          + `</div>`;
      }
    }
    return res;
  }

}

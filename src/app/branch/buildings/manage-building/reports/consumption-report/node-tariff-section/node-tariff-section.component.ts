import {Component, Input} from '@angular/core';
import {TimeOfUseName} from '@models';

@Component({
  selector: 'node-tariff-section',
  templateUrl: './node-tariff-section.component.html',
  styleUrls: ['./node-tariff-section.component.less']
})
export class NodeTariffSectionComponent {

  timeOfUseNames = TimeOfUseName;

  private _nodeTariffSections = [];

  get nodeTariffSections(): any[] {
    return this._nodeTariffSections;
    }

  @Input() set nodeTariffSections(value: any[]) {
    if (!value || !value.length) {
      return;
    }

    this._nodeTariffSections = value.map(tariff => ({
      ...tariff,
      lineItemGroups: tariff.lineItems.reduce((prev, curr) => {
        let group = curr.lineItemId;

        if (curr.groupId) {
          group += curr.groupId;
        }

        if (!prev.hasOwnProperty(group)) {
          prev[group] = [];
        }

        prev[group].push(curr);
        return prev;
      }, {})
    }));
  }

  transformFormula(formula: string) {
    let formulaItems = formula.split('×').filter(item => item.trim() != '1/30' && item.trim() != '1 days');
    return formulaItems.join(' × ');
  }
}

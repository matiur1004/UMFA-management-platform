import {Pipe, PipeTransform} from '@angular/core';
import {NodeDetailViewModel} from '../../../shared/models';
import {SplitType, UnitType} from '@models';

@Pipe({
  name: 'calculateProportion',
  pure: false
})
export class CalculateProportionPipe implements PipeTransform {

  getEqualValue(unit: any, node: NodeDetailViewModel) {
    const isVacantShop = node.includeVacant;
    const isNotLiableShop = node.includeNotLiable;
    let res = 0, totalCount = 0;
    //calculate total value
    if (isVacantShop === false || isNotLiableShop === false) {
      node.allocatedUnits.forEach(el => {
        if (!((!isVacantShop && el.unitType === UnitType.Shop && !el['tenantName']) || (!isNotLiableShop && !el.isLiable))) {
          totalCount++;
        }
      })
    } else {
      totalCount = node.allocatedUnits.length;
    }

    //calculate unit proportion
    if ((isVacantShop === false && !unit.tenantName && unit.unitType === UnitType.Shop) || (isNotLiableShop === false && unit.isLiable === false)) {
      res = 0;
    } else {
      res = totalCount ? (100 / totalCount) : 0;
    }

    return res;
  }

  getProportionalValue(unit: any, node: NodeDetailViewModel) {
    const isVacantShop = node.includeVacant;
    const isNotLiableShop = node.includeNotLiable;
    let res = 0, sumArea = 0;
    //calculate total value
    if (isVacantShop === false || isNotLiableShop === false) {
      node.allocatedUnits.forEach(el => {
        if (!((!isVacantShop && el.unitType === UnitType.Shop && !el['tenantName']) || (!isNotLiableShop && !el.isLiable))) {
          sumArea += el['area'] ? el['area'] : 0;
        }
      })
    } else {
      sumArea = node.allocatedUnits.map(el => el['area']).reduce((a, b) => a + (b ? b : 0));
    }

    //calculate unit proportion
    if ((isVacantShop === false && !unit.tenantName && unit.unitType === UnitType.Shop) || (isNotLiableShop === false && unit.isLiable === false)) {
      res = 0;
    } else {
      res = sumArea ? (100 * unit.area / sumArea) : 0;
    }
    return res;
  }

  getCustomValue(unit: any, node: NodeDetailViewModel) {
    const isVacantShop = node.includeVacant;
    const isNotLiableShop = node.includeNotLiable;
    let res = 0, sumAllocationShare = 0;
    if (isVacantShop === false || isNotLiableShop === false) {
      node.allocatedUnits.forEach(el => {
        if (!((!isVacantShop && el.unitType === UnitType.Shop && !el['tenantName']) || (!isNotLiableShop && !el.isLiable))) {
          sumAllocationShare += el['allocationShare'] ? el['allocationShare'] : 0;
        }
      })
    } else {
      sumAllocationShare = node.allocatedUnits.map(el => el['allocationShare']).reduce((a, b) => a + (b ? b : 0));
    }

    if ((isVacantShop === false && !unit.tenantName && unit.unitType === UnitType.Shop) || (isNotLiableShop === false && unit.isLiable === false)) {
      res = 0;
    } else if (sumAllocationShare) {
      res = sumAllocationShare ? (100 * unit.allocationShare / sumAllocationShare) : 0;
    }

    return res;
  }

  getConsumptionValue(unit: any, node: NodeDetailViewModel) {
    return 100;
  }

  transform(unit: any, node: NodeDetailViewModel): any {
    let res = 0;
    switch (node.splitType) {
      case SplitType.Equal: {
        res = this.getEqualValue(unit, node);
        break;
      }
      case SplitType.Proportional: {
        res = this.getProportionalValue(unit, node);
        break;
      }
      case SplitType.Custom: {
        res = this.getCustomValue(unit, node);
        break;
      }
      case SplitType.Consumption: {
        res = this.getConsumptionValue(unit, node);
        break;
      }
    }

    return res;
  }

}

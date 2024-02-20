import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';

import * as fromActions from '../actions/equipment-tree.actions';
import * as fromReducers from '../reducers';

import {BuildingEquipmentService} from '../../building-equipment.service';
import {
  BreakerPhases,
  EquipmentTreeAttributeModel,
  EquipmentTreeModel,
  EquipmentTypes,
  SupplyType,
  SystemEquipmentGroups
} from '@models';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';

@Injectable()
export class EquipmentTreeEffects {

  getChargeValueData$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.GET_EQUIPMENT_TREE),
    withLatestFrom(
      this.store$.pipe(select(commonData.getBuildingId)),
      this.store$.pipe(select(commonData.getSelectedVersionId)),
      (action: fromActions.GetEquipmentTree, buildingId: string, versionId: string) => ({action, buildingId, versionId})
    ),
    switchMap(({action, buildingId, versionId}) =>
      this.s.getBuildingEquipmentTree(buildingId, SupplyType.Electricity, versionId)
        .pipe(
          map((res: any) => {
            const newData = this.transformEquipmentTree(res);

            return new fromActions.GetEquipmentTreeSuccess(newData);
          }),
          catchError((res: HttpErrorResponse) =>
            of({type: 'DUMMY'}))
        )
    )
  ));

  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<fromReducers.State>,
    private readonly s: BuildingEquipmentService
  ) {
  }

  transformEquipmentTree(data: EquipmentTreeModel[]) {
    return data.map((e, i) => {
      return {
        ageInDays: e['ageInDays'],
        isDummy: e['isDummy'],
        isFaulty: e['isFaulty'],
        reasonOfFaulty: e['reasonOfFaulty'],
        lastReadings: e['lastReadings'],
        location: this.getLocation(e),
        nodes: e['nodes'],
        shops: e.shops,
        commonAreas: e.commonAreas,
        serialNumber: e.serialNumber,
        meterId: e.meterId,
        meterType: e['meterType'],
        parentMeters: e.parentMeters,
        equipmentModel: e.equipmentModel,
        attributes: this.checkTypeByAttributes(e),
        children: this.transformEquipmentTree(e.children),
        description: this.getDescription(e),
        lastReadingSource: e.lastReadingSource,
        supplyType: e.supplyType
      };
    });
  }

  getDescription(model: EquipmentTreeModel) {
    return model['locationDetails'] && model['locationDetails']['description'];
  }

  checkTypeByAttributes(model: EquipmentTreeModel) {
    const attributes = model.attributes;

    if (model.equipmentGroup === SystemEquipmentGroups.ElectricityMeters) {

      if (this.isType(attributes, 'CT Meter')) {
        return this.getCTMeterData(attributes);
      }

      if (this.isType(attributes, 'High Voltage Meter')) {
        return this.getHighVoltageMeterData(attributes);
      }

      return this.getWholeMeterData(attributes);
    }

    return this.getBreakerData(attributes);
  }

  isType(attrs: EquipmentTreeAttributeModel[], value: string) {
    return attrs.find(a => a.name === 'Type' && a.value === value);
  }

  isName(attrs: EquipmentTreeAttributeModel[], name: string) {
    return attrs.find(a => a.name === name);
  }

  getLocation(model: EquipmentTreeModel) {
    const supplyDetail = model['locationDetails'] && model['locationDetails']['supplyDetail'];
    const locationDetails = model['locationDetails'];
    return {
      supplyTo: supplyDetail && supplyDetail.name,
      locationType: supplyDetail && supplyDetail.locationType,
      locationName: locationDetails && locationDetails.location.name,
      locationId: locationDetails && locationDetails.location.id
    };
  }

  getBreakerData(attributes: EquipmentTreeAttributeModel[]) {
    const breaker: any = {type: EquipmentTypes.Breaker};

    attributes.forEach((attr) => {
      switch (attr.name) {
        case 'Phase':
          breaker.phase =
            attr.value === BreakerPhases.ThreePhases
              ? 3
              : attr.value === BreakerPhases.TwoPhases
                ? 2
                : attr.value === BreakerPhases.OnePhase
                  ? 1
                  : null;
          break;

        case 'Voltage':
          breaker.voltage = `${attr.value} ${attr.unitName}`;
          break;

        case 'CB size':
          breaker.amperage = `${attr.value} ${attr.unitName}`;
          break;
      }
    });
    return breaker;
  }

  getWholeMeterData(attributes: EquipmentTreeAttributeModel[]) {
    const meter: any = {type: EquipmentTypes.WholeCurrentMeter};

    attributes.forEach((attr) => {
      switch (attr.name) {
        case 'Voltage':
          meter.breakerInfo = {};
          meter.breakerInfo.attributes = this.getBreakerData(attributes);
          break;

        case 'PT Ratio':
          meter.ptRatio = attr.value;
          break;

        case 'CT Ratio':
          meter.ctRatio = attr.value;
          break;
      }
    });

    return meter;
  };

  getCTMeterData(attributes: EquipmentTreeAttributeModel[]) {
    const meter: any = {type: EquipmentTypes.CTMeter};

    attributes.forEach((attr) => {
      switch (attr.name) {
        case 'Voltage':
          meter.breakerInfo = {};
          meter.breakerInfo.attributes = this.getBreakerData(attributes);
          break;

        case 'PT Ratio':
          meter.ptRatio = attr.value;
          break;

        case 'CT Ratio':
          meter.ctRatio = attr.value;
          break;
      }
    });

    return meter;
  };

  getHighVoltageMeterData(attributes: EquipmentTreeAttributeModel[]) {
    const meter: any = {type: EquipmentTypes.HighVoltageMeter};

    attributes.forEach((attr) => {
      switch (attr.name) {
        case 'Voltage':
          meter.breakerInfo = {};
          meter.breakerInfo.attributes = this.getBreakerData(attributes);
          break;

        case 'PT Ratio':
          meter.ptRatio = attr.value;
          break;

        case 'CT Ratio':
          meter.ctRatio = attr.value;
          break;
      }
    });

    return meter;
  };

  getShopsNames(shops: any[]): string {
    return shops.map(s => {
      let name = s.name, tenantName = s.tenant ? s.tenant.name : '';
      if (name.length >= 10) name = name.slice(0, 10) + '...';
      if (tenantName.length >= 10) tenantName = tenantName.slice(0, 10) + '...';
      return tenantName ? `${name} (${tenantName})` : name;
    }).join('\n');
  }
}

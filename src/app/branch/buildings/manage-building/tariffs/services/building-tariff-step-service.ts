import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';

import {TariffStepService} from 'app/shared/tariffs/step-items/tariff-step.service';
import {TariffStepModel, TariffStepRangeModel, UnitOfMeasurement} from '@models';
import * as buildingTariffStore from '../store/reducers';
import * as tariffStepsActions from 'app/shared/tariffs/store/actions/tariff-steps.actions';
import {getUnitsOfMeasurement} from '../../shared/store/selectors/common-data.selectors';

@Injectable()
export class BuildingTariffStepsService extends TariffStepService {
  constructor(private store: Store<buildingTariffStore.State>) {
    super();
  }

  getUnitsOfMeasurement(): Observable<UnitOfMeasurement[]> {
    return this.store.pipe(select(getUnitsOfMeasurement));
  }

  tariffStepAdd(perVersion: boolean): void {
    this.store.dispatch(perVersion
      ? new tariffStepsActions.TariffStepAddNewStepForVersion(buildingTariffStore.featureName)
      : new tariffStepsActions.TariffStepAddNewStep(buildingTariffStore.featureName, [new TariffStepModel()]));
  }

  tariffStepRangeAdd(stepId: string): void {
    this.store.dispatch(new tariffStepsActions.TariffStepAddNewRange(buildingTariffStore.featureName, stepId));
  }

  tariffStepDelete(id: string): void {
    this.store.dispatch(new tariffStepsActions.TariffStepDeleteStep(buildingTariffStore.featureName, id));
  }

  tariffStepRangeDelete(payload: { stepId: string; rangeId: string; }): void {
    this.store.dispatch(new tariffStepsActions.TariffStepDeleteRange(buildingTariffStore.featureName, payload));
  }

  tariffStepRangeChange(payload: { rangeData: TariffStepRangeModel; stepId: string; rangeId: string; }): void {
    this.store.dispatch(new tariffStepsActions.TariffStepSetDataRange(buildingTariffStore.featureName, payload));
  }

}

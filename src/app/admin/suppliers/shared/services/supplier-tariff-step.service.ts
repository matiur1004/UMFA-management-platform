import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {TariffStepService} from 'app/shared/tariffs';
import {State} from '../store/reducers';
import * as selectors from '../store/selectors';
import {TariffStepModel, TariffStepRangeModel, UnitOfMeasurement} from '@models';
import * as tariffStepsActions from 'app/shared/tariffs/store/actions/tariff-steps.actions';


const featureName = 'supplier';

@Injectable()
export class SupplierTariffStepService extends TariffStepService {

  constructor(private store: Store<State>) {
    super();
  }

  getUnitsOfMeasurement(): Observable<UnitOfMeasurement[]> {
    return this.store.pipe(select(selectors.getSupplierUnitsOfMeasurement));
  }

  tariffStepAdd(perVersion: boolean): void {
    this.store.dispatch(perVersion
      ? new tariffStepsActions.TariffStepAddNewStepForVersion(featureName)
      : new tariffStepsActions.TariffStepAddNewStep(featureName, [new TariffStepModel()]));
  }

  tariffStepRangeAdd(stepId: string): void {
    this.store.dispatch(new tariffStepsActions.TariffStepAddNewRange(featureName, stepId));
  }

  tariffStepDelete(id: string): void {
    this.store.dispatch(new tariffStepsActions.TariffStepDeleteStep(featureName, id));
  }

  tariffStepRangeDelete(payload: { stepId: string; rangeId: string; }): void {
    this.store.dispatch(new tariffStepsActions.TariffStepDeleteRange(featureName, payload));
  }

  tariffStepRangeChange(payload: { rangeData: TariffStepRangeModel; stepId: string; rangeId: string; }): void {
    this.store.dispatch(new tariffStepsActions.TariffStepSetDataRange(featureName, payload));
  }
}

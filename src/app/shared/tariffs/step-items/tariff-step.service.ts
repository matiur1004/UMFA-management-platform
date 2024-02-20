import {Observable} from 'rxjs';
import {TariffStepRangeModel, UnitOfMeasurement} from '@models';

export abstract class TariffStepService {
  abstract getUnitsOfMeasurement(): Observable<UnitOfMeasurement[]>;

  abstract tariffStepAdd(perVersion: boolean): void;

  abstract tariffStepRangeAdd(stepId: string): void;

  abstract tariffStepDelete(id: string): void;

  abstract tariffStepRangeDelete(payload: { stepId: string; rangeId: string; }): void;

  abstract tariffStepRangeChange(payload: { rangeData: TariffStepRangeModel; stepId: string; rangeId: string; }): void;
}

import {
  addArrayControl,
  createFormGroupState,
  disable,
  enable,
  FormGroupState,
  formStateReducer,
  removeArrayControl,
  setErrors,
  setValue,
  updateArray,
  updateArrayWithFilter,
  updateGroup,
  validate,
  ValidationFn
} from 'ngrx-forms';
import {greaterThanOrEqualTo, lessThanOrEqualTo, maxLength, required} from 'ngrx-forms/validation';
import {combineReducers} from '@ngrx/store';

import {InfinityRange, TariffStepModel, TariffStepRangeModel} from '@models';

import * as tariffStepActions from '../actions/tariff-steps.actions';

export interface TariffStepsFormValue {
  id: string;
  stepsEnabled: boolean;
  steps: TariffStepModel[];
}

export const TariffStepsDefaultState = {
  id: '',
  stepsEnabled: false,
  steps: []
};

export interface State {
  formState: FormGroupState<TariffStepsFormValue>;
}

export const validateAndUpdateForm = updateGroup<TariffStepsFormValue>({
  steps: (s, parent) => {
    if (parent.value.stepsEnabled !== s.isEnabled) {
      s = parent.value.stepsEnabled ? enable(s) : disable(s);
    }

    return updateArray<TariffStepModel>((step) => {
      return updateGroup<TariffStepModel>({
        name: validate(required, maxLength(150)),
        applyPer: validate(required),
        unitOfMeasurement: validate(required),
        ranges: updateArray<TariffStepRangeModel>((range, data) => {
          const isFirstItem = range.value.id === data.value[0].id;

          return updateGroup<TariffStepRangeModel>({
            from: (from) => {
              const fromValidators: ValidationFn<number>[] = [required];
              fromValidators.push(step.value.withNegativeRanges ? greaterThanOrEqualTo(0) : greaterThanOrEqualTo(InfinityRange.MIN));

              if (isFirstItem) {
                fromValidators.push(lessThanOrEqualTo(0));
              }

              return validate<number>(from, fromValidators);
            },
            to: validate(required, lessThanOrEqualTo(InfinityRange.MAX))
          })(range);
        })
      })(step);
    })(s);
  }
});


// HELPERS
const updateRange = (
  state: FormGroupState<TariffStepsFormValue>,
  stepId: string,
  cb: Function
) => {
  return updateGroup<TariffStepsFormValue>({
    steps: updateArrayWithFilter<TariffStepModel>(
      (s, idx) => s.value.id === stepId,
      (stepsForm) =>
        updateGroup<TariffStepModel>({
          ranges: cb()
        })(stepsForm))
  })(state);
};

const getStepIndexById = (
  steps: TariffStepModel[],
  id: string
): number => {
  return steps.findIndex(s => s.id === id);
};


export const getReducer = (formId) => {
  const initState = createFormGroupState<TariffStepsFormValue>(formId,
    {
      ...TariffStepsDefaultState
    });

  return combineReducers<State, any>({
    formState(state = initState, a: tariffStepActions.Action) {
      state = formStateReducer(state, a);
      switch (a.type) {
        case tariffStepActions.TARIFF_STEP_ADD_NEW_STEP: {
          const newModels = a.payload as TariffStepModel[];
          state = updateGroup<TariffStepsFormValue>({
            steps: (stepsForm) => {
              let result = stepsForm;

              for (const model of newModels) {
                result = addArrayControl(model)(result);
              }

              return result;
            }
          })(state);
          break;
        }

        case tariffStepActions.TARIFF_STEP_DELETE_STEP: {
          const stepIndex = getStepIndexById(state.controls.steps.value, a.payload);
          state = updateGroup<TariffStepsFormValue>({
            steps: (stepsForm) => removeArrayControl(stepIndex)(stepsForm)
          })(state);
          break;
        }

        case tariffStepActions.TARIFF_STEP_ADD_NEW_RANGE: {
          const stepId = a.payload;
          const stepIdx = state.value.steps.findIndex(s => s.id === stepId);
          const step = state.value.steps[stepIdx];
          const rangeLast = step.ranges[step.ranges.length - 1];
          const newRange = new TariffStepRangeModel(stepId);

          newRange.from = rangeLast.to;
          state = updateRange(
            state,
            stepId,
            () => (rangeForm) => addArrayControl(newRange)(rangeForm)
          );
          break;
        }

        case tariffStepActions.TARIFF_STEP_DELETE_RANGE: {
          const {stepId, rangeId} = a.payload;

          const step = state.value.steps.find(s => s.id === stepId);
          const ranges = step.ranges;
          const rangeIndex = ranges.findIndex(r => r.id === rangeId);

          state = updateRange(
            state,
            stepId,
            () => (rangeForm) => removeArrayControl(rangeIndex)(rangeForm)
          );
          break;
        }

        case tariffStepActions.TARIFF_STEP_SET_DATA_RANGE: {
          const {rangeData, stepId, rangeId} = a.payload;

          const step = state.value.steps.find(s => s.id === stepId);
          const ranges = step.ranges;
          const rangeIndex = ranges.findIndex(r => r.id === rangeId);

          state = updateRange(
            state,
            stepId,
            () => updateArrayWithFilter<TariffStepRangeModel>(
              (s, idx) => s.value.id === rangeId,
              (rangeForm) => setValue(rangeData)(rangeForm)
            )
          );

          // -------------------
          const prevRangeIndex = rangeIndex - 1;
          if ((ranges.length > 1 && rangeIndex < ranges.length - 1 && +rangeData['to'] !== +ranges[rangeIndex + 1]['from'])
            || (prevRangeIndex >= 0 && (+ranges[prevRangeIndex]['to'] !== +rangeData['from']))
            || (+rangeData['from'] > +rangeData['to'])
          ) {
            state = updateRange(
              state,
              stepId,
              () => updateArrayWithFilter<TariffStepRangeModel>(
                (s, idx) => s.value.id === rangeId,
                (rangeForm) => setErrors({missing: true})(rangeForm)
              )
            );
          } else {
            state = setErrors({})(state);
            state = updateRange(
              state,
              stepId,
              () => updateArray<TariffStepRangeModel>(
                (rangeForm) => setErrors({})(rangeForm)
              )
            );
          }
          break;
        }
      }

      return validateAndUpdateForm(state);
    }
  });
};

export const getFormState = (state: State) => state.formState;

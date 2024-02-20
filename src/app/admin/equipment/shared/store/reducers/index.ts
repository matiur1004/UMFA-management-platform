import * as fromRegistersForm from './registers-form.store';
import * as fromEditAttribute from './edit-attributes.store';
import {ActionReducer, combineReducers, createFeatureSelector, createSelector, MetaReducer} from '@ngrx/store';
import {EquipmentUnitViewModel, TimeOfUse} from '@models';

export interface State {
  registersForm: fromRegistersForm.State
  editAttributes: fromEditAttribute.State
}

export const reducers = combineReducers<State, any>({
  registersForm: fromRegistersForm.reducer,
  editAttributes: fromEditAttribute.reducer
});

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}

const timeOfUses = [
  {timeOfUse: TimeOfUse["None"], name: TimeOfUse[TimeOfUse['None']]},
  {timeOfUse: TimeOfUse["Peak"], name: TimeOfUse[TimeOfUse['Peak']]},
  {timeOfUse: TimeOfUse["Off Peak"], name: TimeOfUse[TimeOfUse['Off Peak']]},
  {timeOfUse: TimeOfUse["Standard"], name: TimeOfUse[TimeOfUse['Standard']]},
];

let unitList: EquipmentUnitViewModel[] = []

export const metaReducers: MetaReducer<State>[] = [logger];

const _getState = createFeatureSelector<State>('registers');
//const _getAttributeState = createFeatureSelector<State>('attributes');

export const getFormState = createSelector(
  _getState,
  state => state.registersForm
);

export const getAttributeFormState = createSelector(
  _getState,
  state => state.editAttributes
);

export const getAttributesFieldType = createSelector(
  getAttributeFormState,
  state => state.formState.value.fieldType
);


export const getEquipmentGroup = createSelector(
  getAttributeFormState,
  state => state.formState.value.equipmentGroups
);

export const getAllEquipmentUnits = createSelector(
  getAttributeFormState,
  () => unitList
);

export const getAttributeForm = createSelector(
  getAttributeFormState,
  fromEditAttribute.getFormState
);

export const getForm = createSelector(
  getFormState,
  fromRegistersForm.getFormState
);

export const getUnitList = createSelector(
  getAttributeFormState,
  state => state.options
);

export const getComboOptions = createSelector(
  getAttributeFormState,
  state => state.formState.value.comboSettings
);

export const getIsNew = createSelector(
  getFormState,
  formState => !formState.formState.value.id
);




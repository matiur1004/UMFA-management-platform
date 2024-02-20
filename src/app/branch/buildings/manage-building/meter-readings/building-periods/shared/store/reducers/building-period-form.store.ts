import {box, Boxed, createFormGroupState, formGroupReducer, FormGroupState, updateGroup, validate} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {required} from 'ngrx-forms/validation';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import * as buildingPeriodFormActions from '../actions/building-period-form.actions'
import {EditDialogModeEnum} from '../../models/edit-dialog-mode.enum';

export interface BuildingPeriodFormValue {
  id: string;
  name: string;
  startDate: string,
  endDate: string,
  clientStatementName: string,
  linkedBuildingPeriodIds: Boxed<string[]>
}

export const DEFAULT_STATE = {
  id: '',
  name: '',
  clientStatementName: '',
  linkedBuildingPeriodIds: box([]),
  startDate: null,
  endDate: null
}
export const FORM_ID: string = 'BuildiongPeriodForm';

export const InitState = createFormGroupState<BuildingPeriodFormValue>(FORM_ID, {...DEFAULT_STATE});

const validateAndUpdateGroup = updateGroup<BuildingPeriodFormValue>({
  name: validate(required),
  clientStatementName: validate(required)
});

export interface State {
  formState: FormGroupState<BuildingPeriodFormValue>;
  editMode: EditDialogModeEnum;
  modalRef: NgbModalRef;
}

const reducers = combineReducers<State, any>({
  formState(s = InitState, a: Action) {
    return validateAndUpdateGroup(formGroupReducer(s, a));
  },
  editMode(s: EditDialogModeEnum, a: buildingPeriodFormActions.Action) {
    switch (a.type) {
      case buildingPeriodFormActions.EDIT_BUILDING_PERIOD:
        return EditDialogModeEnum.Edit;

      case buildingPeriodFormActions.FINALIZE_BUILDING_PERIOD:
        return EditDialogModeEnum.Finalize;

      default:
        return s;
    }
  },
  modalRef(s: NgbModalRef, a: buildingPeriodFormActions.Action) {
    switch (a.type) {
      case buildingPeriodFormActions.EDIT_BUILDING_PERIOD:
      case buildingPeriodFormActions.FINALIZE_BUILDING_PERIOD:
        return a.payload;
      default:
        return s;
    }
  }
});


export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

export const getFormState = (state: State) => state.formState;
export const getEditMode = (state: State) => state.editMode;
export const getModalRef = (state: State) => state.modalRef;

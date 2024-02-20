import {SupplierViewModel} from '@models';
import * as fromActions from '../actions';
import {
  box,
  Boxed,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  reset,
  setValue,
  updateGroup,
  validate
} from 'ngrx-forms';
import {required} from 'ngrx-forms/validation';
import {Action, combineReducers} from '@ngrx/store';

export interface FormValue {
  ids: Boxed<string[]>;
}

export const initialFormState: FormValue = {
  ids: box([])
};

export const FORM_ID: string = 'add-new-supplier-branch';

export const InitialState = createFormGroupState<FormValue>(FORM_ID, {
  ...initialFormState
});

export interface State {
  formState: FormGroupState<FormValue>;
  entities: SupplierViewModel[];
  error: any;
  completed: boolean;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  ids: validate(required)
});


const reducers = combineReducers<State, any>({
  formState(state = InitialState, action: fromActions.Actions) {
    state = formGroupReducer(state, action);
    switch (action.type) {
      case fromActions.PURGE_ADD_NEW_SUPPLIER_BRANCH_STORE:
        state = setValue(state, initialFormState);
        state = reset(state);
        break;
    }
    return validateAndUpdateForm(state);
  },
  entities(state = null, action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.GET_SUPPLIERS_SUCCESS:
        return action.payload;
      default:
        return state;
    }
  },
  error(state = null, action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.GET_SUPPLIERS_FAILED:
        return action.payload;
      default:
        return state;
    }
  },
  completed(state = false, action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.PURGE_ADD_NEW_SUPPLIER_BRANCH_STORE:
        return false;
      case fromActions.ADD_NEW_SUPPLIER_BRANCH_SUCCESS:
        return true;
      default:
        return state;
    }
  },
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

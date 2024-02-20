import {
  box,
  Boxed,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  reset,
  setValue,
  unbox,
  updateGroup,
  validate
} from 'ngrx-forms';
import {required} from 'ngrx-forms/validation';
import {Action, combineReducers} from '@ngrx/store';

import {AddBuildingTariffViewModel, BranchTariffsOrderList, CategoryViewModel, SupplierViewModel} from '@models';
import * as fromActions from '../actions';

export interface FormValue {
  tariffs: Boxed<string[]>;
}

export const initialFormState: FormValue = {
  tariffs: box([])
};

export const FORM_ID: string = 'add-new-building-tariff';

export const InitialState = createFormGroupState<FormValue>(FORM_ID, {
  ...initialFormState
});

export interface State {
  formState: FormGroupState<FormValue>;
  suppliers: SupplierViewModel[];
  categories: CategoryViewModel[];
  error: any;
  completed: boolean;
  branchTariffs: AddBuildingTariffViewModel[];
  branchTariffsFiltered: AddBuildingTariffViewModel[];
  tariffOrder: number;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  tariffs: validate(required)
});


const reducers = combineReducers<State, any>({
  formState(state = InitialState, action: fromActions.Actions) {
    state = formGroupReducer(state, action);
    switch (action.type) {
      case fromActions.PURGE_ALLOCATED_BUILDING_TARIFFS_STORE:
        state = setValue(state, initialFormState);
        state = reset(state);
        break;

      case fromActions.SELECT_BUILDING_TARIFF:
        const selectedId = action.payload;
        const tariffArr = unbox(state.value.tariffs);
        const tariffIndex = tariffArr.findIndex(tariff => tariff === selectedId);
        const newArr = (tariffIndex >= 0)
          ? tariffArr.filter(tariff => tariff !== selectedId)
          : [...tariffArr, selectedId];
        state = setValue(state, {...state.value, tariffs: box(newArr)});
        break;

      case fromActions.GET_BRANCH_TARIFFS_SUCCESS:
        const selectedTariffsArr = action.payload.filter(tariff => tariff.isSelected).map(item => item.entity.id);
        state = setValue(state, {...state.value, tariffs: box(selectedTariffsArr)});
        break;
    }
    return validateAndUpdateForm(state);
  },
  suppliers(state = null, action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.GET_BRANCH_SUPPLIERS_SUCCESS:
        return action.payload;
      default:
        return state;
    }
  },
  categories(state = null, action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.GET_BRANCHES_ALL_CATEGORIES_SUCCESS:
        return action.payload;
      default:
        return state;
    }
  },
  error(state = null, action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.GET_BRANCH_SUPPLIERS_FAILED:
        return action.payload;
      default:
        return state;
    }
  },
  completed(state = false, action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.PURGE_ADD_NEW_TARIFF_BUILDING:
        return false;
      case fromActions.ADD_NEW_TARIFF_BUILDING_SUCCESS:
        return true;
      default:
        return state;
    }
  },
  branchTariffs(state = [], action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.PURGE_ADD_NEW_TARIFF_BUILDING:
        return null;
      case fromActions.GET_BRANCH_TARIFFS_SUCCESS:
        return action.payload;

      case fromActions.SELECT_BUILDING_TARIFF:
        const selectedId = action.payload;
        const tariffIndex = state.findIndex(tariff => tariff.entity.id === selectedId);
        const newState = [...state];
        newState[tariffIndex].isSelected = !newState[tariffIndex].isSelected;

        return [...newState];

      default:
        return state;
    }
  },
  branchTariffsFiltered(state = [], action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.GET_BRANCH_TARIFFS_SUCCESS:
        return action.payload;

      case fromActions.UPDATE_BRANCH_TARIFFS:
        return action.payload;

      case fromActions.PURGE_ADD_NEW_TARIFF_BUILDING:
        return null;

      default:
        return state;
    }
  },
  tariffOrder(state = BranchTariffsOrderList.NameAsc, action: fromActions.Actions) {
    switch (action.type) {
      case fromActions.SET_BRANCH_TARIFFS_ORDER:
        return action.payload;
      default:
        return state;
    }
  }
});

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

import {
  box,
  Boxed,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  setValue,
  unbox,
  updateArray,
  updateArrayWithFilter,
  updateGroup,
  validate,
  ValidationFn
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {maxLength, minLength, required} from 'ngrx-forms/validation';

import * as tariffFormActions from '../actions/tariff-form.actions';

import {
  BasedOnAttributesLineItemViewModel,
  BasedOnCalculationsLineItemViewModel,
  BasedOnReadingsAndSettingsLineItemViewModel,
  BasedOnReadingsLineItemViewModel,
  FixedPriceLineItemViewModel,
  TariffCategoryViewModel,
  TariffLineItemChargingType
} from '@models';
import {StringExtension} from '@shared-helpers';
import {LineItemsSequenceHandler} from '../../helpers/line-items-sequence.helper';


export interface FormValue {
  id: string;
  supplierId: string;
  versionId: string;
  name: string;
  code: string;
  supplyType: number;
  versionDate: Date;
  majorVersion: number;
  minorVersion: number;
  version: string;
  disableAfter: Date;
  disableForNewCustomers: boolean;

  buildingCategoriesIds: Boxed<string[]>;

  seasonalChangesEnabled: boolean;
  touChangesEnabled: boolean;
  createdOn: Date;
  createdBy: string;

  canEditSupplyType: boolean;

  basedOnReadingsLineItems: BasedOnReadingsLineItemViewModel[];
  basedOnReadingsAndSettingsLineItems: BasedOnReadingsAndSettingsLineItemViewModel[];
  basedOnAttributesLineItems: BasedOnAttributesLineItemViewModel[];
  basedOnCalculationsLineItems: BasedOnCalculationsLineItemViewModel[];
  fixedPriceLineItems: FixedPriceLineItemViewModel[];
  tariffCategories: Boxed<TariffCategoryViewModel[]>;
}

export const INIT_DEFAULT_STATE = {
  id: '',
  supplierId: '',
  versionId: '',
  name: '',
  code: '',
  supplyType: 0,
  versionDate: null,
  majorVersion: 1,
  minorVersion: 0,
  version: '1.0',
  disableAfter: null,
  disableForNewCustomers: false,

  buildingCategoriesIds: box([]),

  seasonalChangesEnabled: false,
  touChangesEnabled: false,
  createdOn: null,
  createdBy: '',

  canEditSupplyType: false,

  basedOnReadingsLineItems: [],
  basedOnReadingsAndSettingsLineItems: [],
  basedOnAttributesLineItems: [],
  basedOnCalculationsLineItems: [],
  fixedPriceLineItems: [],

  tariffCategories: box([])
};

export const FORM_ID = 'tariff';

export const InitState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
}

const requireCostProvider: ValidationFn<string> = (item: string) => {
  return item === '' ? {'required': {actual: item}} : {};
};


const validateAndUpdateForm = updateGroup<FormValue>({
  name: validate(required, maxLength(150)),
  code: validate(maxLength(150)),
  buildingCategoriesIds: validate(required, minLength(1)),
  basedOnAttributesLineItems: updateArray<BasedOnAttributesLineItemViewModel>(
    updateGroup<BasedOnAttributesLineItemViewModel>({
      name: validate(required, maxLength(150)),
      chargingMethod: validate(required, maxLength(150)),
      attributeId: validate(required)
    })
  ),
  basedOnReadingsLineItems: updateArray<BasedOnReadingsLineItemViewModel>(
    updateGroup<BasedOnReadingsLineItemViewModel>({
      name: validate(required, maxLength(150)),
      chargingMethod: validate(required, maxLength(150)),
      unitOfMeasurement: validate(required),
      costProviderId: validate(requireCostProvider)
    })
  ),
  basedOnCalculationsLineItems: updateArray<BasedOnCalculationsLineItemViewModel>(
    updateGroup<BasedOnCalculationsLineItemViewModel>({
      name: validate(required, maxLength(150)),
      chargingMethod: validate(required, maxLength(150)),
      dependentLineItemIds: validate(required)
    })
  ),
  basedOnReadingsAndSettingsLineItems: updateArray<BasedOnReadingsAndSettingsLineItemViewModel>(
    updateGroup<BasedOnReadingsAndSettingsLineItemViewModel>({
      name: validate(required, maxLength(150)),
      chargingMethod: validate(required, maxLength(150))
    })
  ),
  fixedPriceLineItems: updateArray<FixedPriceLineItemViewModel>(
    updateGroup<FixedPriceLineItemViewModel>({
      name: validate(required, maxLength(150)),
      chargingMethod: validate(required, maxLength(150))
    })
  )
});
export const getReducer = (formId) => {
  const belongsToForm = (a) => a['formId'] === formId;
  const initialState = createFormGroupState<FormValue>(formId, {
    ...INIT_DEFAULT_STATE
  });

  return combineReducers<State, any>({
    formState(state = initialState, action: tariffFormActions.Action) {
      state = formGroupReducer(state, action);
      if (belongsToForm(action)) {
        switch (action.type) {
          case tariffFormActions.TOGGLE_BUILDING_CATEGORY: {
            state = updateGroup<FormValue>({
              buildingCategoriesIds: (c) => {
                const categories = [...unbox(c.value)];
                const cat = action.payload.categoryId;
                const ind = categories.findIndex(c => c === cat);
                if (ind >= 0) {
                  categories.splice(ind, 1);
                } else {
                  categories.push(cat);
                }
                return setValue(c, box(categories));
              }
            })(state);
            break;
          }
          case tariffFormActions.UPDATE_SUPPLY_TYPE_FOR_EDIT: {
            state = updateGroup<FormValue>({
              supplyType: (s) => setValue(s, +action.payload)
            })(state);
            break;
          }
          case tariffFormActions.DELETE_LINE_ITEM: {
            const s = {...state.value};
            deleteLineItem(action.payload.chargingType, action.payload.id, s);
            state = setValue(state, s);
            break;
          }
          case tariffFormActions.UPDATE_LINE_ITEM_CHARGING_TYPE: {
            const s = {...state.value};
            deleteLineItem(action.payload.previousChargingType, action.payload.id, s);

            const lineItem = {
              id: action.payload.id,
              name: action.payload.name,
              controlPosition: action.payload.position,
              chargingType: action.payload.newChargingType
            };
            addLineItem(lineItem, s);

            state = setValue(state, s);
            break;
          }
          case tariffFormActions.CREATE_LINE_ITEM: {
            const s = {...state.value};
            const lineItemFormValue = {...action.payload, id: StringExtension.NewGuid()};
            addLineItem(lineItemFormValue, s);
            state = setValue(state, s);
            break;
          }
          case tariffFormActions.UPDATE_DEPENDENT_LINE_ITEMS: {
            state = updateGroup<FormValue>({
              basedOnCalculationsLineItems: updateArrayWithFilter(
                (c, idx) => c.id === action.payload.lineItemControlId,
                (lineItem) => updateGroup<BasedOnCalculationsLineItemViewModel>({
                  dependentLineItemIds: (i) => setValue<Boxed<string[]>>(i, action.payload.dependentLineItemIds as any)
                })(lineItem)
              )
            })(state);
            break;
          }
          case tariffFormActions.UPDATE_ATTRIBUTE: {
            state = updateGroup<FormValue>({
              basedOnAttributesLineItems: updateArrayWithFilter(
                (s, idx) => s.id === action.payload.lineItemControlId,
                (lineItem) => updateGroup<BasedOnAttributesLineItemViewModel>({
                  attributeId: (c) => setValue<string>(c, action.payload.attributeId)
                })(lineItem)
              )
            })(state);
            break;
          }
          case tariffFormActions.UPDATE_UNIT_OF_MEASUREMENT: {

            state = updateGroup<FormValue>({
              basedOnReadingsLineItems: updateArrayWithFilter(
                (s, idx) => s.id === action.payload.lineItemControlId,
                (lineItem) => updateGroup<BasedOnReadingsLineItemViewModel>({
                  unitOfMeasurement: (c) => setValue<number>(c, action.payload.unitOfMeasurement)
                })(lineItem)
              )
            })(state);
            break;
          }
          case tariffFormActions.RESET_COST_PROVIDE_ID: {
            state = updateGroup<FormValue>({
              basedOnReadingsLineItems: updateArrayWithFilter(
                (s, idx) => s.id === action.payload.lineItemControlId,
                (lineItem) => updateGroup<BasedOnReadingsLineItemViewModel>({
                  costProviderId: (c) => setValue<string>(c, action.payload.value)
                })(lineItem)
              )
            })(state);
            break;
          }
          case tariffFormActions.UPDATE_DISABLE_AFTER: {
            state = updateGroup<FormValue>({
              disableAfter: (s) => setValue<Date>(s, action.payload)
            })(state);
            break;
          }

          default:
            break;
        }
      }
      return validateAndUpdateForm(state);
    }
  });
};

function deleteLineItem(chargingType, lineItemId, state) {
  switch (chargingType) {
    case TariffLineItemChargingType.BasedOnReadings:
      state.basedOnReadingsLineItems = state.basedOnReadingsLineItems.filter(l => l.id !== lineItemId);
      break;
    case TariffLineItemChargingType.BasedOnAttributes:
      state.basedOnAttributesLineItems = state.basedOnAttributesLineItems.filter(l => l.id !== lineItemId);
      break;
    case TariffLineItemChargingType.BasedOnReadingsAndSettings:
      state.basedOnReadingsAndSettingsLineItems = state.basedOnReadingsAndSettingsLineItems.filter(l => l.id !== lineItemId);
      break;
    case TariffLineItemChargingType.FixedPrice:
      state.fixedPriceLineItems = state.fixedPriceLineItems.filter(l => l.id !== lineItemId);
      break;
    case TariffLineItemChargingType.BasedOnCalculations:
      state.basedOnCalculationsLineItems = state.basedOnCalculationsLineItems.filter(l => l.id !== lineItemId);
      break;
  }
  if (chargingType !== TariffLineItemChargingType.BasedOnCalculations && state.basedOnCalculationsLineItems.length) {
    const array = [...state.basedOnCalculationsLineItems];

    state.basedOnCalculationsLineItems = array.map((lineItem: any) => {
      if (lineItem.dependentLineItemIds.find(d => d === lineItemId))
        return {...lineItem, dependentLineItemIds: lineItem.dependentLineItemIds.filter(d => d !== lineItemId)};
      return lineItem;
    });
  }
}

const reducers = getReducer(FORM_ID);

export function reducer(s: State, a: Action) {
  return reducers(s, a);
}

function addLineItem(lineItemFormValue, formValue) {
  switch (lineItemFormValue.chargingType) {
    case TariffLineItemChargingType.BasedOnReadings:

      const readingsLineItem = Object.assign(new BasedOnReadingsLineItemViewModel(), {
        unitOfMeasurement: null,
        hasSeasonalChanges: false,
        hasTou: false,
        hasDuplicationFactor: false,
        costProviderId: null
      }, lineItemFormValue, {stepSchema: ''});

      formValue.basedOnReadingsLineItems = [...formValue.basedOnReadingsLineItems, readingsLineItem];
      break;
    case TariffLineItemChargingType.BasedOnReadingsAndSettings:

      const readingsAndSettingsLineItem = Object.assign(new BasedOnReadingsAndSettingsLineItemViewModel(), {
        basicPeriod: 0,
        hasSeasonalChanges: false
      }, lineItemFormValue);

      formValue.basedOnReadingsAndSettingsLineItems = [...formValue.basedOnReadingsAndSettingsLineItems, readingsAndSettingsLineItem];
      break;
    case TariffLineItemChargingType.BasedOnAttributes:

      const attributesLineItem = Object.assign(new BasedOnAttributesLineItemViewModel(), {
        basicPeriod: 0,
        attributeId: null,
        hasSeasonalChanges: false
      }, lineItemFormValue);

      formValue.basedOnAttributesLineItems = [...formValue.basedOnAttributesLineItems, attributesLineItem];
      break;
    case TariffLineItemChargingType.FixedPrice:

      const fixedPriceLineItem = Object.assign(new FixedPriceLineItemViewModel(), {
        basicPeriod: 0,
        hasSeasonalChanges: false,
        hasDuplicationFactor: false
      }, lineItemFormValue);

      formValue.fixedPriceLineItems = [...formValue.fixedPriceLineItems, fixedPriceLineItem];
      break;
    case TariffLineItemChargingType.BasedOnCalculations:

      const calculationsLineItem = Object.assign(new BasedOnCalculationsLineItemViewModel(), {
        dependentLineItemIds: []
      }, lineItemFormValue);

      formValue.basedOnCalculationsLineItems = [...formValue.basedOnCalculationsLineItems, calculationsLineItem];
      break;
  }
  updateLineItemsPosition(formValue);
}

function updateLineItemsPosition(formState: FormValue) {
  const handler = new LineItemsSequenceHandler();
  handler.MergeCollection(formState.basedOnReadingsLineItems)
    .MergeCollection(formState.basedOnReadingsAndSettingsLineItems)
    .MergeCollection(formState.basedOnAttributesLineItems)
    .MergeCollection(formState.basedOnCalculationsLineItems)
    .MergeCollection(formState.fixedPriceLineItems)
    .updatePositions();
}

import {
  addArrayControl,
  createFormGroupState,
  formGroupReducer,
  FormGroupState,
  removeArrayControl,
  setValue,
  updateArray,
  updateArrayWithFilter,
  updateGroup,
  validate
} from 'ngrx-forms';
import {Action, combineReducers} from '@ngrx/store';
import {greaterThanOrEqualTo, lessThanOrEqualTo, notEqualTo, required} from 'ngrx-forms/validation';
import {MeterRegisterViewModel, RegisterRemovedStatus, RegisterStatusType, SelectedStatusFilter} from '../../models';
import * as nodeFormActions from '../actions/node-form.actions';
import * as nodeActions from '../actions/node.actions';
import {TimeOfUse, TotalRegister, UnitOfMeasurementType} from '@models';

export interface FormValue {
  meterAllocation: AllocatedNodeFormValue;
  nodes: AllocatedNodeFormValue[];
}

export interface AllocatedNodeFormValue {
  id: string;
  selected: boolean;
  calculationFactor: number;
  registers: RegisterFormValue[];
}

export interface RegisterFormValue {
  registerId: string;
  calculationFactor: number;
  timeOfUse: TimeOfUse;
  unitOfMeasurement: UnitOfMeasurementType;
  isRemoved: boolean;
  isBilling: boolean;
}

export const INIT_DEFAULT_STATE = {
  meterAllocation: <AllocatedNodeFormValue>{
    id: '',
    calculationFactor: 1,
    registers: [],
    selected: false
  },
  nodes: []
};

export const FORM_ID = 'buildingNodeFormAllocatedEquipment';

export const InitMeterState = createFormGroupState<FormValue>(FORM_ID, {
  ...INIT_DEFAULT_STATE
});

export interface State {
  formState: FormGroupState<FormValue>;
  order: number;
  registerFilter: TotalRegister[];
  meterRegisterFilter: MeterRegisterViewModel;
  searchKey: string;
  searchMeterKey: string;
  orderMeter: number;
  statusFilter: SelectedStatusFilter;
}

const validateAndUpdateForm = updateGroup<FormValue>({
  nodes: updateArray(updateGroup<AllocatedNodeFormValue>({
    calculationFactor: validate(required, greaterThanOrEqualTo(-1000), notEqualTo(0), lessThanOrEqualTo(1000)),
    registers: updateArray(updateGroup<RegisterFormValue>({
      calculationFactor: validate(required, greaterThanOrEqualTo(-1000), notEqualTo(0), lessThanOrEqualTo(1000)),
    }))
  }))

});

const reducers = combineReducers<State, any>({
  formState(s = InitMeterState, a: nodeFormActions.Action | nodeActions.Action) {
    s = formGroupReducer(s, a);

    switch (a.type) {
      case nodeFormActions.SELECT_ALL_NODES: {
        s = updateGroup({
          meterAllocation: updateGroup<AllocatedNodeFormValue>({
            selected: setValue<boolean>(a.payload.selected)
          }),
          nodes: updateArray<AllocatedNodeFormValue>(
            n => updateGroup<AllocatedNodeFormValue>({
              selected: setValue<boolean>(a.payload.selected && a.payload.nodeIds.some(id => n.value.id === id))
            })(n))
        })(s);
        break;
      }

      case nodeFormActions.TOGGLE_NODE_SELECTED: {
        s = updateGroup({
          meterAllocation: updateGroup<AllocatedNodeFormValue>({
            selected: setValue<boolean>(a.payload.selected)
          }),
          nodes: updateArrayWithFilter<AllocatedNodeFormValue>(n => n.value.id === a.payload.id,
            updateGroup<AllocatedNodeFormValue>({
              selected: setValue<boolean>(a.payload.selected)
            }))
        })(s);
        break;
      }

      case nodeActions.TOGGLE_NODE_ALLOCATION: {
        const node = a.payload.node;
        const nodeIndex = s.value.nodes.findIndex(n => n.id === node.nodeId);

        if (a.payload.allocated) {
          if (nodeIndex === -1) {
            s = updateGroup<FormValue>({
              nodes: addArrayControl<AllocatedNodeFormValue>({
                id: node.nodeId,
                calculationFactor: node['calculationFactor'] || 1,
                selected: false,
                registers: node.registers.map(r =>
                  (<RegisterFormValue>{
                    registerId: r.registerId,
                    calculationFactor: 1,
                    isRemoved: false
                  }))
              })
            })(s);
          }
        } else {
          if (nodeIndex !== -1) {
            s = updateGroup<FormValue>({
              nodes: removeArrayControl(nodeIndex)
            })(s);
          }
        }
        break;
      }

      case nodeFormActions.SET_CALCULATION_FACTOR: {
        s = updateGroup({
          meterAllocation: updateGroup<AllocatedNodeFormValue>({
            calculationFactor: setValue<number>(a.payload.calculationFactor),
            registers: updateArray<RegisterFormValue>(updateGroup<RegisterFormValue>({
              calculationFactor: setValue<number>(a.payload.calculationFactor)
            }))
          }),
          nodes: updateArrayWithFilter<AllocatedNodeFormValue>(
            n => a.payload.nodes.some(id => n.value.id === id),
            updateGroup<AllocatedNodeFormValue>({
              calculationFactor: setValue<number>(a.payload.calculationFactor),
              registers: updateArray<RegisterFormValue>(updateGroup<RegisterFormValue>({
                calculationFactor: setValue<number>(a.payload.calculationFactor)
              }))
            }))
        })(s);
        break;
      }
      case nodeFormActions.REMOVE_NODE: {
        const ind = s.value.nodes.findIndex(n => n.id === a.payload);
        if (ind >= 0) {
          s = updateGroup<FormValue>({
            nodes: removeArrayControl(ind)
          })(s);
        }
        break;
      }
      case nodeFormActions.REMOVE_SELECTED_NODES: {
        s = updateGroup({
          meterAllocation: setValue(s.value.meterAllocation),
          nodes: setValue(s.value.nodes.filter(n => !n.selected))
        })(s);
        break;
      }
      case nodeFormActions.REMOVE_NODE_REGISTERS: {
        a.payload.forEach(p => {
          p.registerIds.forEach(rId => {
            s = updateGroup({
              meterAllocation: updateGroup<AllocatedNodeFormValue>({
                registers: updateArrayWithFilter<RegisterFormValue>(
                  r => r.value.registerId === rId,
                  updateGroup<RegisterFormValue>({
                    isRemoved: setValue<boolean>(true)
                  })
                )
              }),
              nodes: updateArrayWithFilter<AllocatedNodeFormValue>(
                n => n.value.id === p.nodeId,
                updateGroup<AllocatedNodeFormValue>({
                  registers: updateArrayWithFilter<RegisterFormValue>(
                    r => r.value.registerId === rId,
                    updateGroup<RegisterFormValue>({
                      isRemoved: setValue<boolean>(true)
                    })
                  )
                })
              )
            })(s);
          });
        });
        break;
      }
      case nodeFormActions.ADD_NODE_REGISTERS: {
        a.payload.forEach(p => {
          p.registerIds.forEach(rId => {
            s = updateGroup({
              meterAllocation: updateGroup<AllocatedNodeFormValue>({
                registers: updateArrayWithFilter<RegisterFormValue>(
                  r => r.value.registerId === rId,
                  updateGroup<RegisterFormValue>({
                    isRemoved: setValue<boolean>(false)
                  })
                )
              }),
              nodes: updateArrayWithFilter<AllocatedNodeFormValue>(
                n => n.value.id === p.nodeId,
                updateGroup<AllocatedNodeFormValue>({
                  registers: updateArrayWithFilter<RegisterFormValue>(
                    r => r.value.registerId === rId,
                    updateGroup<RegisterFormValue>({
                      isRemoved: setValue<boolean>(false)
                    })
                  )
                })
              )
            })(s);
          });
        });
        break;
      }
      case nodeFormActions.SET_NODE_REGISTERS_CALCULATION_FACTOR: {
        a.payload.register.registerIds.forEach(rId => {
          s = updateGroup({
            meterAllocation: updateGroup<AllocatedNodeFormValue>({
              registers: updateArrayWithFilter<RegisterFormValue>(
                r => r.value.registerId === rId,
                updateGroup<RegisterFormValue>({
                  calculationFactor: setValue<number>(a.payload.factorValue)
                })
              )
            }),
            nodes: updateArrayWithFilter<AllocatedNodeFormValue>(
              n => n.value.id === a.payload.register.nodeId,
              updateGroup<AllocatedNodeFormValue>({
                registers: updateArrayWithFilter<RegisterFormValue>(
                  r => r.value.registerId === rId,
                  updateGroup<RegisterFormValue>({
                    calculationFactor: setValue<number>(a.payload.factorValue)
                  })
                )
              })
            )
          })(s);
        });
        break;
      }
    }

    return validateAndUpdateForm(s);
  },
  order(s: number = 1, a: nodeFormActions.Action) {
    switch (a.type) {
      case nodeFormActions.UPDATE_ORDER:
        return a.payload;

      default:
        return s;
    }
  },
  searchKey(s: string, a: nodeFormActions.Action) {
    switch (a.type) {
      case nodeFormActions.UPDATE_SEARCH_KEY:
        return a.payload;

      default:
        return s;
    }
  },
  registerFilter(s: TotalRegister[] = [], a: nodeFormActions.Action) {
    switch (a.type) {
      case nodeFormActions.UPDATE_REGISTER_FILTER:
        return a.payload;
      default:
        return s;
    }
  },
  searchMeterKey(s: string, a: nodeFormActions.Action) {
    switch (a.type) {
      case nodeFormActions.UPDATE_METER_SEARCH_KEY:
        return a.payload;
      default:
        return s;
    }
  },
  meterRegisterFilter(s: MeterRegisterViewModel = null, a: nodeFormActions.Action) {
    switch (a.type) {
      case nodeFormActions.UPDATE_METER_REGISTER_FILTER:
        return a.payload;
      default:
        return s;
    }
  },
  orderMeter(s: number = 1, a: nodeFormActions.Action) {
    switch (a.type) {
      case nodeFormActions.UPDATE_METER_ORDER:
        return a.payload;
      default:
        return s;
    }
  },
  statusFilter(
    s: SelectedStatusFilter = {isBilling: RegisterStatusType.Billing, isRemoved: RegisterRemovedStatus.NotRemoved},
    a: nodeFormActions.Action) {
    switch (a.type) {
      case nodeFormActions.UPDATE_STATUS_FILTER:
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
export const getOrder = (state: State) => state.order;
export const getRegisterFilter = (state: State) => state.registerFilter;
export const getAddEquipmentRegisterFilter = (state: State) => state.meterRegisterFilter;
export const getMeterOrder = (state: State) => state.orderMeter;
export const getSearchKey = (state: State) => state.searchKey;
export const getAddEquipmentSearchKey = (state: State) => state.searchMeterKey;
export const getStatusFilter = (state: State) => state.statusFilter;

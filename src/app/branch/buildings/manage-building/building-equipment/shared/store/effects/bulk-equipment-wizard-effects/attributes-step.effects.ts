import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {select, Store} from '@ngrx/store';
import {map, withLatestFrom} from 'rxjs/operators';

import * as fromEquipment from '../../reducers';
import * as attributesStepSelectors
  from '../../reducers/bulk-equipment-wizard-reducers/selectors/attributes-step.selectors';

import * as attributesStepStore from '../../reducers/bulk-equipment-wizard-reducers/attributes-step.store';
import * as attributesStepActions from '../../actions/bulk-equipment-wizard-actions/attributes-step.actions';

import {SetValueAction} from 'ngrx-forms';
import {FieldType} from '@models';

@Injectable()
export class AttributesStepEffects {

  // Apply bulk value
  applyBulkValue = createEffect(() => this.actions$.pipe(
    ofType(attributesStepActions.APPLY_BULK_VALUE),
    withLatestFrom(this.store$.pipe(select(attributesStepSelectors.getFormState)),
      (action: any, form) => {
        return {
          bulkAction: action.payload.bulkAction,
          bulkValue: action.payload.bulkValue,
          form: form,
        };
      }),
    map(({bulkAction, bulkValue, form}) => {
      const equipmentGroupId = bulkAction.equipmentGroup.equipmentGroupId;
      const equipmentGroups = [...form.value.equipmentGroupMeters];
      const index = equipmentGroups.findIndex(g => g.equipmentGroupId === equipmentGroupId);
      const equipmentGroupMeters = {
        ...equipmentGroups[index], meters: equipmentGroups[index].meters.map(m => {
          if (m.isSelected && m.attributes[bulkAction.id]) {
            return {
              ...m,
              attributes: {
                ...m.attributes,
                [bulkAction.id]: m.attributes[bulkAction.id].attribute.fieldType === FieldType.Number ? {
                  ...m.attributes[bulkAction.id],
                  numberValue: bulkValue[equipmentGroupId]
                } : {
                  ...m.attributes[bulkAction.id],
                  value: bulkValue[equipmentGroupId]
                }
              }
            };
          } else {
            return m;
          }
        })
      };

      equipmentGroups.splice(index, 1, equipmentGroupMeters);
      const formValue = {...form.value, equipmentGroupMeters: equipmentGroups};

      return new SetValueAction(attributesStepStore.FORM_ID, formValue);
    })
  ));

  constructor(
    private actions$: Actions,
    private store$: Store<fromEquipment.State>,
  ) {
  }
}

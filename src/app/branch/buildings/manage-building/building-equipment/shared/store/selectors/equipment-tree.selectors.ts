import {createSelector} from '@ngrx/store';
import {getEquipmentTreeState} from '../reducers';
import {EquipmentTreeModel} from '@models';
import {collectLocations, getAllEquipmentsFromTree} from '../utilities/equipment-tree.utilities';


export const selectEquipmentTree = createSelector(getEquipmentTreeState, (state) => state.tree);

export const selectEquipmentList = createSelector(
  selectEquipmentTree,
  (list: EquipmentTreeModel[]) => {
    if (list) {
      return getAllEquipmentsFromTree(list);
    }
  }
);

export const selectEquipmentsLocations = createSelector(
  selectEquipmentList,
  collectLocations
);

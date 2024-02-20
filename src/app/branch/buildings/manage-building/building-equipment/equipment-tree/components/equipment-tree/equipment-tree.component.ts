import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import {EquipmentTreeModel} from '@models';

import * as fromEquipment from '../../../shared/store/reducers';
import * as fromActions from '../../../shared/store/actions/equipment-tree.actions';
import * as fromSelectors from '../../../shared/store/selectors';
import * as commonData from '../../../../shared/store/selectors/common-data.selectors';

import {collectNodes} from '../../../shared/store/utilities/equipment-tree.utilities';

@Component({
  selector: 'equipment-tree',
  templateUrl: './equipment-tree.component.html',
  styleUrls: ['./equipment-tree.component.less']
})
export class EquipmentTreeComponent implements OnInit, OnDestroy {

  equipment$: Observable<EquipmentTreeModel[]>;
  locationList$: Observable<any>;
  nodeList$: Observable<any>;

  versionSelector$: Subscription;

  public selectedLocation = '';
  public selectedNode = '';

  constructor(
    private store: Store<fromEquipment.State>
  ) {
  }

  ngOnInit() {
    this.versionSelector$ = this.store.pipe(select(commonData.getSelectedVersionId)).subscribe(id => {
      this.loadData();
    });
  }

  ngOnDestroy() {
    this.versionSelector$.unsubscribe();
  }

  loadData() {
    this.store.dispatch(new fromActions.GetEquipmentTree());
    this.equipment$ = this.store.pipe(select(fromSelectors.selectEquipmentList));
    this.locationList$ = this.store.pipe(select(fromSelectors.selectEquipmentsLocations));
    this.onLoadNodesList();
  }

  onLoadNodesList() {
    this.nodeList$ = this.store.pipe(
      select(fromSelectors.selectEquipmentList),
      map(equipmentList => {
        let res = [];
        if (this.selectedLocation) {
          res = equipmentList.filter(el => el.location.locationId === this.selectedLocation);
        } else {
          res = equipmentList;
        }
        return collectNodes(res);
      }));
    this.selectedNode = '';
  }

}

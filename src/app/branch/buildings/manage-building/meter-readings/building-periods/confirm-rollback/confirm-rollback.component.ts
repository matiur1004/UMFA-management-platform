import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BuildingPeriodViewModel} from '../../../shared/models/building-period.model';
import * as fromBuildingPeriods from '../../billing-readings/shared/store/reducers';
import * as buildingPeriodsAction from '../shared/store/actions/building-periods.actions';

@Component({
  selector: 'confirm-rollback',
  templateUrl: './confirm-rollback.component.html',
  styleUrls: ['./confirm-rollback.component.less']
})
export class ConfirmRollbackComponent implements OnInit {

  buildingPeriod$: Observable<BuildingPeriodViewModel>;
  previousBuildingPeriod$: Observable<BuildingPeriodViewModel>;

  constructor(private activeModal: NgbActiveModal,
              private store: Store<fromBuildingPeriods.State>,
  ) {
    this.buildingPeriod$ = store.select(fromBuildingPeriods.getLatestBuildingPeriod);
    this.previousBuildingPeriod$ = store.select(fromBuildingPeriods.getPreviousBuildingPeriod);
  }

  ngOnInit() {
  }

  onCancel() {
    this.activeModal.dismiss();
  }

  onConfirm(id: string) {
    this.store.dispatch(new buildingPeriodsAction.RollbackBuildingPeriod(id));
    this.activeModal.close();
  }

}

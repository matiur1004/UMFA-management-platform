import {Component, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';

import * as fromStore from '../../../shared/store';
import * as buildingFloorsAction from '../../../shared/store/actions/floor-plans.actions';

@Component({
  selector: 'view-floor-plans',
  templateUrl: './view-floor-plans.component.html',
  styleUrls: ['./view-floor-plans.component.less'],
})
export class ViewFloorPlansComponent implements OnInit {

  public shops$: Observable<any[]>;
  public plan$: Observable<any>;
  public floors$: Observable<any[]>;
  public activeFloor$: Observable<any>;

  params$: Subscription;

  constructor(
    private readonly store: Store<fromStore.State>,
    private readonly modalService: NgbModal) {
  }

  onChangeFloor(id: string) {
    this.store.dispatch(new fromStore.SetActivePlanFloor(id));
  }

  onSavePlan(plan: string) {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new fromStore.SaveFloorPlan({
        comment: comment,
        date: date,
        actionType: actionType,
        floorPlan: plan
      }));
    }, () => {
    });
  }

  onResetPlan() {
    this.store.dispatch(new buildingFloorsAction.ResetFloorPlan());
  }

  onLastLoad() {
    this.store.dispatch(new buildingFloorsAction.GetBuildingFloors());
  }

  ngOnInit() {
    this.store.dispatch(new buildingFloorsAction.SetActivePlanFloor(null));
    this.store.dispatch(new buildingFloorsAction.GetBuildingShops());

    this.floors$ = this.store.pipe(select(fromStore.selectFloorPlansFloors));
    this.activeFloor$ = this.store.pipe(select(fromStore.selectFloorPlansActiveFloor));
    this.shops$ = this.store.pipe(select(fromStore.selectFloorPlansFloorShops));
    this.plan$ = this.store.pipe(select(fromStore.selectFloorPlansPlan));
  }
}

import {ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {NgbDropdown, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

import {LocationViewModel} from '@models';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';

import {AddLocationComponent} from './add-location/add-location.component';

import * as fromLocation from '../../shared/store/reducers';
import * as locationAction from '../../shared/store/actions/location.actions';
import * as locationFormAction from '../../shared/store/actions/location-form.actions';
import * as commonStore from '../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.less']
})
export class LocationsListComponent implements OnInit, OnDestroy {
  @ViewChildren('locationItemDropdown') ngbDropdownList: QueryList<NgbDropdown>;
  locationList$: Observable<LocationViewModel[]>;
  branchId: string;
  version: string;
  buildingId: string;
  orderIndex: number = 1;
  buildingPeriodIsFinalized: boolean;

  private subscriber$: Subscription;

  constructor(
    private modalService: NgbModal,
    private store: Store<fromLocation.State>,
    private router: Router,
    private route: ActivatedRoute,
    private chRef: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.store.dispatch(new locationAction.ResetForm());
    this.locationList$ = this.store.select(fromLocation.getLocations);
    this.subscriber$ = combineLatest(
      this.route.pathFromRoot[2].params,
      this.route.pathFromRoot[4].params,
      this.route.pathFromRoot[5].params,
      this.store.pipe(select(commonStore.getSelectedHistoryLog))
    ).subscribe(([branchParams, buildingParams, versionParams, historyVersion]) => {
      this.branchId = branchParams['branchid'];
      this.buildingId = buildingParams['id'];
      this.version = versionParams['vid'];
      this.loadData();
    });
    this.store.pipe(select(commonStore.getIsFinalized))
      .subscribe(res => {this.buildingPeriodIsFinalized = res});
  }

  loadData() {
    this.store.dispatch(new locationAction.RequestLocationList());
  }

  ngOnDestroy(): void {
    this.subscriber$.unsubscribe();
  }

  dropped(event: CdkDragDrop<LocationViewModel[]>) {
    this.store.dispatch(new locationAction.UpdateLocations({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex
    }));
  }

  search(term: string): void {
    this.store.dispatch(new locationAction.UpdateSearchKey(term));
  }

  openDetail() {
    this.modalService.open(AddLocationComponent, {backdrop: 'static'});
  }

  onCreate() {
    if(this.buildingPeriodIsFinalized) return false;
    this.store.dispatch(new locationFormAction.CreateLocation());
    this.openDetail();
  }

  onEdit(event) {
    this.ngbDropdownList.find(item => item.isOpen()).close();
    this.store.dispatch(new locationFormAction.EditLocation(event));
    this.openDetail();
  }

  onDelete(event) {
    this.ngbDropdownList.find(item => item.isOpen()).close();
    const modalRef = this.modalService.open(DeleteDialogComponent, {backdrop: 'static'});
    modalRef.result.then((_) => {
      this.store.dispatch(new locationAction.DeleteLocation(event));
    }, () => {
    });
  }

  onClone(event) {
    this.ngbDropdownList.find(item => item.isOpen()).close();
    this.store.dispatch(new locationAction.CloneLocation(event));
  }

  changeOrderIndex(idx: number) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = idx;
    }

    this.store.dispatch(new locationAction.UpdateOrder(this.orderIndex));
    this.store.dispatch(new locationAction.RequestLocationList());
  }

  onOpenLocationDetail(event: any, location: any) {
    if (event.target && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('dropdown-clone') || event.target.classList.contains('dropdown-edit') || event.target.classList.contains('dropdown-delete'))) {
      return;
    }

    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.version, 'equipment', 'locations', location.id]);
  }

}

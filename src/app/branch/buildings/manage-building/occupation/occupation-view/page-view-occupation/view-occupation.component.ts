import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {NgbModal, NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {
  CommonAreaViewModel,
  ComplexLiabilityShopFilter,
  Dictionary,
  ShopViewModel,
  TenantShopHistoryViewModel,
  VersionActionType
} from '@models';

import * as fromOccupation from '../../shared/store/reducers';
import * as nodeApplyNewTariffVersionsAction
  from '../../../../manage-building/building-equipment/shared/store/actions/node-apply-new-tariff-versions.action';
import * as occupationAction from '../../shared/store/actions/occupation.actions';
import * as buildingCommonData from '../../../shared/store/selectors/common-data.selectors';

import {CommonAreaShopRelationsViewModel, HistoryViewModel} from '../../shared/models';
import {CommonAreaServiceLiabilityViewModel} from '../../shared/models/common-area-service-liability.model';
import {OccupationService} from '@services';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';

@Component({
  selector: 'view-occupation',
  templateUrl: './view-occupation.component.html',
  styleUrls: ['./view-occupation.component.less']
})
export class ViewOccupationComponent implements OnInit, OnDestroy {

  shops$: Observable<ShopViewModel[]>;
  tenantShopHistory$: Observable<TenantShopHistoryViewModel[]>;
  shopWithFilteringAndSearching$: Observable<ShopViewModel[]>;
  getShopsWithFilteringByStatusWithoutSpare$: Observable<ShopViewModel[]>;

  commonAreas$: Observable<CommonAreaViewModel[]>;
  commonAreaWithSearching$: Observable<CommonAreaViewModel[]>;

  commonAreasShopsData$: Observable<Dictionary<Dictionary<CommonAreaShopRelationsViewModel>>>;
  commonAreaServiceLiabilities$: Observable<CommonAreaServiceLiabilityViewModel[]>;
  activeCommonAreas$: Observable<CommonAreaViewModel[]>;
  complexLiabilityShopFilterBy$: Observable<ComplexLiabilityShopFilter>;

  shopOrderIndex$: Observable<number>;
  commonAreaOrderIndex$: Observable<number>;

  canEdit$: Observable<boolean>;
  currentTab: any = "tabOccupation-0";

  getUpdateDate$: Subscription;
  getComment$: Subscription;

  histories$: Observable<HistoryViewModel[]>;
  currentHistory$: Observable<HistoryViewModel>;
  updateDate: Date = new Date();
  comment: string = '';

  buildingId: string;
  buildingId$: Observable<string>;
  isComplete$: Observable<boolean>;

  branchId: string;
  versionDay: string;

  routeEvent$: Subscription;
  private pathSubscriptoin$;

  constructor(
    private store: Store<fromOccupation.State>,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private occupationService: OccupationService
  ) {
    this.isComplete$ = store.select(fromOccupation.getCompleteStatus);
    this.shops$ = store.select(fromOccupation.getShops);
    this.shopWithFilteringAndSearching$ = store.select(fromOccupation.getShopsWithFilteringByStatus);
    this.getShopsWithFilteringByStatusWithoutSpare$ = store.select(fromOccupation.getFilteredShopsForLiability);

    this.commonAreas$ = store.select(fromOccupation.getCommonAreas);
    this.commonAreaWithSearching$ = store.select(fromOccupation.getCommonAreaWithSearching);

    this.commonAreaServiceLiabilities$ = store.select(fromOccupation.getCommonAreaServiceLiabilities);
    this.commonAreasShopsData$ = store.select(fromOccupation.getCommonAreaShopRelations);
    this.activeCommonAreas$ = store.select(fromOccupation.getActiveCommonAreas);
    this.complexLiabilityShopFilterBy$ = store.select(fromOccupation.getComplexLiabilityShopFilter);

    this.canEdit$ = store.select(fromOccupation.canEdit);

    this.getUpdateDate$ = store.select(fromOccupation.getUpdateDate).subscribe(date => {
      this.updateDate = date;
    });

    this.getComment$ = store.select(fromOccupation.getComment).subscribe(comment => {
      this.comment = comment;
    });

    this.buildingId$ = store.select(buildingCommonData.getBuildingId);
    this.shopOrderIndex$ = store.select(fromOccupation.getShopOrderIndex);
    this.commonAreaOrderIndex$ = store.select(fromOccupation.getCommonAreaOrderIndex);

    this.routeEvent$ = router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => {
        return route.snapshot.data['tabOccupation'];
      })).subscribe(r => {
      if (r) {
        this.currentTab = r;
      }
    });
  }

  ngOnInit() {
    this.pathSubscriptoin$ = combineLatest(
      [this.route.pathFromRoot[2].params,
      this.route.pathFromRoot[4].params,
      this.route.pathFromRoot[5].params,
      this.store.pipe(select(buildingCommonData.getSelectedHistoryLog))]
    ).subscribe(([branchParams, buildingParams, versionParams, version]) => {
      this.branchId = branchParams['branchid'];
      this.buildingId = buildingParams['id'];
      this.versionDay = versionParams['vid'];
      if (version) {
        this.loadOccupation(this.buildingId, version.id);
      }
    });

    this.checkBuidingTariffState();
  }

  ngOnDestroy(): void {
    this.getUpdateDate$.unsubscribe();
    this.getComment$.unsubscribe();
    this.routeEvent$.unsubscribe();
    this.pathSubscriptoin$ && this.pathSubscriptoin$.unsubscribe();
  }

  loadOccupation(buildingId: string, versionId: string) {
    this.occupationService.get(buildingId, versionId).subscribe(r => {
      this.store.dispatch(new occupationAction.Get(r));
    });
  }

  beforeChange(event: NgbNavChangeEvent) {
    this.currentTab = event.activeId;
    if (event.nextId === "tabOccupation-1") {
      this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'occupation', 'shops']);
    } else if (event.nextId === "tabOccupation-2") {
      this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'occupation', 'common-areas']);
    } else if (event.nextId === "tabOccupation-3") {
      this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'occupation', 'floor-plans']);
    } else {
      this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.versionDay, 'occupation']);
    }
  }

  onAddShop() {
    this.store.dispatch(new occupationAction.AddShop());
  }

  onUpdateShop($event) {
    this.store.dispatch(new occupationAction.UpdateShop($event));
  }

  onDeleteShop($event) {
    this.store.dispatch(new occupationAction.DeleteShop($event));
  }

  onSetVacantStatusForShops($event) {
    this.store.dispatch(new occupationAction.SetVacantStatusForShops($event));
  }

  onSetSpareStatusForShops($event) {
    this.store.dispatch(new occupationAction.SetSpareStatusForShops($event));
  }

  onSetUnspareStatusForShops($event) {
    this.store.dispatch(new occupationAction.SetUnspareStatusForShops($event));
  }

  onMergeShops($event) {
    this.store.dispatch(new occupationAction.MergeShops($event));
  }

  onSplitShop($event) {
    this.store.dispatch(new occupationAction.SplitShop($event));
  }

  onUpdateShopStatusFilter(event) {
    this.store.dispatch(new occupationAction.UpdateShopStatusFilter(event));
  }

  onAddCommonArea($event) {
    this.store.dispatch(new occupationAction.AddCommonArea($event));
  }

  onUpdateCommonArea($event) {
    this.store.dispatch(new occupationAction.UpdateCommonArea($event));
  }

  onDeleteCommonArea($event) {
    this.store.dispatch(new occupationAction.DeleteCommonArea($event));
  }

  onUpdateShopSearchTerm(event) {
    this.store.dispatch(new occupationAction.UpdateShopSearchTerm(event));
  }

  onUpdateCommonAreaSearchTerm(event) {
    this.store.dispatch(new occupationAction.UpdateCommonAreaSearchTerm(event));
  }

  onUpdateShopConnectFilter(event) {
    this.store.dispatch(new occupationAction.UpdateShopConnectFilter(event));
  }

  saveOccupation() {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new occupationAction.InitLiabilitiesByCommonAreaServices());
      this.store.dispatch(new occupationAction.UpdateOccupation({
        action: actionType,
        comment: comment,
        startDate: date
      }));
    }, () => {
    });

    modalRef.componentInstance.date = this.updateDate;
    modalRef.componentInstance.comment = this.comment;
  }

  onCancel() {
    this.store.dispatch(new occupationAction.OccupationCancel());
  }

  onUpdateCommonAreaHeader(event) {
    this.store.dispatch(new occupationAction.UpdateCommonServiceLiability(event));
  }

  onAddCommonAreaShop(event) {
    this.store.dispatch(new occupationAction.AddCommonAreaShop(event));
  }

  onDeleteCommonAreaShop(event) {
    this.store.dispatch(new occupationAction.DeleteCommonAreaShop(event));
  }

  onUpdateShopAllocation(event) {
    this.store.dispatch(new occupationAction.UpdateShopAllocationByService(event));
  }

  onUpdateShopLiable(event) {
    this.store.dispatch(new occupationAction.UpdateShopLiableByService(event));
  }

  onSelectShopForAllCommonAreas(event) {
    this.store.dispatch(new occupationAction.AddAllCommonAreaShopByShop(event));
  }

  onUnselectShopForAllCommonAreas(event) {
    this.store.dispatch(new occupationAction.DeleteAllCommonAreaShopByShop(event));
  }

  onSelectCommonAreaForAllShops(event) {
    this.store.dispatch(new occupationAction.AddAllCommonAreaShopByCommonArea(event));
  }

  onUnselectCommonAreaForAllShops(event) {
    this.store.dispatch(new occupationAction.DeleteAllCommonAreaShopByCommonArea(event));
  }

  onUpdateComplexShopFilter(event) {
    this.store.dispatch(new occupationAction.UpdateComplexLiabilityShopFilter(event));
  }

  onHistoryChange(event) {
    this.store.dispatch(new occupationAction.HistoryChange(event));
  }

  onUpdateShopRentDetails(event) {
    this.store.dispatch(new occupationAction.UpdateShopRentDetails(event));
    this.store.dispatch(new occupationAction.UpdateOccupation({
      action: VersionActionType.Insert,
      comment: event.comment,
      startDate: event.startDate
    }));
  }

  onUpdateCommonAreaServices($event) {
    this.store.dispatch(new occupationAction.UpdateCommonAreaServices($event));
  }

  onSelectedCommonAreaById(event) {
    this.store.dispatch(new occupationAction.SelectedCommonAreaLiabilityById(event));
  }

  onOpenShopHistory(event) {
    this.store.dispatch(new occupationAction.RequestGetShopHistory(event));
  }

  onCloseShopHistory(event) {
    this.store.dispatch(new occupationAction.ShopHistoryClose(event));
  }

  onUpdateShopOrderIndex($event) {
    this.store.dispatch(new occupationAction.UpdateShopOrder($event));
  }

  onUpdateCommonAreaOrderIndex($event) {
    this.store.dispatch(new occupationAction.UpdateCommonAreaOrder($event));
  }

  onSaveCommonAreasList() {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new occupationAction.SaveCommonArea({
        action: actionType,
        comment: comment,
        startDate: date
      }));
    }, () => {
    });

    modalRef.componentInstance.date = this.updateDate;
    modalRef.componentInstance.comment = this.comment;
  }

  onSaveShopsList() {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new occupationAction.SaveShops({
        action: actionType,
        comment: comment,
        startDate: date
      }));
    }, () => {
    });

    modalRef.componentInstance.date = this.updateDate;
    modalRef.componentInstance.comment = this.comment;
  }

  onGoToNodeDetail(nodeId: string) {
    this.router.navigate(['../equipment', 'nodes', nodeId], {
      relativeTo: this.route.parent
    });
  }

  private checkBuidingTariffState(): void {
    this.store.dispatch(new nodeApplyNewTariffVersionsAction.ProcessTariffStateOnBuildingLoad());
  }
}

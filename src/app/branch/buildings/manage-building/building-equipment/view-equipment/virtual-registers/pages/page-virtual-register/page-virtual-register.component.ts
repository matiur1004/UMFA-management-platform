import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as virtualRegistersActions
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/actions/virtual-registers.action';
import * as fromEquipment from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import * as virtualRegisters
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/selectors/virtual-registers.selectors';
import * as virtualRegistersState
  from '@app/branch/buildings/manage-building/building-equipment/shared/store/state/virtual-registers.state';
import * as selectors from '@app/branch/buildings/manage-building/tariffs/store/selectors';
import {getItemsDetails} from '@app/branch/buildings/shared/utils/text';
import {PopupCommentComponent} from '@app/popups/popup.comment/popup.comment.component';
import {PagingOptions} from '@app/shared/models/paging-options.model';
import {HistoryViewModel, UnitOfMeasurement, UNITS_PER_PAGE} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {BranchManagerService} from '@services';
import * as commonData from '@app/branch/buildings/manage-building/shared/store/selectors/common-data.selectors';
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {
  VirtualRegisterListItem,
  VirtualRegisterType,
} from 'app/branch/buildings/manage-building/building-equipment/shared/models/virtual-register.model';

@Component({
  selector: 'page-virtual-register',
  templateUrl: './page-virtual-register.component.html',
  styleUrls: ['./page-virtual-register.component.less']
})
export class PageVirtualRegisterComponent implements OnInit, OnDestroy {
  unitsPerPageList = UNITS_PER_PAGE;
  pageSize: number | null = 30;
  virtualRegisters$: Observable<VirtualRegisterListItem[]>;
  VirtualRegisterType = VirtualRegisterType;
  page = 1;
  skipedVirtualRegister = 0;
  total = 1;
  buildingPeriodIsFinalized: boolean;
  private searchTermsSubject = new Subject<string>();
  private searchTerms = '';
  private unitsOfMeasurement: UnitOfMeasurement[];
  private selectedVersionId: string;
  private currentPageNumber = 1;
  private searchTermsSubscription: Subscription;
  private unitsOfMeasurementSub: Subscription;
  private selectedVersion: HistoryViewModel;
  private totalSub: Subscription;
  private selectedVersion$: Subscription;

  constructor(
    private storeEquipment$: Store<fromEquipment.State>,
    private route: ActivatedRoute,
    private router: Router,
    private branchManager: BranchManagerService,
    private modalService: NgbModal,
    private store$: Store<virtualRegistersState.State>) {
  }

  ngOnInit() {
    this.selectedVersion$ = this.store$.pipe(select(commonData.getSelectedHistoryLog))
      .subscribe((version: HistoryViewModel) => {
        this.selectedVersionId = version.id;
        this.selectedVersion = version;
        this.initializeVirtualRegisters();
      });

    this.totalSub = this.store$.pipe(select(virtualRegisters.getRegistersTotal)).subscribe(total => this.total = total);

    this.unitsOfMeasurementSub = this.storeEquipment$.pipe(select(selectors.getAllUnitsOfMeasurements))
      .subscribe(units => {
        this.unitsOfMeasurement = units;
      });

    this.initializeVirtualRegisters();

    this.virtualRegisters$ = this.store$.pipe(select((virtualRegisters.getRegisters)));

    this.searchTermsSubscription = this.searchTermsSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchTerms = term;
        const payload: PagingOptions<{ searchKey: string }> = {
          skip: this.skipedVirtualRegister,
          take: this.pageSize,
          requestParameters: {
            searchKey: this.searchTerms
          }
        };

        this.store$.dispatch(new virtualRegistersActions.SearchVirtualRegisters(payload));
      })
    ).subscribe();

    this.store$.pipe(select(commonData.getIsFinalized))
      .subscribe(res => {this.buildingPeriodIsFinalized = res});
  }

  initializeVirtualRegisters() {
    const payload: PagingOptions<{ searchKey: string, versionId: string }> = {
      skip: this.skipedVirtualRegister,
      take: this.pageSize,
      requestParameters: {
        searchKey: this.searchTerms,
        versionId: this.selectedVersionId
      }
    };

    this.store$.dispatch(new virtualRegistersActions.RequestVirtualRegisters(payload));
  }

  getShowingItems() {
    return getItemsDetails(this.page, this.pageSize, this.total, 'items');
  }

  setItemsPerPage(pageSize: number) {
    this.pageSize = pageSize;
    this.currentPageNumber = 1;
    this.skipedVirtualRegister = 0;
    this.initializeVirtualRegisters();
  }

  onCreate() {
    if(this.buildingPeriodIsFinalized) return false;
    this.router.navigate['./new'];
  }

  search(searchTerm: string) {
    this.searchTermsSubject.next(searchTerm);
  }

  onPageChange(selectedPageNumber: number) {
    this.currentPageNumber = selectedPageNumber;
    this.skipedVirtualRegister = (this.currentPageNumber - 1) * this.pageSize;
    this.initializeVirtualRegisters();
  }

  ngOnDestroy(): void {
    this.unitsOfMeasurementSub.unsubscribe();

    if (this.selectedVersion$) {
      this.selectedVersion$.unsubscribe();
    }

    if (this.totalSub) {
      this.totalSub.unsubscribe();
    }

    if (this.searchTermsSubscription) {
      this.searchTermsSubscription.unsubscribe();
    }
  }

  onRemoveVirtualRegister(id: string) {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.componentInstance.comment = this.selectedVersion.comment;

    modalRef.result.then(({comment, date, actionType}) => {
      this.store$.dispatch(new virtualRegistersActions.DeleteVirtualRegister({
        id: this.selectedVersionId,
        entity: id,
        majorVersion: 1,
        action: actionType,
        versionDate: date ? new Date(date) : this.selectedVersion.startDate,
        comment
      }));

    }, () => {
    });
  }

  onEditVirtualRegister(id: string) {
    this.store$.dispatch(new virtualRegistersActions.NavigateToVirtualRegisterDetail(id));
  }

  private getUnitOfMeasurementTypeName(unitOfMeasurement: number) {
    const unit = this.unitsOfMeasurement.find(unit => unit.unitType === unitOfMeasurement);

    return unit ? unit.defaultName : '';
  }
}

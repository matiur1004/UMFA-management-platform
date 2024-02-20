import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime, distinctUntilChanged, takeUntil, tap} from 'rxjs/operators';
import {Subject, Subscription} from 'rxjs';
import {ReasonSettingsComponent} from '@app/admin/equipment/equipment-settings/equipment-reason/reason-settings/reason-settings.component';
import {EquipmentService} from '@services';
import {EstimatedReadingReasonViewModel} from '@app/shared/models/estimated-reading-reason';

@Component({
  selector: 'list-reasons',
  templateUrl: './list-reasons.component.html',
  styleUrls: ['./list-reasons.component.less']
})
export class ListReasonsComponent implements OnInit, OnDestroy {
  model: EstimatedReadingReasonViewModel[] = new Array<EstimatedReadingReasonViewModel>();
  orderIndex: number = 1;
  destroy$: Subject<boolean> = new Subject<boolean>();
  private searchTermSub: Subscription;
  private searchTermsSubject = new Subject<string>();
  private searchTerms = '';

  constructor(
    private modalService: NgbModal,
    private equipmentService: EquipmentService) {
  }

  ngOnInit(): void {
    this.loadData();

    this.searchTermSub = this.searchTermsSubject.pipe(
      // wait 800ms after each keystroke before considering the term
      debounceTime(800),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchTerms = term;
        this.loadData();
      }),
    ).subscribe();
  }

  onAddNew() {
    const modalRef = this.modalService.open(ReasonSettingsComponent, {backdrop: 'static'});
    modalRef.componentInstance.isNew = true;

    modalRef.result.then((result) => {
      if (result) {
        const reason = new EstimatedReadingReasonViewModel();
        reason.isSystem = false;
        reason.reason = result;
        this.equipmentService.createReason(reason).pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
      }
    }, (reason) => {
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  onClone(model: EstimatedReadingReasonViewModel) {
    const newReason = new EstimatedReadingReasonViewModel();
    newReason.reason = 'Copy - ' + model.reason;
    newReason.isSystem = false;

    this.equipmentService.createReason(newReason).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadData();
    });
  }

  search(tearm: string) {
    this.searchTermsSubject.next(tearm);
  }

  onEdit(model: EstimatedReadingReasonViewModel) {
    const modalRef = this.modalService.open(ReasonSettingsComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = model;
    modalRef.componentInstance.isNew = false;

    modalRef.result.then((result) => {
      if (result) {
        const reason = new EstimatedReadingReasonViewModel();
        reason.isSystem = false;
        reason.id = model.id;
        reason.reason = result;
        this.equipmentService.updateReason(model.id, reason).pipe(takeUntil(this.destroy$)).subscribe(() => this.loadData());
      }
    }, (reason) => {
    });
  }

  onDelete(model: EstimatedReadingReasonViewModel) {
    this.equipmentService.deleteReason(model.id).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.loadData();
    });
  }

  private loadData() {
    this.equipmentService.getAllReasons(this.searchTerms).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.model = response;
      if (this.orderIndex == 1) {
        this.model.sort((a, b) => a.reason < b.reason ? -1 : (a.reason > b.reason ? 1 : 0))
      }
      else {
        this.model.sort((b, a) => a.reason < b.reason ? -1 : (a.reason > b.reason ? 1 : 0))
      }
    });
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = idx;
    }
    this.loadData();
  }
}

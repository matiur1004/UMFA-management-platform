import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subscription} from 'rxjs';
import {BillingReadingsFilterModel,} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';

@Component({
  selector: 'popup.create.filter',
  templateUrl: './popup.create.filter.component.html',
  styleUrls: ['./popup.create.filter.component.less']
})
export class PopupCreateFilterComponent implements OnInit, OnDestroy {
  filterName = '';
  isSubmit = false;
  isNew: boolean;
  filterDetail$: Observable<BillingReadingsFilterModel>;
  private filterDetailSub: Subscription;

  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.filterDetailSub = this.filterDetail$.subscribe(f => {
      this.filterName = !this.isNew ? f.filterName : '';
    });
  }

  onCancel() {
    this.activeModal.close();
  }

  onSave() {
    this.isSubmit = true;

    if (!this.filterName.length) {
      return;
    }

    this.activeModal.close(this.filterName);
  }

  ngOnDestroy() {
    this.filterDetailSub && this.filterDetailSub.unsubscribe();
  }
}

import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as fromStore from '../suppliers/shared/store';
import * as fromModals from '../suppliers/modals';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.less']
})
export class SuppliersComponent implements OnInit {

  constructor(
    private readonly store: Store<fromStore.State>,
    private readonly modalService: NgbModal,
  ) {
  }

  ngOnInit() {
  }

  onAddSupplier(): void {
    this.store.dispatch(new fromStore.GetSuppliers(null));
    this.modalService.open(fromModals.AddSupplierToBranchComponent, {
      backdrop: 'static',
      windowClass: 'add-supplier-modal'
    });
  }
}

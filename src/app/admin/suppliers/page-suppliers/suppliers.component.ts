import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import * as supplierState from '../shared/store/reducers';
import * as supplierCommonActions from '../shared/store/actions/supplier-common.actions';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.less']
})
export class SuppliersComponent implements OnInit {

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private store: Store<supplierState.State>
  ) {
  }

  ngOnInit() {
    this.loadSuppliersList();
  }

  onAddNewSupplier() {
    this.store.dispatch(new supplierCommonActions.SupplierAddNew());
  }

  onEditSupplier(supplierId) {
    this.router.navigate(['admin', 'suppliers', supplierId]);
  }

  onDeleteSupplier(supplierId) {
    this.store.dispatch(new supplierCommonActions.ApiSupplierDelete(supplierId));
  }

  private loadSuppliersList() {
    this.store.dispatch(new supplierCommonActions.ApiSuppliersListRequest());
  }
}

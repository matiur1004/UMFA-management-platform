import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {skip} from 'rxjs/operators';
import {select, Store} from '@ngrx/store';
import {CommonAreaViewModel, ShopViewModel} from '@models';

import * as fromNodeState from '../../../shared/store/reducers';
import * as nodeActions from '../../../shared/store/actions/node.actions';

import {DialogSelectUnitsComponent} from './dialog-select-units/dialog-select-units.component';

@Directive({
  selector: '[select-units-bind-dialog]'
})
export class SelectUnitsBindDialogDirective {
  @Output() confirmAction: EventEmitter<any> = new EventEmitter<any>();

  @Input('select-units-bind-dialog') units: any[];
  @Input() supplyType: string;

  units$: Subscription;

  constructor(
    private modalService: NgbModal,
    private store: Store<fromNodeState.State>,
  ) {
  }

  @HostListener('click', ['$event']) onClick() {
    this.store.dispatch(new nodeActions.GetAllUnits());
    this.units$ = this.store.pipe(select(fromNodeState.getUnitsFilteredBySypplyType, {supplyType: this.supplyType})).pipe(skip(1)).subscribe((res: ShopViewModel[]) => {
      const unitsIds = this.units.map(el => el.id);
      let filteredUnits = res.filter(el => unitsIds.indexOf(el.id) === -1);
      this.openDialog(filteredUnits);
    });
  }

  openDialog(units: ShopViewModel[] | CommonAreaViewModel[]) {
    this.units$.unsubscribe();
    const options: any = {
      backdrop: 'static',
      windowClass: 'select-units-modal'
    }
    const modalRef = this.modalService.open(DialogSelectUnitsComponent, options);
    modalRef.componentInstance.units = units;
    modalRef.result.then((res: any) => {
      this.confirmAction.emit(res);
    }, () => {
    });
  }

}

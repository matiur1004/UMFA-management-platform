import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {skip} from 'rxjs/operators';

import * as fromNodeState from '../../../shared/store/reducers';
import * as nodeActions from '../../../shared/store/actions/node.actions';
import {DialogSelectMetersComponent} from './dialog-select-meters/dialog-select-meters.component';
import {RegisterViewModel} from '@models';

@Directive({
  selector: '[select-meters-bind-dialog]'
})
export class SelectMetersBindDialogDirective {
  @Output() confirmAction: EventEmitter<any> = new EventEmitter<any>();
  @Input('select-meters-bind-dialog') units: any[];
  @Input() register: RegisterViewModel;

  private subscription$: Subscription;

  constructor(
    private modalService: NgbModal,
    private store: Store<fromNodeState.State>,
  ) {
  }

  @HostListener('click', ['$event']) onClick() {
    if (this.register && this.register.id) {
      this.store.dispatch(new nodeActions.GetMetersWithSupply(this.register.id));
      this.subscription$ = this.store.pipe(select(fromNodeState.getMetersWithSupply)).pipe(skip(1)).subscribe(res => {
        this.subscription$.unsubscribe();
        const unitsList = [];
        this.units.forEach(el => {
          if (el.isSelected) {
            unitsList.push({
              id: el.id,
              name: el.name,
              meterIds: [].concat(el.meterIds)
            });
          }
        });
        this.openDialog(res, unitsList);
      });
    }
  }

  openDialog(meters: any[], unitsList: string[]) {
    const options: any = {
      backdrop: 'static',
      windowClass: 'select-meters-modal'
    }
    const modalRef = this.modalService.open(DialogSelectMetersComponent, options);
    modalRef.componentInstance.meters = meters;
    modalRef.componentInstance.unitsList = unitsList;
    modalRef.result.then((res: any) => {
      this.confirmAction.emit(res);
    }, () => {
    });
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {EquipmentService} from '@services';
import {RegisterSettingsComponent} from '../register-settings/register-settings.component';
import {RegisterEditViewModel, RegisterViewModel, SupplyType} from '@models';

@Component({
  selector: 'list-registers',
  templateUrl: './list-registers.component.html',
  styleUrls: ['./list-registers.component.less']
})
export class ListRegistersComponent implements OnInit, OnDestroy {

  model: RegisterViewModel[] = new Array<RegisterViewModel>();
  config = {
    animated: true,
    keyboard: true,
    backdrop: true,
    ignoreBackdropClick: false,

  };
  orderIndex: number = 1;
  private searchTermsSubject = new Subject<string>();
  private searchTerms = '';
  private supplyType = SupplyType;

  constructor(private modalService: NgbModal, private equipmentService: EquipmentService) {
  }

  ngOnInit() {
    this.loadData();

    this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchTerms = term;
        this.loadData();
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.searchTermsSubject.unsubscribe();
  }

  onAddNew() {
    const modalRef = this.modalService.open(RegisterSettingsComponent, {backdrop: 'static'});
    modalRef.componentInstance.isNew = true;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  loadData() {
    var registers = this.equipmentService.getAllRegisters(this.searchTerms).subscribe((response: RegisterViewModel[]) => {
      this.model = response.filter(r => !r.isVirtualRegister);
      if (this.orderIndex == 1) {
        this.model.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0))
      }
      else {
        this.model.sort((b, a) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0))
      }
    });
    return registers;
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  onEdit(model: RegisterViewModel) {
    const modalRef = this.modalService.open(RegisterSettingsComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = model;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  onDelete(model: RegisterViewModel) {
    this.equipmentService.deleteRegister(model.id).subscribe(() => {
      this.loadData();
    });
  }

  onClone(model: RegisterEditViewModel) {
    const newRegister = {...model, name: "Copy - " + model.name};

    this.equipmentService.createRegister(newRegister).subscribe(() => {
      this.loadData();
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

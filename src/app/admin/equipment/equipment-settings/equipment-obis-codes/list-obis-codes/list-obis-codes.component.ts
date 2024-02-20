import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {EquipmentService} from '@services';
import {ObisCodeViewModel} from '@models';
import {EditObiscodesComponent} from '../edit-obiscodes/edit-obiscodes.component';
import {EnergyType} from './../../../../../shared/models/obis-code-energytype.model';
import {PolarityType} from './../../../../../shared/models/obis-code-polaritytype.model';
import {ReadingType}from './../../../../../shared/models/obis-code-readingtype.model';
import {TariffType} from './../../../../../shared/models/obis-code-tarifftype.model';

@Component({
  selector: 'list-obis-codes',
  templateUrl: './list-obis-codes.component.html',
  styleUrls: ['./list-obis-codes.component.less']
})
export class ListObisCodesComponent implements OnInit, OnDestroy {

  model: ObisCodeViewModel[] = new Array<ObisCodeViewModel>();
  orderIndex: number = 1;
  private searchTermsSubject = new Subject<string>();
  private searchTerms = '';
  private energyType = EnergyType;
  private polarityType = PolarityType;
  private ReadingType = ReadingType;
  private tariffType = TariffType;

  constructor(private modalService: NgbModal, private equipmentService: EquipmentService) {
  }

  ngOnInit() {
    this.loadData();
    this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(500),

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
    const modalRef = this.modalService.open(EditObiscodesComponent, {backdrop: 'static'});
    modalRef.componentInstance.isNew = true;
    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  loadData() {
    this.equipmentService.getAllObisCodes(this.searchTerms).subscribe((response) => {
      this.model = response;
      if (this.orderIndex == 1) {
        this.model.sort((a, b) => a.obisCodeValue < b.obisCodeValue ? -1 : (a.obisCodeValue > b.obisCodeValue ? 1 : 0))
        }
      else {
        this.model.sort((b, a) => a.obisCodeValue < b.obisCodeValue ? -1 : (a.obisCodeValue > b.obisCodeValue ? 1 : 0))
        }
    });
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  onEdit(obisCode: ObisCodeViewModel) {
    const modalRef = this.modalService.open(EditObiscodesComponent);
    modalRef.componentInstance.model = obisCode;
    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  onDelete(obisCode: ObisCodeViewModel) {
    this.equipmentService.deleteObisCode(obisCode.id).subscribe(() => {
      this.loadData();
    });
  }

  onClone(obisCode: ObisCodeViewModel) {
    const newObisCode = {...obisCode, obisCodeValue: 'C-' + obisCode.obisCodeValue};
    this.equipmentService.createObisCode(newObisCode).subscribe(() => {
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

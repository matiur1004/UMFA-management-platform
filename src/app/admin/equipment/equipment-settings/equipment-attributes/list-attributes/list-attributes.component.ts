import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewChildren} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditAttributesComponent} from '../edit-attributes/edit-attributes.component';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {EquipmentService} from '@services';
import {EquipmentAttributeViewModel, EquipmentComboSettingsViewModel} from '@models';

@Component({
  selector: 'list-attributes',
  templateUrl: './list-attributes.component.html',
  styleUrls: ['./list-attributes.component.less']
})
export class ListAttributesComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('tableColsHeader', {read: ElementRef, static: true}) tableColsHeader: ElementRef;
  @ViewChild('tableFirstColHeader', {read: ElementRef, static: true}) tableFirstColHeader: ElementRef;
  @ViewChildren('tableRowsHeader') tableRowsHeader;

  model: EquipmentAttributeViewModel[] = new Array<EquipmentAttributeViewModel>();
  orderIndex: number = 1;
  private searchTermsSubject = new Subject<string>();
  private searchTerms: string = '';
  private scrollPosition = 0;

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

  ngOnDestroy() {
    this.searchTermsSubject.unsubscribe();
  }

  ngAfterViewChecked() {
    this.setScrollPosition(this.scrollPosition);
  }

  onAddNew() {
    const modalRef = this.modalService.open(EditAttributesComponent, {backdrop: 'static'});
    modalRef.componentInstance.isNew = true;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  loadData() {
    this.equipmentService.getAllEquipmentAttributes(this.searchTerms).subscribe((response: EquipmentAttributeViewModel[]) => {
      this.model = response;
      if (this.orderIndex == 1) {
        this.model.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0))
      }
      else {
        this.model.sort((b, a) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0))
      }
    });
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  onEdit(model: EquipmentAttributeViewModel) {
    const modalRef = this.modalService.open(EditAttributesComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = model;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  onDelete(model: EquipmentAttributeViewModel) {
    this.equipmentService.deleteEquipmentAttribute(model.id).subscribe(() => {
      this.loadData();
    });
  }

  onClone(model: EquipmentAttributeViewModel) {
    var newEquipmentAttrib = {...model, name: "Copy - " + model.name};

    if (model.unit && model.unit.name === null) {
      model.unit = null;
    }

    for (let combo of model.comboSettings) {
      combo.id = null;
    }

    this.equipmentService.createEquipmentAttribute(newEquipmentAttrib).subscribe(() => {
      this.loadData();
    });
  }

  getEquipmentGroupsText(model: EquipmentAttributeViewModel): string {
    return model.equipmentGroups.map(e => e.name).join(", ");
  }

  getComboSettings(model: EquipmentComboSettingsViewModel[]): string {
    model = model.sort((a, b) => a.sequence - b.sequence);
    return model.map(u => u.value).join('/');
  }

  onScroll(event) {
    this.scrollPosition = event.srcElement.scrollLeft;
    this.tableColsHeader.nativeElement.style.left = -this.scrollPosition + 'px';
    this.tableFirstColHeader.nativeElement.style.left = this.scrollPosition + 'px';

    this.setScrollPosition(this.scrollPosition);
  }

  setScrollPosition(scrollPosition: number) {
    for (let item of this.tableRowsHeader.toArray()) {
      item.nativeElement.style.left = scrollPosition + 'px';
    }
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

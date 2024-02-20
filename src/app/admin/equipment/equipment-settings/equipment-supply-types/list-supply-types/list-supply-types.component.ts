import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditSupplyTypesComponent} from '../edit-supply-types/edit-supply-types.component';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {EquipmentService} from '@services';
import {SupplyToViewModel, SupplyType} from '@models';

@Component({
  selector: 'list-supply-types',
  templateUrl: './list-supply-types.component.html',
  styleUrls: ['./list-supply-types.component.less']
})
export class ListSupplyTypesComponent implements OnInit, OnDestroy {

  model: SupplyToViewModel[] = new Array<SupplyToViewModel>();
  supplyTypeFilterText: string = 'All supply types';
  supplyTypesList = [SupplyType.Electricity, SupplyType.Water, SupplyType.Gas, SupplyType.Sewerage, SupplyType.AdHoc];
  orderIndex: number = 1;
  private searchTermsSubject = new Subject<string>();
  private searchTerms: string = '';
  private supplyType = SupplyType;
  private supplyTypeFilter?: SupplyType = null;

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
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.searchTermsSubject.unsubscribe();
  }

  onAddNew() {
    const modalRef = this.modalService.open(EditSupplyTypesComponent, {backdrop: 'static'});
    modalRef.componentInstance.isNew = true;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  loadData() {
    this.equipmentService.getAllSupplyLocationTypes(this.searchTerms, this.supplyTypeFilter).subscribe((response: SupplyToViewModel[]) => {
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

  onEdit(supplyLocationType: SupplyToViewModel) {
    const modalRef = this.modalService.open(EditSupplyTypesComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = supplyLocationType;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  onDelete(supplyTo: SupplyToViewModel) {
    this.equipmentService.deleteSupplyLocationType(supplyTo.id).subscribe(() => {
      this.loadData();
    });
  }

  onClone(supplyTo: SupplyToViewModel) {
    var newSupplyTo = {...supplyTo, name: 'Copy - ' + supplyTo.name};

    newSupplyTo.supplyTypes.forEach(s => {
      s.id = '';

      s.supplyToLocations.forEach(l => {
        l.id = '';
      });
    });

    this.equipmentService.createSupplyLocationType(newSupplyTo).subscribe(() => {
      this.loadData();
    });
  }

  onSupplyTypeFilterChange(supplyType: SupplyType | null = null) {
    this.supplyTypeFilter = supplyType;

    if (supplyType == null) {
      this.supplyTypeFilterText = 'All supply types';
    } else {
      this.supplyTypeFilterText = SupplyType[supplyType];
    }

    this.loadData();
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

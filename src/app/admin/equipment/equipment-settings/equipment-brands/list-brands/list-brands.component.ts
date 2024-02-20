import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditBrandsComponent} from '../edit-brands/edit-brands.component';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {EquipmentService} from '@services';
import {BrandViewModel, EquipmentGroupViewModel} from '@models';

@Component({
  selector: 'list-brands',
  templateUrl: './list-brands.component.html',
  styleUrls: ['./list-brands.component.less']
})
export class ListBrandsComponent implements OnInit, OnDestroy {

  model: BrandViewModel[] = new Array<BrandViewModel>();
  orderIndex: number = 1;
  private searchTermsSubject = new Subject<string>();
  private searchTerms = '';

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
    const modalRef = this.modalService.open(EditBrandsComponent, {backdrop: 'static'});
    modalRef.componentInstance.isNew = true;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  loadData() {
    this.equipmentService.getAllBrands(this.searchTerms).subscribe((response) => {
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

  onEdit(brand: BrandViewModel) {
    const modalRef = this.modalService.open(EditBrandsComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = brand;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  onDelete(brand: BrandViewModel) {
    this.equipmentService.deleteBrand(brand.id).subscribe(() => {
      this.loadData();
    });
  }

  onClone(brand: BrandViewModel) {
    var newEquipmentGroup = {...brand, name: "Copy - " + brand.name};

    this.equipmentService.createBrand(newEquipmentGroup).subscribe(() => {
      this.loadData();
    });
  }

  getEquipmentGroupsText(equipmentGroups: EquipmentGroupViewModel[]) {
    return equipmentGroups.map(g => g.name).join(", ");
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

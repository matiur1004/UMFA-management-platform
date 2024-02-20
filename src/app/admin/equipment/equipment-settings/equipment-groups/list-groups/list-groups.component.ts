import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EditGroupsComponent} from '../edit-groups/edit-groups.component';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {EquipmentService} from '@services';
import {EquipmentGroupViewModel, SupplyType} from '@models';

@Component({
  selector: 'list-groups',
  templateUrl: './list-groups.component.html',
  styleUrls: ['./list-groups.component.less']
})
export class ListGroupsComponent implements OnInit, OnDestroy {

  model: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
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
    const modalRef = this.modalService.open(EditGroupsComponent, {backdrop: 'static'});
    modalRef.componentInstance.isNew = true;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  loadData() {
    this.equipmentService.getAllEquipmentGroups(this.searchTerms).subscribe((response) => {
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

  onEdit(equipmentGroup: EquipmentGroupViewModel) {
    const modalRef = this.modalService.open(EditGroupsComponent);
    modalRef.componentInstance.model = equipmentGroup;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  onDelete(equipmentGroup: EquipmentGroupViewModel) {
    this.equipmentService.deleteEquipmentGroup(equipmentGroup.id).subscribe(() => {
      this.loadData();
    });
  }

  onClone(equipmentGroup: EquipmentGroupViewModel) {
    const newEquipmentGroup = {...equipmentGroup, name: 'Copy - ' + equipmentGroup.name};
    this.equipmentService.createEquipmentGroup(newEquipmentGroup).subscribe(() => {
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

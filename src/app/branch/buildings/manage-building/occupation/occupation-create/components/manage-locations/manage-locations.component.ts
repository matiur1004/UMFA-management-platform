import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateOrEditLocationComponent} from '../../dialogs/create-or-edit-location/create-or-edit-location.component';
import {IWizardComponent} from 'app/shared/wizard/IWizardComponent';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {LocationViewModel} from '@models';

@Component({
  selector: 'manage-locations',
  templateUrl: './manage-locations.component.html',
  styleUrls: ['./manage-locations.component.less']
})
export class ManageLocationsComponent implements OnInit, IWizardComponent {
  @Input() locations: LocationViewModel[];
  @Input() orderIndex: number;

  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() save = new EventEmitter();

  @Output() addLocation = new EventEmitter<LocationViewModel>();
  @Output() deleteLocation = new EventEmitter<string>();
  @Output() updateLocation = new EventEmitter();
  @Output() updateLocationsOrderIndex = new EventEmitter<number>();
  @Output() updateLocationSequenceNumber = new EventEmitter();

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  canNavigate(): boolean {
    return true;
  }

  onNext() {
    this.save.emit();
    this.next.emit();
  }

  onCreate() {
    this.modalService.open(CreateOrEditLocationComponent, {backdrop: 'static'}).result.then((result) => {
      this.addLocation.emit(result);
    }, () => {
    });
  }

  onEdit(locationId) {
    const modalRef = this.modalService.open(CreateOrEditLocationComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = this.locations[locationId];
    modalRef.result.then((result) => {
      this.updateLocation.emit(result);
    })
  }

  onDelete(sequenceNumber) {
    this.modalService.open(DeleteDialogComponent, {backdrop: 'static'}).result.then(() => {
      this.deleteLocation.emit(sequenceNumber)
    }, () => {
    });
  }

  onClone(location) {
    let clonedLocation = {
      ...location,
      name: "Clone of - " + location.name
    };
    this.addLocation.emit(clonedLocation);
  }

  dropped(event: CdkDragDrop<LocationViewModel[]>) {
    this.updateLocationSequenceNumber.emit({previousIndex: event.previousIndex, currentIndex: event.currentIndex});
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1))) {
      this.updateLocationsOrderIndex.emit(this.orderIndex * -1);
    } else {
      this.updateLocationsOrderIndex.emit(idx);
    }
  }
}

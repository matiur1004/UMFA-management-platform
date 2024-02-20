import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {CreateEquipmentComponent} from 'app/admin/equipment/create-equipment/create-equipment.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less']
})
export class EquipmentComponent implements OnInit {

  @ViewChild('tabs', { static: true }) tabSet: NgbNav;
  private newEquipmentSubject: Subject<void> = new Subject<void>();
  tabId: any = "tab-0"

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  onCreate() {
    const modalRef = this.modalService.open(CreateEquipmentComponent, {
      windowClass: 'add-equip-modal',
      backdrop: 'static'
    });
    modalRef.componentInstance.isNew = true;

    modalRef.result.then((result) => {
      this.newEquipmentSubject.next();
    }, (reason) => {
    });
  }

}

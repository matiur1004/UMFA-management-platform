import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {EquipmentService} from '@services';
import {SupplyToViewModel} from '@models';

@Component({
  selector: 'dialog-select-meters',
  templateUrl: './dialog-select-meters.component.html',
  styleUrls: ['./dialog-select-meters.component.less']
})
export class DialogSelectMetersComponent implements OnInit {
  @Input() meters: any[];
  @Input() unitsList: string[];

  public suppliers: SupplyToViewModel[];
  public supplier: SupplyToViewModel;
  public location: any;

  constructor(
    public activeModal: NgbActiveModal,
    private equipmentService: EquipmentService
  ) {
  }

  ngOnInit() {
    this.equipmentService.getAllSupplyLocationTypes(null, null).subscribe((response: SupplyToViewModel[]) => {
      this.suppliers = response;
    });
  }

  onAdd() {
    const selectedMeters = this.meters.filter(el => el.isSelected);
    this.activeModal.close(selectedMeters);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

}

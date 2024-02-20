import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import {SupplyType} from '@models';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbDateFRParserFormatter} from '@app/shared/helper/ngb-date-fr-parser-formatter';
import { NotificationService } from '@app/shared/services';

@Component({
  selector: 'create-tariff',
  templateUrl: './tariff-create.component.html',
  styleUrls: ['./tariff-create.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class CreateTariffComponent {

  @Input() supplyTypes: SupplyType[] = [];
  @Input() buildingCategories: any[] = [];
  @Input() tariffs: any[] = [];
  @Input() closeOnSave = true;
  @Output() save = new EventEmitter();
  form: FormGroup;
  supplyType = SupplyType;
  supplyTypeText = {
    [SupplyType.Electricity]: 'Electricity',
    [SupplyType.Water]: 'Water',
    [SupplyType.Gas]: 'Gas',
    [SupplyType.Sewerage]: 'Sewerage',
    [SupplyType.AdHoc]: 'Ad Hoc'
  };

  constructor(public activeModal: NgbActiveModal,
              private formBuilder: FormBuilder,
              private notificationService: NotificationService,) {
    this.reset();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  reset() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      code: ['', [Validators.maxLength(255)]],
      supplyType: [-1, Validators.min(0)],
      buildingCategoriesIds: [[], Validators.required],
      versionDate: [null, Validators.required]
    });
  }

  onSave() {
    if (this.form.valid) {
      if (this.checkTariffName(this.form.value.name)) {
        this.notificationService.error('Tariff name should be unique!');
      } else {
        this.save.emit(this.form.value);
        if (this.closeOnSave) {
          this.activeModal.close(this.form.value);
        }
      }
    } else {
      this.form.markAsTouched();

      for (const controlName in this.form.controls) {
        (this.form.controls[controlName] as AbstractControl).markAsTouched();
      }
    }
  }

  onSupplyTypeChanged(event) {
    this.form.controls.supplyType.setValue(event);
  }

  onBuildingCategoriesChanged(event) {
    this.form.controls.buildingCategoriesIds.setValue(event);
  }

  checkTariffName(name: string): boolean {
    let res: boolean = false;
    this.tariffs.forEach(tariff => {
      if(tariff.entity.name.toLowerCase() == name.toLowerCase()) res = true;
    })
    return res;
  }
}

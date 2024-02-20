import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {KeyValue} from '@app/shared/models/key-value.model';
import {CostTariffSettingsService} from 'app/shared/services/cost-tariff-settings.service';

@Component({
  selector: 'cost-tariff',
  templateUrl: './cost-tariff.component.html',
  styleUrls: ['./cost-tariff.component.less']
})
export class CostTariffComponent implements OnInit {
  @Input() nodeForm;
  @Input() buildingPeriodIsFinalized: boolean;
  public registers: KeyValue[] = [];
  public form: FormGroup;

  @Output() save = new EventEmitter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private costTariffSettings: CostTariffSettingsService
  ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      costProviderFactor: [this.nodeForm.value.costProviderFactor, Validators.required],
      costProviderRegister: [this.nodeForm.value.costProviderRegister, Validators.required]
    });

    const supplyType = this.nodeForm.value.supplyType;
    this.registers = this.costTariffSettings.getRegistersBySupplyType(supplyType);
  }

  onSave() {
    this.save.emit(this.form.value);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

}

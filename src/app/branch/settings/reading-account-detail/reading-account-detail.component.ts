import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BranchSettingsService} from '@services';
import {BuildingViewModel} from '@models';
import {callFrequencyArray, callFrequencyText} from '../../../shared/models/automaticMeterReadingAccount.model';


@Component({
  selector: 'meter-reading-account-detail',
  templateUrl: './reading-account-detail.component.html',
  styleUrls: ['./reading-account-detail.component.less']
})
export class MeterReadingAccountDetailComponent implements OnInit {

  @Input() buildings: BuildingViewModel[];
  @Input() branchId: string;

  callFrequencyText = callFrequencyText;
  callFrequencyArray = callFrequencyArray;

  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private branchService: BranchSettingsService,
    public activeModal: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      subDomain: ['', Validators.required],
      userName: ['', Validators.required],
      password: ['', Validators.required],
      description: [''],
      callFrequency: [2],
      buildingIds: [[]]
    });
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  submit() {
    this.isSubmitted = true;
    if (this.form.valid)
      this.branchService.addAutomaticMeterReadingAccount(this.form.value, this.branchId).subscribe((amrAccount) => {
        this.activeModal.close(amrAccount);
      });
  }

  onCallFrequencyChanged(value: number) {
    this.form.controls.callFrequency.setValue(value);
  }

  getCallFrequency() {
    return callFrequencyArray.filter(item => item !== this.form.controls.callFrequency.value);
  }
}

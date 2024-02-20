import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IWizardComponent} from 'app/shared/wizard/IWizardComponent';
import {BuildingPeriodViewModel} from '../../../../shared/models/building-period.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgbDateParserFormatter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {getMonthYearName} from '../../../../meter-readings/building-periods/shared/helpers/date.helper';
import {NgbDateFRParserFormatter} from '@shared-helpers';
import {Subscription} from 'rxjs';
import {addMonths, convertDateToNgbDate, convertNgbDateToDate} from './../../../../../../../shared/helper/date-extension';

@Component({
  selector: 'manage-building-period',
  templateUrl: './manage-building-period.component.html',
  styleUrls: ['./manage-building-period.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class ManageBuildingPeriodComponent implements OnInit, IWizardComponent, OnDestroy {

  @Input()
  buildingPeriod: BuildingPeriodViewModel;

  @Output()
  save = new EventEmitter();
  @Output()
  next = new EventEmitter<number>();
  @Output()
  previous = new EventEmitter();
  @Output()
  updateBuildingPeriod = new EventEmitter<BuildingPeriodViewModel>();

  allowedPeriodNames: string[];
  private startDateSub: Subscription;

  constructor(private fb: FormBuilder) {
    // if(this.periodForm) {
    //   this.periodForm.get('startDate').valueChanges.subscribe(startDateVal => {
    //     startDateVal = convertNgbDateToDate(startDateVal);
    //     let endDateVal = convertDateToNgbDate(addDays(startDateVal, 31));
    //     this.periodForm.get('endDate').setValue(endDateVal);
    //   });
    // }
    
  }

  private _periodForm: FormGroup;

  get periodForm(): FormGroup {
    if (!this._periodForm) {
      this.createForm();
      this.setFormValues(this.buildingPeriod);
    }
    return this._periodForm;
  }

  set periodForm(form: FormGroup) {
    this._periodForm = form;
  }

  canNavigate(): boolean {
    return true;
  }

  ngOnInit(): void {
  }

  onNext() {
    this.updateBuildingPeriod.emit(this.getFormData());
    this.save.emit();
    this.next.emit();
  }

  onCancel() {
    this.previous.emit();
  }

  getFormData(): BuildingPeriodViewModel {
    return {
      ...this.buildingPeriod,
      name: this.periodForm.value.name,
      startDate: this.convertToUTCDate(this.periodForm.value.startDate),
      endDate: this.convertToUTCDate(this.periodForm.value.endDate),
      clientStatementName: this.periodForm.value.clientStatementName
    };
  }

  setFormValues(model: BuildingPeriodViewModel) {
    this.periodForm.controls.name.setValue(model.name);
    this.periodForm.controls.clientStatementName.setValue(model.clientStatementName);
    this.periodForm.controls.startDate.setValue(this.convertToDatepickerDate(model.startDate));
    this.periodForm.controls.endDate.setValue(this.convertToDatepickerDate(model.endDate));
  }

  createForm() {
    this.periodForm = this.fb.group({
      name: '',
      startDate: '',
      endDate: '',
      clientStatementName: ''
    });

    this.startDateSub = this.periodForm.controls.startDate.valueChanges.subscribe(value => this.onStartDateChanged(value));
  }

  onStartDateChanged(value: any) {
    this.updateAllowedPeriodNames(value);
    const MID_MONTH = 2;

    if (this.allowedPeriodNames.every(n => n !== this.periodForm.controls.name.value)) {
      this.periodForm.controls.name.setValue(this.allowedPeriodNames[MID_MONTH]);
    }

    if (this.allowedPeriodNames.every(n => n !== this.periodForm.controls.clientStatementName.value)) {
      this.periodForm.controls.clientStatementName.setValue(this.allowedPeriodNames[MID_MONTH]);
    }
  }

  updateAllowedPeriodNames(startDate: NgbDateStruct) {
    const date = new Date(startDate.year, startDate.month - 1, startDate.day);
    this.allowedPeriodNames = [];

    // from two previous month's to two next
    for (let i = -2; i <= 2; i++) {
      this.allowedPeriodNames.push(getMonthYearName(date, i));
    }
  }

  convertToUTCDate(value: any) {
    if (!value) {
      return '';
    }
    const jsDate = convertNgbDateToDate(value);
    return jsDate.toISOString();
  }

  convertToDatepickerDate(value: string) {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return {day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear()};
  }

  onChangeStartDate(event) {
    let startDateVal = convertNgbDateToDate(event);
    let endDateVal = convertDateToNgbDate(addMonths(startDateVal, 1));
    this.periodForm.get('endDate').setValue(endDateVal);
  }
  ngOnDestroy() {
    this.startDateSub && this.startDateSub.unsubscribe();
  }
}

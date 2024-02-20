import {Component, OnInit, Input} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {NgbActiveModal, NgbCalendar, NgbDateParserFormatter, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from 'app/shared/helper/ngb-date-fr-parser-formatter';
import * as state from '../../branch/buildings/manage-building/shared/store/state/common-data.state';
import * as selectors from '../../branch/buildings/manage-building/shared/store/selectors/common-data.selectors';
import {select, Store} from '@ngrx/store';
import {HistoryViewModel} from '@app/shared/models';
import {convertNgbDateToDate} from './../../shared/helper/date-extension';
import {BuildingPeriodViewModel} from '@app/branch/buildings/manage-building/shared/models/building-period.model';

@Component({
  selector: 'popup-register-change-version-reading',
  templateUrl: './popup-register-change-version-reading.component.html',
  styleUrls: ['./popup-register-change-version-reading.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})

export class PopupRegisterChangeVersionReadingComponent implements OnInit {
  @Input() registerId = "";
  @Input() meterId = "";
  form : FormGroup;
  isSubmitted = false;
  date: Date;
  comment = "";
  readingType = 1;
  selectedVersion: HistoryViewModel;
  buildingPeriod: BuildingPeriodViewModel;
  buildingPeriodStartDateStr: string;
  buildingPeriodEndDateStr: string;
  ngbMinDateStr: object;
  ngbMaxDateStr: object;
  formErrors = {
    'comment': "",
    'date': ""
  };

  validationMessages = {
    'comment': {
      'required': "Comment is required",
    },
    'date': {
      'required': "Date is required, and must be in the current building period.",
    },
  };

  constructor(
    public activeModal: NgbActiveModal,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private store$: Store<state.State>) {
  }

  ngOnInit() {
    this.store$.pipe(select(selectors.getSelectedHistoryLog)).subscribe(version =>
      this.selectedVersion = ((version) as HistoryViewModel));

    this.store$.pipe(select(selectors.getActiveBuildingPeriod)).subscribe(bp =>
      this.buildingPeriod = ((bp) as BuildingPeriodViewModel));
    this.buildingPeriodStartDateStr = this.formatBuildingDate(this.buildingPeriod.startDate.split("T")[0]);
    this.buildingPeriodEndDateStr = this.formatBuildingDate(this.buildingPeriod.endDate.split("T")[0]);
    this.ngbMinDateStr = this.formatNgbDatePickerDate(this.buildingPeriodStartDateStr);
    this.ngbMaxDateStr = this.formatNgbDatePickerDate(this.buildingPeriodEndDateStr);
    this.form = this.formBuilder.group({
      comment: ["Register Change Detected - Create Reading Date and Enter Reading/s", Validators.required],
      date: [{ value: this.ngbMinDateStr, disabled: false }, Validators.required],
      actionType: 1,
      readingType: 1,
      registerId: this.registerId
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  close() {

    if (!this.form.valid) {
      this.isSubmitted = true;
      this.onValueFormChange();
      return;
    }

    const date = this.form.value.date;
    const response = {
      comment: this.form.value.comment,
      date: date ? convertNgbDateToDate(date) : null,
      actionType: this.form.value.actionType,
      readingType: this.form.value.readingType,
      registerId: this.registerId
    };

    this.activeModal.close(response);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  changeReadingType(event) {
    if (event.target.id === "actual")
      this.readingType = 1;
    else {
      this.readingType = 0;
    }
  }

  onValueFormChange(data?: any) {
    if (!this.form) {
      console.log(data);
      return;
    }
    const form = this.form;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = "";
        const control = form.get(field);

        if ((control && control.dirty && !control.valid) || (control && !control.valid && this.isSubmitted)) {
          const message = this.validationMessages[field];

          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] = message[key];
            }
          }
        }
      }
    }
  }

  private formatBuildingDate(dateStr: string) {
    const response = dateStr.substr(8, 2) + "/" + dateStr.substr(5, 2) + "/" + dateStr.substr(0,4);
    return response;
  }
  
  private formatNgbDatePickerDate(dateStr: string) {
    const nYear = Number(dateStr.substr(6, 4));
    const nMonth = Number(dateStr.substr(3, 2));
    const nDay = Number(dateStr.substr(0, 2));
    return {year: nYear, month: nMonth, day: nDay};
  }
}

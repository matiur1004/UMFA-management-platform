import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbCalendar, NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from 'app/shared/helper/ngb-date-fr-parser-formatter';
import * as state from '../../branch/buildings/manage-building/shared/store/state/common-data.state';
import * as selectors from '../../branch/buildings/manage-building/shared/store/selectors/common-data.selectors';
import {select, Store} from '@ngrx/store';
import {HistoryViewModel} from '@app/shared/models';
import { PopupCommentSameVersionComponent } from './popup.comment-same-version/popup.comment-same-version.component';
import {convertDateToNgbDate, convertNgbDateToDate} from './../../shared/helper/date-extension';
import { DateOfPicker } from '@app/shared/pipes/date-for-datepicker.pipe';


@Component({
  selector: 'popup-comment',
  templateUrl: './popup.comment.component.html',
  styleUrls: ['./popup.comment.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})

export class PopupCommentComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  date: Date;
  comment = '';
  selectedVersion: HistoryViewModel;
  versionList: HistoryViewModel[];
  
  formErrors = {
    'comment': '',
    'date': ''
  };

  validationMessages = {
    'comment': {
      'required': 'Comment is required',
    },
    'date': {
      'required': 'Date is required',
    },
  };

  minDate: DateOfPicker;
  maxDate: DateOfPicker;
  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private calendar: NgbCalendar,
    private formBuilder: FormBuilder,
    private readonly store$: Store<state.State>) {
  }

  ngOnInit() {
    this.store$.pipe(select(selectors.getSelectedHistoryLog)).subscribe(version =>
      this.selectedVersion = version);
    
    this.store$.pipe(select(selectors.getHistoryLogs)).subscribe((versionList: HistoryViewModel[]) => {
      this.versionList = versionList;
    });

    this.form = this.formBuilder.group({
      comment: [this.comment, Validators.required],
      date: [{value: this.formatDate(this.date), disabled: true}, Validators.required],
      actionType: [2]
    });
    this.store$.pipe(select(selectors.getActiveBuildingPeriod)).subscribe(period => {
      this.minDate = convertDateToNgbDate(period.startDate);
      this.maxDate = convertDateToNgbDate(period.endDate);
      this.form.patchValue({
        date: convertDateToNgbDate(period.startDate)
      })
    });
    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
    this.form.get('date').valueChanges.subscribe(res => {
      let versionDate = convertNgbDateToDate(res);
      if(versionDate.getTime() == new Date(this.selectedVersion.startDate).getTime()) {
        this.form.get('actionType').setValue(2);
        const modalRef = this.modalService.open(PopupCommentSameVersionComponent, {
          backdrop: "static",
          windowClass: "comment-modal same-version"
        });
        modalRef.componentInstance.type = 'CurrentVersion';

      } else {
        if(this.versionList.find((version: HistoryViewModel) => new Date(version.startDate).getTime() == versionDate.getTime())) {
          this.form.get('actionType').setValue(2);
          const modalRef = this.modalService.open(PopupCommentSameVersionComponent, {
            backdrop: "static",
            windowClass: "comment-modal same-version"
          });
          modalRef.componentInstance.type = 'ExistingVersion';
        }
      }
      console.log(new Date(this.selectedVersion.startDate));
    });
    this.form.get('actionType').valueChanges.subscribe(actionType => {
      if(actionType == 1) this.form.get('date').setValue(this.formatDate(new Date()));
    })
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
      actionType: this.form.value.actionType
    };

    this.activeModal.close(response);
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  onValueFormChange(data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;

    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        this.formErrors[field] = '';
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

  onActionTypeChange(actionType) {
    const actionTypeControl = this.form.controls['date'];

    if (actionType == 1) {
      actionTypeControl.enable();
    } else {
      actionTypeControl.disable();
    }
  }

  private formatDate(date: Date): { year: number, month: number, day: number } {
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }
}

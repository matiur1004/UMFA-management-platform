import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbActiveModal, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbDateFRParserFormatter} from 'app/shared/helper/ngb-date-fr-parser-formatter';
import {convertNgbDateToDate} from './../../shared/helper/date-extension';

@Component({
  selector: 'version-options',
  templateUrl: './version-options.component.html',
  styleUrls: ['./version-options.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class VersionOptionsComponent implements OnInit {
  @Input() date: Date = new Date();
  @Input() comment = '';

  @Output() cancelled = new EventEmitter();
  @Output() selected = new EventEmitter();


  form: FormGroup;
  showAllErrors = false;

  constructor(public activeModal: NgbActiveModal, private calendar: NgbCalendar, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      comment: [this.comment, Validators.required],
      date: [{value: this.formatDate(this.date), disabled: true}, Validators.required],
      actionType: [2]
    });
  }

  save() {

    if (!this.form.valid) {
      this.showAllErrors = true;
      return;
    }

    const date = this.form.value.date;
    const response = {
      comment: this.form.value.comment,
      versionDate: date ? convertNgbDateToDate(date) : null,
      action: this.form.value.actionType
    };

    this.selected.emit(response);
  }

  cancel() {
    this.cancelled.emit();
  }

  onActionTypeChange() {
    const actionType = this.form.controls['actionType'].value;
    const dateControl = this.form.controls['date'];

    if (actionType === 1) {
      dateControl.enable();
    } else {
      dateControl.disable();
    }
  }

  private formatDate(date: Date): { year: number, month: number, day: number } {
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }
}

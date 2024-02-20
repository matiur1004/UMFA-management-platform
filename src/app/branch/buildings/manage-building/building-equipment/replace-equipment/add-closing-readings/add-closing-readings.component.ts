import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArrayState, FormGroupState} from 'ngrx-forms';
import {NgbDateFRParserFormatter, ngbDateNgrxValueConverter} from '@shared-helpers';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {AddClosingReadingViewModel} from '@app/branch/buildings/manage-building/building-equipment/shared/models';

@Component({
  selector: 'add-closing-readings',
  templateUrl: './add-closing-readings.component.html',
  styleUrls: ['./add-closing-readings.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AddClosingReadingsComponent implements OnInit {

  @Input() form: FormGroupState<any>;
  @Input() registerFiles: any;

  @Output() editNote = new EventEmitter();
  @Output() changeRegisterFile = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() nextStep = new EventEmitter();

  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;

  date = new Date();

  constructor() {
  }

  get readings() {
    return this.form.controls.readings as FormArrayState<AddClosingReadingViewModel[]>;
  }

  ngOnInit() {
  }

  trackById(index, item) {
    return index;
  }

}

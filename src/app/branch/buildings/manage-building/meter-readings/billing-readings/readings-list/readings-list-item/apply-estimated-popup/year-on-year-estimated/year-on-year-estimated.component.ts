import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MeterRegisterYearBasedEstimateViewModel} from '../../../../shared/models/meter-register-daily-estimate.model';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'year-on-year-estimated',
  templateUrl: './year-on-year-estimated.component.html',
  styleUrls: ['./../apply-estimated-popup.component.less']
})

export class YearOnYearEstimatedComponent implements OnInit {
  @Input() estimate: MeterRegisterYearBasedEstimateViewModel;
  @Input() formGroup: FormGroup;

  @Output() estimateSelected = new EventEmitter<string>();
  selectedEstimate = '';

  constructor() {
  }

  selectEstimate(selectedEstimatedValue: string) {
    this.estimateSelected.emit(selectedEstimatedValue);
    this.selectedEstimate = selectedEstimatedValue;
  }

  ngOnInit() {
  }
}

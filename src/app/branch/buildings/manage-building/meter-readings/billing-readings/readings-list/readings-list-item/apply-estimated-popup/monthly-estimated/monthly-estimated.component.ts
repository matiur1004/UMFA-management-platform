import {MeterRegisterMonthlyBasedEstimateViewModel} from './../../../../shared/models/meter-register-daily-estimate.model';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'monthly-estimated',
  templateUrl: './monthly-estimated.component.html',
  styleUrls: ['./../apply-estimated-popup.component.less', './monthly-estimated.component.less']
})

export class MonthlyEstimatedComponent implements OnInit {
  @Input() estimate: MeterRegisterMonthlyBasedEstimateViewModel;
  @Input() selectedPeriods: string[];
  @Input() formGroup: FormGroup;

  @Output() selectedPeriodsAmountChange = new EventEmitter<number>();
  @Output() selectedPeriodsChange = new EventEmitter<string[]>();
  periods = [];

  constructor() {
  }

  ngOnInit() {
    this.periods = this.estimate.periods.map(t => ({...t, ellipsizedPeriodName: `${t.periodName.substring(0, 5)}...`}));
  }
}

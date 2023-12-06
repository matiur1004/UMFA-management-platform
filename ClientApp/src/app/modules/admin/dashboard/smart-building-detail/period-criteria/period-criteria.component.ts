import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-period-criteria',
  templateUrl: './period-criteria.component.html',
  styleUrls: ['./period-criteria.component.scss']
})
export class PeriodCriteriaComponent implements OnInit {

  @Input() type: string;
  
  periodItems = [
    {label: 'Day', value: 'Day'},
    {label: 'Week', value: 'Week'},
    {label: 'Month', value: 'Month'},
    {label: 'Year', value: 'Year'},
  ];

  selectedPeriod = 'Week';

  startDate: Date;
  endDate: Date;

  currentWeek;
  currentMonth;
  currentDay;
  currentYear;

  constructor() { }

  ngOnInit(): void {
    this.currentWeek = moment().week();    
    this.currentMonth = moment().month();
    this.currentDay = moment().toDate();
    this.currentYear = moment().year();
    this.setPeriod();
    // console.log(moment().week(48).startOf('isoWeek'));
    // console.log(moment().month(9).startOf('month'));
  }

  valueChanged(event) {
    this.selectedPeriod = event.value;
    this.setPeriod();
  }

  prev() {
    if(this.selectedPeriod == 'Week') {
      this.currentWeek--;
      this.setPeriod();
    } else if(this.selectedPeriod == 'Day') {
      this.currentDay = moment(this.currentDay).subtract(1, 'days').toDate();
      this.setPeriod();
    } else if(this.selectedPeriod == 'Month') {
      this.currentMonth--;
      if(this.currentMonth == -1) this.currentMonth = 11;
      this.setPeriod();
    }
  }

  next() {
    if(this.selectedPeriod == 'Week') {
      this.currentWeek++;
      this.setPeriod();
    } else if(this.selectedPeriod == 'Day') {
      this.currentDay = moment(this.currentDay).add(1, 'days').toDate();
      this.setPeriod();
    } else if(this.selectedPeriod == 'Month') {
      this.currentMonth++;
      if(this.currentMonth == 12) this.currentMonth = 0;
      this.setPeriod();
    }
  }

  setPeriod() {
    if(this.selectedPeriod == 'Week') {
      this.startDate = moment().week(this.currentWeek).startOf('isoWeek').toDate();
      this.endDate = moment().week(this.currentWeek).endOf('isoWeek').toDate();
    } else if(this.selectedPeriod == 'Day') {
      this.startDate = this.currentDay;
      this.endDate = this.currentDay;
    } else if(this.selectedPeriod == 'Month') {
      this.startDate = moment().year(this.currentYear).month(this.currentMonth).startOf('month').toDate();
      this.startDate = moment().year(this.currentYear).month(this.currentMonth).endOf('month').toDate();
    }
  }
}

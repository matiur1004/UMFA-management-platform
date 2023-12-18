import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-period-criteria',
  templateUrl: './period-criteria.component.html',
  styleUrls: ['./period-criteria.component.scss']
})
export class PeriodCriteriaComponent implements OnInit {

  @Input() type: string;
  
  @Output() dateRangeChangedEvent: EventEmitter<any> = new EventEmitter<any>();
  
  periodItems = [
    {label: 'Day', value: 'Day'},
    {label: 'Week', value: 'Week'},
    {label: 'Month', value: 'Month'},
    {label: 'Year', value: 'Year'},
  ];

  selectedPeriod = 'Month';

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
    //this.setPeriod();
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
      if(this.currentMonth == -1) {this.currentMonth = 11; this.currentYear--;}
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
      if(this.currentMonth == 12) { this.currentMonth = 0; this.currentYear++;}
      this.setPeriod();
    }
  }

  setPeriod() {
    if(this.selectedPeriod == 'Week') {
      this.startDate = moment().week(this.currentWeek).startOf('isoWeek').toDate();
      this.endDate = moment().week(this.currentWeek).endOf('isoWeek').toDate();
    } else if(this.selectedPeriod == 'Day') {
      this.startDate = moment(this.currentDay).hour(1).minute(0).second(0).toDate();
      this.endDate = moment(this.currentDay).add('1', 'day').hour(1).minute(0).second(0).toDate();
    } else if(this.selectedPeriod == 'Month') {
      this.startDate = moment().year(this.currentYear).month(this.currentMonth).startOf('month').toDate();
      this.endDate = moment().year(this.currentYear).month(this.currentMonth).endOf('month').toDate();
    } else if(this.selectedPeriod == 'Year') {
      this.startDate = moment().year(this.currentYear).startOf('year').toDate();
      this.endDate = moment().year(this.currentYear).endOf('year').toDate();
    }
    if(this.selectedPeriod == 'Day') {
      this.dateRangeChangedEvent.emit({startDate: this.startDate.toUTCString(), endDate: this.endDate.toUTCString(), periodType: this.getPeriodType()})
    } else {
      this.dateRangeChangedEvent.emit({startDate: this.startDate.toDateString(), endDate: this.endDate.toDateString(), periodType: this.getPeriodType()})
    }
    
  }

  getPeriodType() {    
    if(this.selectedPeriod == 'Day') return 1;
    if(this.selectedPeriod == 'Week') return 2;
    if(this.selectedPeriod == 'Month') return 3;
    if(this.selectedPeriod == 'Year') return 4;
    return 0;
  }
}

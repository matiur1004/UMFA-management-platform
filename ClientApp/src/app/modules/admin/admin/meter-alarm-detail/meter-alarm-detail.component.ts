import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meter-alarm-detail',
  templateUrl: './meter-alarm-detail.component.html',
  styleUrls: ['./meter-alarm-detail.component.scss']
})
export class MeterAlarmDetailComponent implements OnInit {

  minutues = [];
  constructor() { }

  ngOnInit(): void {
    for(let i = 1; i <= 60; i++) {
      this.minutues.push({Value: i});
    } 
  }

  onApply() {
    
  }
}

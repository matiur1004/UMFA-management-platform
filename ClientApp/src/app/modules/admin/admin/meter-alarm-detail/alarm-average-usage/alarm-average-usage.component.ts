import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alarm-average-usage',
  templateUrl: './alarm-average-usage.component.html',
  styleUrls: ['./alarm-average-usage.component.scss']
})
export class AlarmAverageUsageComponent implements OnInit {

  minutues = [];

  constructor() { }

  ngOnInit(): void {
    for(let i = 1; i <= 60; i++) {
      this.minutues.push({Value: i});
    }
  }

  onAlarmConfigAverageUsage() {
    
  }

  getAlarmAnalyzeAverageUsage() {
    
  }
}

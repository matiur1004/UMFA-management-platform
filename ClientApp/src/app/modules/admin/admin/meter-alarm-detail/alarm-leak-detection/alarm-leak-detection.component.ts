import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alarm-leak-detection',
  templateUrl: './alarm-leak-detection.component.html',
  styleUrls: ['./alarm-leak-detection.component.scss']
})
export class AlarmLeakDetectionComponent implements OnInit {

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

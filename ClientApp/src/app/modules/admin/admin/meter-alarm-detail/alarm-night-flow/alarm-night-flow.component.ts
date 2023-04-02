import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alarm-night-flow',
  templateUrl: './alarm-night-flow.component.html',
  styleUrls: ['./alarm-night-flow.component.scss']
})
export class AlarmNightFlowComponent implements OnInit {

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

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'search-result-statistic',
  templateUrl: './search-result-statistic.component.html',
  styleUrls: ['./search-result-statistic.component.less']
})
export class SearchResultStatisticComponent implements OnInit {
  @Input() count: number = 0;
  @Input() addedNodes: string[] = [];

  constructor() {
  }

  ngOnInit() {
  }

  onAddNode() {

  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReplaceMeterNodeViewModel} from '../../shared/models/replace-meter-node.model';
import {NodeType} from '../../shared/models';

@Component({
  selector: 'node-tariff',
  templateUrl: './node-tariff.component.html',
  styleUrls: ['./node-tariff.component.less']
})
export class ReplaceNodeTariffComponent implements OnInit {

  @Input() nodes: ReplaceMeterNodeViewModel[];
  @Input() tariffs: any;

  @Output() updateTariff = new EventEmitter();
  @Output() toggleLineItemIsActive = new EventEmitter();
  @Output() updateLineItemCategory = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() nextStep = new EventEmitter();

  nodeType = NodeType;

  constructor() {
  }

  ngOnInit() {
  }

  trackById(index, item) {
    return index;
  }
}

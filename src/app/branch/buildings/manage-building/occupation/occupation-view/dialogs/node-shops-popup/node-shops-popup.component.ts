import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ShopNodeDetails} from '@models';

@Component({
  selector: 'node-shops-popup',
  templateUrl: './node-shops-popup.component.html',
  styleUrls: ['./node-shops-popup.component.less']
})
export class NodeShopsPopupComponent implements OnInit {

  @Input() nodes: ShopNodeDetails;
  @Output() goToNodeDetail = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  onNodeItemClick(nodeId: string) {
    this.goToNodeDetail.emit(nodeId);
  }
}

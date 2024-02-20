import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OrderVersion} from '@models';

@Component({
  selector: 'tariff-versions-list',
  templateUrl: './tariff-versions-list.component.html',
  styleUrls: ['./tariff-versions-list.component.less']
})

export class TariffVersionsListComponent {

  @Input() title: string;
  @Input() tariffVersions: any[];
  @Input() orderIndex: number;

  @Output() changeOrderIndex = new EventEmitter();
  @Output() addNewVersion = new EventEmitter();
  @Output() editVersion = new EventEmitter();
  @Output() deleteVersion = new EventEmitter();
  orderType = OrderVersion;
}

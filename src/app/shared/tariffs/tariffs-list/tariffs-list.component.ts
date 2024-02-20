import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OrderTariffList} from '@models';

@Component({
  selector: 'tariffs-list',
  templateUrl: './tariffs-list.component.html',
  styleUrls: ['./tariffs-list.component.less']
})
export class TariffsListComponent implements OnInit {

  @Input() tariffs: any[];
  @Input() orderIndex: number;

  @Output() orderChanged = new EventEmitter();
  @Output() editTariff = new EventEmitter();
  @Output() editTariffValue = new EventEmitter();
  @Output() addNewTariffValue = new EventEmitter();
  @Output() addNewTariffVersion = new EventEmitter();
  @Output() deleteTariff = new EventEmitter();

  orderType = OrderTariffList;

  ngOnInit() {
  }
}

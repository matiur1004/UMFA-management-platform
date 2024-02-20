import {Component, Input, OnInit} from '@angular/core';
import {NodeDetailViewModel} from '../../../shared/models';

@Component({
  selector: 'stistic-data-panel',
  templateUrl: './stistic-data-panel.component.html',
  styleUrls: ['./stistic-data-panel.component.less']
})
export class StisticDataPanelComponent implements OnInit {
  public allocatedNodes = 0;
  public allocatedUnits = 0;
  public allocatedTariffs = 0;
  private model: NodeDetailViewModel[];

  constructor() {
  }

  @Input('nodes') set nodes(value: NodeDetailViewModel[]) {
    if (value) {
      this.model = value;
      this.ngAfterContentChecked();
    }
  }

  ngOnInit() {
  }

  ngAfterContentChecked() {
    if (this.model) {
      this.allocatedNodes = this.model.length;
      this.allocatedTariffs = 0;
      this.model.forEach(el => {
        this.allocatedTariffs += el.tariffs.length;
      });
      this.allocatedUnits = 0;
      this.model.forEach(el => {
        this.allocatedUnits += el.commonAreaIds.length;
        this.allocatedUnits += el.shopIds.length;
      });
    }
  }

}

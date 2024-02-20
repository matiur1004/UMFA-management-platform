import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'supply-type-icon',
  templateUrl: './supply-type-icon.component.html',
  styleUrls: ['./supply-type-icon.component.less'],
})
export class SupplyTypeIconComponent implements OnInit {
  @Input() type = '';
  @Input() label = true;
  @Input() size = 'l';

  public supplyTypeLabels = ['electricity', 'water', 'gas', 'sewerage', 'adHoc'];

  constructor() {
  }

  ngOnInit() {

  }
}

import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'package-supplier-detail',
  templateUrl: './package-supplier-detail.component.html',
  styleUrls: ['./package-supplier-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageSupplierDetailComponent implements OnInit {

  @Input() supplier: any;
  @Input() recommendedPrice: any;
  @Input() percentPrice: number = 0;
  @Input() supplyType: number;
  @Input() displayOptions: any;
  @Input() highlightPrices: boolean = false;


  @Output() applyRecomPrice = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  trackByIndex(index) {
    return index;
  }

}

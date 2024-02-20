import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'package-info-popup',
  templateUrl: './package-info-popup.component.html',
  styleUrls: ['./package-info-popup.component.less']
})
export class PackageInfoPopupComponent implements OnInit {

  @Input() services: any;
  @Input() total: number;

  constructor() {
  }

  ngOnInit() {
  }
}

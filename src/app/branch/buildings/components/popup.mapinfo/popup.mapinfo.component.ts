import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

import {BuildingViewModel} from '@models';

@Component({
  selector: 'popup-mapinfo',
  templateUrl: './popup.mapinfo.component.html',
  styleUrls: ['./popup.mapinfo.component.less']
})
export class PopupMapinfoComponent implements OnInit {
  redirectToView: any;
  redirectToEdit: any;
  @Input() model: BuildingViewModel;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.redirectToView = this.sanitizer.bypassSecurityTrustUrl("javascript:window.openBuilding('" + this.model.id + "')");
    this.redirectToEdit = this.sanitizer.bypassSecurityTrustUrl("javascript:window.openBuilding('" + this.model.id + '/edit' + "')");
  }

}

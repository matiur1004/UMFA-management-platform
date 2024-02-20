import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-popup-external-link',
  templateUrl: './popup.external.link.component.html',
  styleUrls: ['./popup.external.link.component.less']
})
export class PopupExternalLinkComponent implements OnInit {

  @Input() label: string;
  @Input() value: string;

  constructor() {
  }

  ngOnInit() {
  }

}

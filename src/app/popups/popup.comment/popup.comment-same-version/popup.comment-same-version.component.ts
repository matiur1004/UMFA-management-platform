import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'popup-comment-same-version',
  templateUrl: './popup.comment-same-version.component.html',
  styleUrls: ['./popup.comment-same-version.component.less']
})
export class PopupCommentSameVersionComponent implements OnInit {
  @Input() public type;
  
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}

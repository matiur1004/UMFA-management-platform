import {Component, OnInit} from '@angular/core';
import {Dictionary} from '@models';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-common-area-relations',
  templateUrl: './common-area-relations.component.html',
  styleUrls: ['./common-area-relations.component.less']
})
export class CommonAreaRelationsComponent implements OnInit {

  relatedObjectNames: Dictionary<string[]>;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  onConfirm() {
    this.activeModal.close();
  }

  onCancel() {
    this.activeModal.dismiss();
  }
}

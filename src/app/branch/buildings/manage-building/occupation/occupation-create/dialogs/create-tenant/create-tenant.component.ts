import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'create-tenant',
  templateUrl: './create-tenant.component.html',
  styleUrls: ['./create-tenant.component.less']
})
export class CreateTenantComponent implements OnInit {
  tenantModelName = '';
  isSubmit = false;

  constructor(private activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.activeModal.close();
  }

  onSave() {
    this.activeModal.close(this.tenantModelName);
  }
}

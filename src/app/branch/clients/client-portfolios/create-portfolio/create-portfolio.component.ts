import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ClinetPortfolioViewModel} from '../../shared/clinet-portfolio.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClientService} from '../../shared/client.service';

@Component({
  selector: 'create-portfolio',
  templateUrl: './create-portfolio.component.html',
  styleUrls: ['./create-portfolio.component.less'],
  providers: [ClientService]
})
export class CreatePortfolioComponent implements OnInit {

  @Input() model: ClinetPortfolioViewModel;
  isNew: boolean;

  clientId: string;

  form: FormGroup;
  isSubmitted: boolean = false;

  formErrors = {
    "name": ''
  }

  validationMessages = {
    "name": {
      "required": "Name is required",
    },
  }
  file: any;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private clientService: ClientService) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      id: [this.model.id],
      name: [this.model.name, Validators.required],
      logo: [null],
      clientId: [this.clientId]
    })
  }

  onSave() {
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.onValueFormChange();
      return;
    }

    if (this.isNew) {
      this.clientService.createPortfolio(this.clientId, this.form.value).subscribe((response) => {
        this.activeModal.close(true);
      });
    } else {
      this.clientService.updatePortfolio(this.clientId, this.model.id, this.form.value).subscribe((response) => {
        this.activeModal.close(true);
      });
    }

  }

  onClose() {
    this.activeModal.close();
  }

  logoChanged(file) {
    this.form.controls["logo"].setValue(file);
  }

  onValueFormChange(data?: any) {
    if (!this.form) return;
    let form = this.form;

    for (let field in this.formErrors) {
      this.formErrors[field] = "";
      let control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && this.isSubmitted && !control.valid)) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }
}

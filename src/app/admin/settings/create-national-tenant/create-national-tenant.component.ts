import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NationalTenantsService} from '@services';
import {FileExtension} from 'app/shared/helper/file-extension';
import {CreateNationalTenantViewModel} from '@models';

@Component({
  selector: 'create-national-tenant',
  templateUrl: './create-national-tenant.component.html',
  styleUrls: ['./create-national-tenant.component.less']
})
export class CreateNationalTenantComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean = false;
  logoStatusLabel: string = "Upload Logo";
  dataUrl: string;
  defaultUrl: string = "assets/images/upload-file/upload-image.svg";

  constructor(private formBuilder: FormBuilder, private nationalTenantService: NationalTenantsService, public activeModal: NgbActiveModal, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.dataUrl = this.defaultUrl;
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      dataUrl: [this.defaultUrl, this.requireImageFileType]
    });
  }

  close() {
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }

  submit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      let logoFile = null;
      if (this.dataUrl !== this.defaultUrl) {
        logoFile = FileExtension.dataURLtoFile(this.dataUrl, 'image.png');
      }
      let model = <CreateNationalTenantViewModel>{
        name: this.form.value.name,
        description: this.form.value.description,
        logo: logoFile
      }
      this.nationalTenantService.create(model).subscribe((nationalTenant) => {
        this.activeModal.close(nationalTenant);
      });
    }
  }

  fileChangeEvent(event: any) {
    let file = event;
    if (file) {
      var fr = new FileReader();
      fr.onload = () => {
        this.dataUrl = fr.result as string;
      };
      fr.readAsDataURL(file);
      this.form.get('dataUrl').setValue(file);
      this.logoStatusLabel = "Uploaded";
    }
  }

  requireImageFileType = (control: FormControl) => {
    const file = control.value;
    if (file && file !== this.defaultUrl) {
      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
        return null;
      } else {
        return true;
      }
    }
    return null;
  };


  onError(event) {
    this.dataUrl = this.defaultUrl;
  }

}

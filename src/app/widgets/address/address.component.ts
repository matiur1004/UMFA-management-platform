import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import {AddressViewModel} from '@models';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressComponent),
      multi: true
    }
  ],
  animations: [
    trigger('addressHidden', [
      state('true', style({
        height: '38px'
      })),
      state('false', style({
        height: '*'
      })),
      transition('true => false', animate('250ms ease-in-out')),
      transition('false => true', animate('250ms ease-in-out'))
    ])
  ]
})
export class AddressComponent implements OnInit, OnDestroy, ControlValueAccessor, OnChanges {

  @Input() isSubmitted = false;
  @Input() name = 'Address';
  @Input() validationNotify: Subject<any>;
  @Output() formSubmit = new EventEmitter<Event>();
  @ViewChild('addressLineElement', {static: true}) addressLineElement: any;
  collapsed = true;
  addressLine = '';
  form: FormGroup;
  initialForm: any;
  validationSubscription: Subscription;
  formErrors = {
    'line1': '',
    'line2': '',
    'city': '',
    'code': '',
    'country': '',
    'description': ''
  };
  validationMessages = {
    'line1': {
      'required': 'Line 1 is required',
    },
    'line2': {
      'required': 'Line 2 is required',
    },
    'city': {
      'required': 'City is required',
    },
    'code': {
      'required': 'Code is required',
    },
    'country': {
      'required': 'Country is required',
    },
    'description': {
      'required': 'Description is required',
    },
  };

  constructor(private formBuilder: FormBuilder) {
  }

  propagateChange = (_: any) => {
  }

  ngOnInit() {
    if (this.validationNotify) {
      this.validationSubscription = this.validationNotify.subscribe((value) => {
        if (!this.form.valid) {
          this.collapsed = false;
          this.onValueFormChange();
        }
      });
    }
  }

  writeValue(obj: AddressViewModel): void {
    this.initialForm = obj;
    if (obj != null) {
      this.form = this.buildAddressForm(obj);
      this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
      this.addressLineElement.nativeElement.setAttribute('value', this.getAddressLine());
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  setDisabledState?(isDisabled: boolean): void {

  }

  validate(c: FormControl) {
    return this.form.valid ? null : {
      invalid: true
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onValueFormChange();
  }

  onValueFormChange(data?: any) {
    if (!this.form) {
      return;
    }
    this.propagateChange(this.form.value);
    const form = this.form;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && this.isSubmitted && !control.valid)) {
        const message = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  buildAddressForm(addressData: AddressViewModel) {
    const form = this.formBuilder.group({
      id: [addressData.id],
      line1: [addressData.line1, Validators.required],
      line2: [addressData.line2],
      suburb: [addressData.suburb],
      city: [addressData.city, Validators.required],
      code: [addressData.code, Validators.required],
      province: [addressData.province],
      country: [addressData.country, Validators.required],
      description: [addressData.description, Validators.required]
    });
    return form;
  }

  addressLineFocus(event) {
    this.collapsed = false;
  }

  addressChanged(event: Event) {
    this.onValueFormChange();
  }

  save(event) {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.addressChanged(event);
      this.formSubmit.emit(event);
      this.collapsed = true;
      this.addressLineElement.nativeElement.setAttribute('value', this.getAddressLine());
      this.initialForm = this.form.value;
    } else {
      this.onValueFormChange();
    }
  }

  close(event) {
    this.form = this.buildAddressForm(this.initialForm);
    this.collapsed = true;
    this.addressLineElement.nativeElement.setAttribute('value', this.getAddressLine());
    this.onValueFormChange();
  }

  ngOnDestroy() {
    if (this.validationSubscription) {
      this.validationSubscription.unsubscribe();
    }
  }

  private getAddressLine(): string {
    const value = this.form.value;
    const addressLine = [
      value.description,
      value.line1,
      value.line2,
      value.suburb,
      value.city,
      value.province,
      value.country
    ].reduce((acc, str) => str ? acc + str + ', ' : acc, '');

    return addressLine.substring(0, addressLine.length - 2);
  }
}

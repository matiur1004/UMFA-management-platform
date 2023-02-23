import { Directive, Input } from "@angular/core";
import {
  Validator,
  ValidationErrors,
  FormGroup,
  NG_VALIDATORS
} from "@angular/forms";
import { PasswordMatchValidator } from "./password-match.validator";
@Directive({
  selector: "[passwordMatchValidator]",
  providers: [
    { provide: NG_VALIDATORS, useExisting: PasswordMatchDirective, multi: true }
  ]
})
export class PasswordMatchDirective implements Validator {
  @Input("passwordMatchValidator") fields: string[] = [];
  
  validate(formGroup: FormGroup): ValidationErrors {
    return PasswordMatchValidator(this.fields[0], this.fields[1])(
      formGroup
    );
  }
}
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function PasswordCheckValidator( pwd: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    if(control.value == pwd) return null;
    return { check: true };
  };
}

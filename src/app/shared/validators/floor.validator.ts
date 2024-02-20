import {AbstractControl, ValidatorFn} from '@angular/forms';

export function floorValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {

    const pattern = /^(?!-0(\.0+)?$)-?(0|[1-9]\d*)(\.\d+)?$/i;
    const valid =
      control.value == null ||
      pattern.test(control.value);

    return valid ? null : {valid: true};
  };
}

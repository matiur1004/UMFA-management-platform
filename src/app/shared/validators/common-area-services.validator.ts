import {AbstractControl, ValidatorFn} from '@angular/forms';

export function commonAreaServicesValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {

    const electricity = control.get('electricity');
    const water = control.get('water');
    const sewerage = control.get('sewerage');
    const gas = control.get('gas');
    const other = control.get('other');
    return electricity.value || water.value || sewerage.value || gas.value || other.value ? null : {empty: true};
  };
}

export const servicesValidator = (control: AbstractControl) => {
  const electricity = control.get('electricity');
  const water = control.get('water');
  const sewerage = control.get('sewerage');
  const gas = control.get('gas');
  const other = control.get('other');
  return electricity.value || water.value || sewerage.value || gas.value || other.value ? null : {empty: true};
};

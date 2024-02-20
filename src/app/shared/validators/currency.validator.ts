interface ValidationErrors {
  greaterThanAndLessThan?: any;
}

export const currencyValidator = (value: number): ValidationErrors => {

  const maxValue = 100000000;

  if (value == null)
    value = 0;

  const decimalRegex = /^\d+(\.\d+)?$/;

  return value.toString() == "" || (value <= maxValue && decimalRegex.test(value.toString())) ? null : {
    greaterThanAndLessThan: 'Should be between 0 and ' + maxValue
  };
}

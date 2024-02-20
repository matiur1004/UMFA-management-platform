import createNumberMask from 'text-mask-addons/dist/createNumberMask';

const defaultNumberOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: false,
  thousandsSeparatorSymbol: ',',
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 2,
  integerLimit: null,
  requireDecimal: false,
  allowNegative: false,
  allowLeadingZeroes: false
};

export const numberMask = (options: any = {}) => {
  return createNumberMask({...defaultNumberOptions, ...options});
};

export const ratioMask = (rawValue = '') => {
  const separator = '/';
  const nonDigitsRegExp = /\D+/g;
  const sanitize = str =>
    str.replace(nonDigitsRegExp, '').replace(/^0+([^0]*)/, '$1');
  const toMask: (string) => (string | RegExp)[] = str =>
    Array.from(str).map((v, ind) => {
      if (ind === 0) {
        return /[1-9]/;
      }
      return /\d/;
    });

  const separatorIndex = rawValue.indexOf(separator);
  const firstPart = sanitize(
    rawValue.slice(0, separatorIndex > 0 ? separatorIndex : rawValue.length)
  );
  const secondPart =
    separatorIndex > 0
      ? sanitize(rawValue.slice(separatorIndex + 1, rawValue.length))
      : '';

  let result = toMask(firstPart);
  if (separatorIndex > 0) {
    result.push(separator);
  }
  if (secondPart.length) {
    result = result.concat(toMask(secondPart));
  }

  return result;
};

export const ratioPlaceholderMask = (ratioName: string) => {
  if (!ratioName) {
    return '';
  }
  let result: string;
  switch (ratioName.toLowerCase()) {
    case 'ct ratio':
      result = '5/5';
      break;
    case 'pt ratio':
      result = '1/1';
      break;
    default:
      result = '';
      break;
  }
  return result;
}

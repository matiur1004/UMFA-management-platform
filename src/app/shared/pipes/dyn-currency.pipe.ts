import {Pipe, PipeTransform} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Pipe({
  name: 'dynCurrency'
})
export class DynCurrencyPipe extends CurrencyPipe implements PipeTransform {

  transform(value: any, currencyCode: string, display: boolean, digitsInfo: string): any {

    if (value == null || isNaN(value))
      value = 0.00;

    const currencyFormat = super.transform(value, currencyCode, display, digitsInfo);
    const firstDigit = currencyFormat.search(/\d/);

    return currencyFormat.substring(0, firstDigit) + ' ' + currencyFormat.substr(firstDigit);
  }

}

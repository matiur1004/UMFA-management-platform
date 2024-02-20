import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'pluralWord'
})
export class PluralWordPipe implements PipeTransform {

  transform(value: string): string {
    value = (value.slice(-1) == 's') ? value + 'es' : value + 's';
    return value;
  }

}

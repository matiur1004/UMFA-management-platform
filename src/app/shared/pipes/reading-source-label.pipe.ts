import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'readingSourceLabel'
})
export class ReadingSourceLabelPipe implements PipeTransform {
  private readingSourceTypes = ['ManualCapture', 'Import', 'Estimate', 'Reset', 'AmrImport', 'MobileApp', 'ManualCapture'];

  transform(value: number): any {
    if (value !== null && value !== undefined) {
      return this.readingSourceTypes[value];
    } else {
      return 'N/A';
    }
  }
}

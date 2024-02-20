import {Pipe, PipeTransform} from '@angular/core';
import {ReadingSource, ReadingSourceText} from '@models';
import {ReadingStatus} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';

@Pipe({
  name: 'readingStatus'
})
export class ReadingStatusPipe implements PipeTransform {

  readingSource = ReadingSource;

  transform(value: boolean, readingSource: number): string {
    let status = '';

    if (!value && readingSource != this.readingSource['Estimate']) {
      status = ReadingSourceText[ReadingStatus.Unconfirmed];
    } else if (value && readingSource != this.readingSource['Estimate']) {
      status = ReadingSourceText[ReadingStatus.Confirmed];
    } else {
      status = ReadingSourceText[ReadingStatus.Estimated];
    }

    return status;
  }

}

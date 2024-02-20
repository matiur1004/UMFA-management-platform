import {Pipe, PipeTransform} from '@angular/core';
import {ReadingStatus} from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/models';
import {ReadingSourceText} from '@models';

@Pipe({
  name: 'readingStatusText'
})
export class ReadingStatusTextPipe implements PipeTransform {

  transform(status: ReadingStatus): string {
    return ReadingSourceText[status];
  }

}

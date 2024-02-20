import {Pipe, PipeTransform} from '@angular/core';

import {
  ReadingFileInfoType,
  ReadingFileInfoViewModel
} from '../../branch/buildings/manage-building/meter-readings/billing-readings/shared/models/readings-history.model';

@Pipe({
  name: 'readingFileInfoFileType'
})
export class ReadingFileInfoFileTypePipe implements PipeTransform {
  transform(filesInfo: ReadingFileInfoViewModel[], type: ReadingFileInfoType, excluded: string[] = []): ReadingFileInfoViewModel[] {
    return filesInfo ?
      filesInfo.filter(item => item.type === type && !excluded.some(e => e === item.id)) :
      [];
  }
}

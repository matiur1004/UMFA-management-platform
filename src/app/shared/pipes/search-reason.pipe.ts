import {Pipe, PipeTransform} from '@angular/core';
import {OptionViewModel} from '@app/shared/models/option-view.model';

@Pipe({
  name: 'searchReason'
})
export class SearchReasonPipe implements PipeTransform {

  transform(reasons: OptionViewModel[], searchReasonId: string): OptionViewModel {
    return (reasons || []).find(r => r.id === searchReasonId);
  }

}

import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {MeterViewModel, ReadingsHistoryViewModel,} from './../../../shared/models/readings-history.model';

@Component({
  selector: 'reading-details-popup-title',
  templateUrl: './reading-details-popup-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ReadingDetailsPopupTitleComponent {
  @Input() readingDetails: ReadingsHistoryViewModel;
  @Input() meter: MeterViewModel;
  @Input() popupWarning: string;
}

import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'warning-info',
  templateUrl: './warning-info.component.html',
  styleUrls: ['./warning-info.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarningInfoComponent {

  @Input() value: number;

  constructor() {
  }


}

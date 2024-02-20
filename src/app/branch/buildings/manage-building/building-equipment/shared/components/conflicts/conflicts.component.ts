import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";
import {ApprovalInfoViewModel} from '../../models/node-allocated-tariff.model';

@Component({
  selector: 'conflicts',
  templateUrl: './conflicts.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ConflictsComponent {
  @Input() approvalInfo: ApprovalInfoViewModel;
  @Input() isTariff = true;

  @Output() edit: EventEmitter<Event> = new EventEmitter<Event>();
}

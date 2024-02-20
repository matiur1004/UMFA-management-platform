import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SupplieViewModel, UserViewModel} from '../../shared/models';
import {LocationViewModel} from '@models';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from '@shared-helpers';

@Component({
  selector: 'equipment-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationComponent implements OnInit {

  @Input() locationForm: any;
  @Input() locations: LocationViewModel[];
  @Input() supplies: SupplieViewModel[];
  @Input() locationTypes: string[];
  @Input() technicians: UserViewModel[];

  @Output() locationChange = new EventEmitter();
  @Output() supplieChange = new EventEmitter();
  @Output() locationTypeChange = new EventEmitter();
  @Output() testingDateChange = new EventEmitter();
  @Output() technicianChange = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() createLocation = new EventEmitter();


  @Output() nextStep = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

}

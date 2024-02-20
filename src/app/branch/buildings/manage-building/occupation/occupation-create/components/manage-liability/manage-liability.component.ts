import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IWizardComponent} from 'app/shared/wizard/IWizardComponent';
import {NgbNavChangeEvent, NgbNav} from '@ng-bootstrap/ng-bootstrap';

import {CommonAreaLiabilityViewModel, LiabilityViewModel} from '@models';

@Component({
  selector: 'manage-liability',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-liability.component.html',
  styleUrls: ['./manage-liability.component.less']
})
export class ManageLiabilityComponent implements OnInit, IWizardComponent {

  @Input() commonAreaLiablities: CommonAreaLiabilityViewModel[];
  @Input() selectedCommonAreaLiablity: CommonAreaLiabilityViewModel;
  @Input() selectedCommonAreaLiablityServiceType: string;
  @Input() selectedCommonAreaLiablityService: LiabilityViewModel;
  @Input() liabilityShopFilterBy: number;
  @Input() liabilityShopSearchTerm: string;

  @Output() ownerLiabilityChanged = new EventEmitter();
  @Output() includeNotLiableShopsChanged = new EventEmitter();
  @Output() includeVacantShopSqMChanged = new EventEmitter();
  @Output() updateSplit = new EventEmitter();
  @Output() defaultSettingsChanged = new EventEmitter();

  @Output() updateShopAllocation = new EventEmitter();
  @Output() updateShopLiability = new EventEmitter();

  @Output() commonAreaLiabilityChange = new EventEmitter();
  @Output() commonAreaLiabilityServiceTypeChange = new EventEmitter();
  @Output() changeStep = new EventEmitter();

  @Output() updateShopFilter = new EventEmitter();
  @Output() updateShopTermSearch = new EventEmitter();

  @Output() next = new EventEmitter<number>();
  @Output() previous = new EventEmitter();
  @Output() save = new EventEmitter();

  @ViewChild("nav") tabs: NgbNav;

  constructor() {
  }

  ngOnInit() {
    this.setDefaultTab();
  }

  setDefaultTab() {
    if (!this.selectedCommonAreaLiablity)
      return;

    let services = this.selectedCommonAreaLiablity.commonArea.services;
    if (services.isElectricityEnable) {
      this.selectedCommonAreaLiablityServiceType = '0';
    } else if (services.isWaterEnable) {
      this.selectedCommonAreaLiablityServiceType = '1';
    } else if (services.isGasEnable) {
      this.selectedCommonAreaLiablityServiceType = '2';
    } else if (services.isSewerageEnable) {
      this.selectedCommonAreaLiablityServiceType = '3';
    } else if (services.isOtherEnable) {
      this.selectedCommonAreaLiablityServiceType = '4';
    }
  }

  canNavigate(): boolean {
    return true;
  }

  onNext() {
    this.save.emit();
    this.next.emit();
  }

  public beforeChange($event: NgbNavChangeEvent) {
    this.commonAreaLiabilityServiceTypeChange.emit(+$event.nextId);
    $event.preventDefault();
  }

  onCommonAreaLiabilityChange(idx) {
    this.commonAreaLiabilityChange.emit(idx);
  }
}

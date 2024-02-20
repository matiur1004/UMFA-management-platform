import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'new-tariff-version',
  templateUrl: './new-tariff-version.component.html',
  styleUrls: ['./new-tariff-version.component.less']
})
export class NewTariffVersionComponent {
  @Input() majorVersion: number;
  @Input() minorVersion: number;
  @Input() versionDate: Date;
  @Input() isSubVersion: boolean;

  constructor(public activeModal: NgbActiveModal) {
  }

  get version(): string {
    return this.isSubVersion ? `${this.majorVersion}.${this.minorVersion}` : this.majorVersion.toString();
  }

  create(): void {
    this.activeModal.close(true);
  }

  dismiss(): void {
    this.activeModal.close(false);
  }
}

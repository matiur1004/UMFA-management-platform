import {NodeSetsViewModel} from './../../../building-equipment/shared/models/node.model';
import {NodeTariffsPopupMode, NodeTariffsPopupResult} from '../../enums/node-tariffs-popup.enum';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'node-tariffs-popup',
  templateUrl: './node-tariffs-popup.component.html',
  styleUrls: ['./node-tariffs-popup.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeTariffsPopup {
  @Input() mode: NodeTariffsPopupMode = NodeTariffsPopupMode.NewTariffVersionsWithChoice;

  @Input() nodeSetsWithConflicts: NodeSetsViewModel[] = [];

  buildingTariffsPopupMode = NodeTariffsPopupMode;

  constructor(
    private activeModal: NgbActiveModal
  ) {
  }

  public get isNewTariffVersionsMode(): boolean {
    return this.mode === NodeTariffsPopupMode.NewTariffVersionsWithChoice ||
      this.mode === NodeTariffsPopupMode.NewTariffVersionsWithoutChoice ||
      this.mode === NodeTariffsPopupMode.NewTariffVersionsInfo;
  }

  public get isInfoOnlyMode(): boolean {
    return this.mode === NodeTariffsPopupMode.NewTariffVersionsInfo;
  }

  public applyNewNodeTariffVersions(): void {
    this.activeModal.close(NodeTariffsPopupResult.ApplyNewTariffVersions);
  }

  public keepOldNodeTariffVersions(): void {
    this.activeModal.close(NodeTariffsPopupResult.KeepExistingTariffVersions);
  }

  public resolveConflicts(): void {
    this.activeModal.close(NodeTariffsPopupResult.ResolveConflicts);
  }

  public close(): void {
    this.activeModal.dismiss();
  }
}

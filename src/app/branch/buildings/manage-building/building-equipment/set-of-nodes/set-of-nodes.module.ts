import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';

import {PageCreateNodeSetComponent} from './page-create-node-set/page-create-node-set.component';
import {PageEditNodeSetComponent} from './page-edit-node-set/page-edit-node-set.component';
import {TableNodesEditComponent} from './components/table-nodes-edit/table-nodes-edit.component';
import {NodeNotePopupComponent} from './components/node-note-popup/node-note-popup.component';
import {StisticDataPanelComponent} from './components/stistic-data-panel/stistic-data-panel.component';
import {SearchResultStatisticComponent} from './components/search-result-statistic/search-result-statistic.component';
import {SetFormComponent} from './components/set-form/set-form.component';

import {DialogSelectNodesComponent} from './dialogs/dialog-select-nodes/dialog-select-nodes.component';
import {SelectNodesBindDialogDirective} from './dialogs/select-nodes-bind-dialog.directive';
import {TableNodeItemViewComponent} from './components/table-nodes-view/table-nodes-view.component';
import {TariffSelectorListPipe} from './pipes/tariff-selector-list.pipe';
import {LineItemCategoryDetailsPipe} from './pipes/line-item-category-details.pipe';
import {SupplierService} from 'app/branch/suppliers/shared/services';
import {NodeBillingStatusPipe} from './pipes/node-billing-status.pipe';
import {PopupModule} from '../../meter-readings/popups/popup.module';
import {DirectivesModule} from 'app/shared/directives/directives.module';
import {BuildingSharedModule} from 'app/branch/buildings/shared/building-shared.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {FilterNodesPipe} from './pipes/filter-nodes.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    RouterModule.forChild([]),
    WidgetsModule,
    DunamisInputsModule,
    PipesModule,
    PopupModule,
    DirectivesModule,
    BuildingSharedModule
  ],
  exports: [RouterModule],
  providers: [SupplierService, DatePipe],
  declarations: [
    PageCreateNodeSetComponent,
    PageEditNodeSetComponent,
    SetFormComponent,
    TableNodesEditComponent,
    NodeNotePopupComponent,
    StisticDataPanelComponent,
    SearchResultStatisticComponent,
    DialogSelectNodesComponent,
    SelectNodesBindDialogDirective,
    TableNodeItemViewComponent,
    TariffSelectorListPipe,
    LineItemCategoryDetailsPipe,
    NodeBillingStatusPipe,
    FilterNodesPipe
  ],
  // entryComponents: [
  //   DialogSelectNodesComponent
  // ]
})
export class SetOfNodesModule {
}

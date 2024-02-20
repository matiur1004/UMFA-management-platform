import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EquipmentGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/equipment.guard';
import {VirtualRegistersEffect} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/virtual-registers.effect';
import {ViewEquipmentComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/view-equipment.component';
import {TableAssignedMetersComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/components/table-assigned-meters/table-assigned-meters.component';
import {CreateVirtualRegisterComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/pages/create-virtual-register/create-virtual-register.component';
import {VirtualRegistersDetailsGuard} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/shared/guards/virtual-registers-details.guard';
import {PopupCreateVirtualRegisterComponent} from '@app/popups/popup.create-virtual-register/popup.create-virtual-register.component';
import {NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {TextMaskModule} from 'angular2-text-mask';
import {ApplyResultPopupModule} from '@app/popups/apply-result-popup/apply-result-popup.module';
import {ConfirmDialogModule} from '@app/popups/confirm-dialog/confirm-dialog.module';
import {PopupConfirmDeleteModule} from '@app/popups/popup-confirm-delete/popup-confirm-delete.module';
import {PopupCommentModule} from '@app/popups/popup.comment/shared/popup-comment.module';
import {DirectivesModule} from '@app/shared/directives/directives.module';
import {PipesModule} from '@app/shared/pipes/pipes.module';
import {DunamisInputsModule} from '@app/widgets/inputs/shared/dunamis-inputs.module';
import {WidgetsModule} from '@app/widgets/module/widgets.module';
import {NgrxFormsModule} from 'ngrx-forms';
import {PopupModule} from '@app/branch/buildings/manage-building/meter-readings/popups/popup.module';
import {EquipmentTreeEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/equipment-tree.effects';
import {EquipmentEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/equipment.effects';
import {ReplaceNodeTariffComponent} from '@app/branch/buildings/manage-building/building-equipment/replace-equipment/node-tariff/node-tariff.component';
import {LocationEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/location-form.effects';
import {RegistersAndReadingsStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/bulk-equipment-wizard-effects/registers-and-readings-step.effects';
import {TariffsPerNodesComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/allocated-tariffs/tariffs-per-nodes/tariffs-per-nodes.component';
import {ChangeStatusComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/allocated-tariffs/tariffs-per-nodes/change-status/change-status.component';
import {CalculateProportionPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/calculate-proportion.pipe';
import {EquipmentTemplateListComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/equipment-template-list/equipment-template-list.component';
import {AllocBulkEquipToShopComponent} from '@app/branch/buildings/manage-building/building-equipment/create-bulk-equipment/alloc-bulk-equip-to-shop/alloc-bulk-equip-to-shop.component';
import {DialogAddUnitComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/dialog-add-unit/dialog-add-unit.component';
import {BuildingEquipmentComponent} from '@app/branch/buildings/manage-building/building-equipment/page-building-equipment/building-equipment.component';
import {DiscountPopupComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/discount-popup/discount-popup.component';
import {UnitTypePipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/unit-type.pipe';
import {EquipmentNodesComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/equipment-nodes/equipment-nodes.component';
import {LocationComponent} from '@app/branch/buildings/manage-building/building-equipment/create-equipment/location/location.component';
import {SetCustomAttributeBindDialogDirective} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/set-custom-attribute-bind-dialog.directive';
import {ReplaceEquipmentStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/replace-equipment-wizard-effects/replace-equipment-step-effects';
import {LocationDetailsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/location-details/location-details.component';
import {SetupStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/bulk-equipment-wizard-effects/setup-step.effects';
import {CalcFactorComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/allocated-equipment/calc-factor-modal/calc-factor.component';
import {ShopStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/shop-step.effects';
import {LocationEquipmentEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/location-equipment.effects';
import {BulkWizardEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/bulk-equipment-wizard-effects/bulk-wizard.effects';
import {AllocEquipToShopComponent} from '@app/branch/buildings/manage-building/building-equipment/create-equipment/alloc-equip-to-shop/alloc-equip-to-shop.component';
import {RegistersAndReadingsComponent} from '@app/branch/buildings/manage-building/building-equipment/create-bulk-equipment/registers-and-readings/registers-and-readings.component';
import {PageVirtualRegisterComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/pages/page-virtual-register/page-virtual-register.component';
import {CalculationsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/calculations/calculations.component';
import {ReplaceWizardEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/replace-equipment-wizard-effects/replace-wizard-effects';
import {AllocatedUnitsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/allocated-units/allocated-units.component';
import {RemoveDialogComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/equipment-details/remove-dialog/remove-dialog.component';
import {AddLocationComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/locations-list/add-location/add-location.component';
import {LocationEquipmentService} from '@app/branch/buildings/manage-building/building-equipment/shared/location-equipment.service';
import {UnitsOfMeasurementGuard} from '@app/branch/buildings/manage-building/shared/guards/units-of-measurement.guard';
import {AttributesStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/bulk-equipment-wizard-effects/attributes-step.effects';
import {SortUnitsPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/sort-units.pipe';
import {CostTariffComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/cost-tariff/cost-tariff.component';
import {SetOfNodesListComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/set-of-nodes-list/set-of-nodes-list.component';
import {EquipmentTreeModule} from '@app/branch/buildings/manage-building/building-equipment/equipment-tree/equipment-tree.module';
import {AttributesGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/attributes.guard';
import {AddMetersComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/add-meters/add-meters.component';
import {CostsAllocationComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/costs-allocation/costs-allocation.component';
import {WizardEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/wizard.effects';
import {BuildingSharedModule} from '@app/branch/buildings/shared/building-shared.module';
import {TotalVacantUnitsPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/total-vacant-units.pipe';
import {BuildingEquipmentTemplateService} from '@app/branch/buildings/manage-building/building-equipment/shared/building-equipment-template.service';
import {LocationsListComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/locations-list/locations-list.component';
import {NodeEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/node.effects';
import {SetupEquipmentBulkComponent} from '@app/branch/buildings/manage-building/building-equipment/create-bulk-equipment/setup-equipment-bulk/setup-equipment-bulk.component';
import {EquipmentWizardPopupComponent} from '@app/branch/buildings/manage-building/building-equipment/create-bulk-equipment/shared/components/equipment-wizard-popup/equipment-wizard-popup.component';
import {DialogSelectMetersComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/dialog-select-meters/dialog-select-meters.component';
import {CustomAttributesFormComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/custom-attributes-form/custom-attributes-form.component';
import {SelectUnitsBindDialogDirective} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/select-units-bind-dialog.directive';
import {NodeSetsEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/node-sets.effects';
import {CreateBulkEquipmentComponent} from '@app/branch/buildings/manage-building/building-equipment/create-bulk-equipment/create-bulk-equipment.component';
import {ReplaceEquipmentComponent} from '@app/branch/buildings/manage-building/building-equipment/replace-equipment/replace-equipment.component';
import {SingleMeterNodeEquipment} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/single-meter-node-equipment/single-meter-node-equipment.component';
import {SortNodeUnitsPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/sort-node-units.pipe';
import {NodeDetailsGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/node-details.guard';
import {NodeService} from '@app/branch/buildings/manage-building/building-equipment/shared/node.service';
import {SignalMeterFormComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/components/signal-meter-form/signal-meter-form.component';
import {ShopsStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/bulk-equipment-wizard-effects/shops-step.effects';
import {NodeSetsService} from '@app/branch/buildings/manage-building/building-equipment/shared/node-sets.service';
import {ReplaceEquipAttributesComponent} from '@app/branch/buildings/manage-building/building-equipment/replace-equipment/equipment-attributes/equipment-attributes.component';
import {LocationStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/location-step.effects';
import {BuildingServicesService} from '@app/branch/buildings/building-services/shared/building-services.service';
import {EquipmentAttributesComponent} from '@app/branch/buildings/manage-building/building-equipment/create-equipment/equipment-attributes/equipment-attributes.component';
import {AddClosingReadingsStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/replace-equipment-wizard-effects/add-closing-readings-step-effects';
import {DialogSetCustomAttributeComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/dialog-set-custom-attribute/dialog-set-custom-attribute.component';
import {AddClosingReadingsComponent} from '@app/branch/buildings/manage-building/building-equipment/replace-equipment/add-closing-readings/add-closing-readings.component';
import {MeterService} from '@app/branch/buildings/manage-building/building-equipment/shared/meter.service';
import {AddNodeComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/add-node/add-node.component';
import {FilterUnitsShowingPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/filter-units-showing.pipe';
import {SetOfNodesModule} from '@app/branch/buildings/manage-building/building-equipment/set-of-nodes/set-of-nodes.module';
import {TotalRegistersUnitsPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/total-registers-units.pipe';
import {TotalShopsUnitsPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/total-shops-units.pipe';
import {EquipmentStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/equipment-step.effects';
import {RegistersGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/registers.guard';
import {CommonService} from '@app/branch/buildings/manage-building/building-equipment/shared/common.service';
import {EquipmentDetailsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/equipment-details/equipment-details.component';
import {LocationService} from '@app/branch/buildings/manage-building/building-equipment/shared/location.service';
import {FilterCostUnitsShowingPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/filter-cost-units-showing.pipe';
import {NodeDetailsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/node-details.component';
import {BuildingEquipmentTemplateEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/building-equipment-template.effects';
import {BuildingEquipmentService} from '@app/branch/buildings/manage-building/building-equipment/shared/building-equipment.service';
import {DialogSelectUnitsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/dialog-select-units/dialog-select-units.component';
import {SelectMetersBindDialogDirective} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/dialogs/select-meters-bind-dialog.directive';
import {ReplaceNodeTariffStepEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/replace-equipment-wizard-effects/replace-node-tariff-step-effects';
import {TotalLiableUnitsPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/total-liable-units.pipe';
import {BulkEquipmentAttributesComponent} from '@app/branch/buildings/manage-building/building-equipment/create-bulk-equipment/bulk-equipment-attributes/bulk-equipment-attributes.component';
import {TariffsPerMetersComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/allocated-tariffs/tariffs-per-meters/tariffs-per-meters.component';
import {TotalAreaUnitsPipe} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/pipes/total-area-units.pipe';
import {MeterTotalFormComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/virtual-registers/components/meter-total-form/meter-total-form.component';
import {SuppliesGuard} from '@app/branch/buildings/manage-building/building-equipment/shared/guards/supplies.guard';
import {metaReducers, reducers} from '@app/branch/buildings/manage-building/building-equipment/shared/store/reducers';
import {CreateEquipmentComponent} from '@app/branch/buildings/manage-building/building-equipment/create-equipment/create-equipment.component';
import {EquipmentListComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/equipment-list/equipment-list.component';
import {AllocatedEquipmentComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/allocated-equipment/allocated-equipment.component';
import {AllocatedTariffsComponent} from '@app/branch/buildings/manage-building/building-equipment/view-equipment/node-details/allocated-tariffs/allocated-tariffs.component';
import {NodeTariffVersionsEffects} from '@app/branch/buildings/manage-building/building-equipment/shared/store/effects/node-tariff-versions.effect';
import {FilterNodeDetailsPipe} from "./view-equipment/node-details/allocated-tariffs/tariffs-per-meters/pipes/filter-node-details.pipe";
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgSelectModule,
    WidgetsModule,
    NgrxFormsModule,
    DragDropModule,
    NgrxFormsModule,
    PopupModule,
    PipesModule,
    DunamisInputsModule,
    DirectivesModule,
    ApplyResultPopupModule,
    StoreModule.forFeature('buildingEquipment', reducers, {metaReducers}),
    EffectsModule.forFeature([WizardEffects, LocationEffects, EquipmentStepEffects,
      LocationStepEffects, BuildingEquipmentTemplateEffects, LocationEquipmentEffects,
      VirtualRegistersEffect,
      ShopStepEffects, NodeEffects, NodeSetsEffects, EquipmentEffects,
      BulkWizardEffects, SetupStepEffects, ShopsStepEffects,
      EquipmentTreeEffects, RegistersAndReadingsStepEffects, AttributesStepEffects,
      ReplaceWizardEffects, ReplaceEquipmentStepEffects, AddClosingReadingsStepEffects,
      ReplaceNodeTariffStepEffects, NodeTariffVersionsEffects]),
    SetOfNodesModule,
    PopupConfirmDeleteModule,
    ConfirmDialogModule,
    EquipmentTreeModule,
    PopupModule,
    PopupCommentModule,
    BuildingSharedModule,
    //TextMaskModule,
    NgxMaskModule
  ],
  providers: [
    BuildingEquipmentService,
    BuildingEquipmentTemplateService,
    LocationService,
    MeterService,
    BuildingServicesService,
    LocationEquipmentService,
    NodeService,
    VirtualRegistersDetailsGuard,
    CommonService,
    AttributesGuard,
    EquipmentGuard,
    RegistersGuard,
    NodeDetailsGuard,
    SuppliesGuard,
    NodeSetsService,
    UnitsOfMeasurementGuard
  ],
  declarations: [
    BuildingEquipmentComponent,
    CreateEquipmentComponent,
    EquipmentListComponent,
    EquipmentDetailsComponent,
    PopupCreateVirtualRegisterComponent,
    LocationsListComponent,
    LocationDetailsComponent,
    LocationComponent,
    ViewEquipmentComponent,
    EquipmentAttributesComponent,
    CreateVirtualRegisterComponent,
    TableAssignedMetersComponent,
    AllocEquipToShopComponent,
    EquipmentNodesComponent,
    NodeDetailsComponent,
    CustomAttributesFormComponent,
    SingleMeterNodeEquipment,
    SetOfNodesListComponent,
    AddLocationComponent,
    AddMetersComponent,
    EquipmentTemplateListComponent,
    AllocatedEquipmentComponent,
    AllocatedTariffsComponent,
    AllocatedUnitsComponent,
    CalculationsComponent,
    CostsAllocationComponent,
    CalcFactorComponent,
    TariffsPerNodesComponent,
    TariffsPerMetersComponent,
    ChangeStatusComponent,
    DiscountPopupComponent,
    CreateBulkEquipmentComponent,
    BulkEquipmentAttributesComponent,
    AllocBulkEquipToShopComponent,
    RegistersAndReadingsComponent,
    SetupEquipmentBulkComponent,
    EquipmentWizardPopupComponent,
    AddNodeComponent,
    ReplaceEquipAttributesComponent,
    ReplaceEquipmentComponent,
    ReplaceNodeTariffComponent,
    AddClosingReadingsComponent,
    SetCustomAttributeBindDialogDirective,
    DialogSetCustomAttributeComponent,
    SelectUnitsBindDialogDirective,
    DialogSelectUnitsComponent,
    SortUnitsPipe,
    FilterUnitsShowingPipe,
    DialogSelectMetersComponent,
    SelectMetersBindDialogDirective,
    TotalAreaUnitsPipe,
    TotalLiableUnitsPipe,
    TotalShopsUnitsPipe,
    CalculateProportionPipe,
    FilterCostUnitsShowingPipe,
    SortNodeUnitsPipe,
    TotalVacantUnitsPipe,
    CostTariffComponent,
    PageVirtualRegisterComponent,
    MeterTotalFormComponent,
    SignalMeterFormComponent,
    RemoveDialogComponent,
    UnitTypePipe,
    DialogAddUnitComponent,
    TotalRegistersUnitsPipe,
    FilterNodeDetailsPipe
  ],
  // entryComponents: [
  //   AddLocationComponent,
  //   AddNodeComponent,
  //   CalcFactorComponent,
  //   PopupCreateVirtualRegisterComponent,
  //   ChangeStatusComponent,
  //   DiscountPopupComponent,
  //   EquipmentWizardPopupComponent,
  //   ReplaceEquipmentComponent,
  //   DialogAddUnitComponent,
  //   DialogSetCustomAttributeComponent,
  //   DialogSelectUnitsComponent,
  //   DialogSelectMetersComponent,
  //   RemoveDialogComponent
  // ],
  exports: [
    MeterTotalFormComponent,
    SignalMeterFormComponent,
  ]
})
export class BuildingEquipmentModule {
}

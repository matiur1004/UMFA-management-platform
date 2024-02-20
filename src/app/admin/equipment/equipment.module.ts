import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NgrxFormsModule} from 'ngrx-forms';
import {NgSelectModule} from '@ng-select/ng-select';

import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';

import {EquipmentService} from '@services';
import {metaReducers, reducers} from './shared/store/reducers';
import {RegisterEffects} from './shared/store/effects/registers.effects';
import {EditAttributesEffects} from './shared/store/effects/edit-attributes.effects';
import {DirectivesModule} from '../../shared/directives/directives.module';

import {EquipmentRoutingModule} from './equipment-routing.module';

import {RegisterSettingsComponent} from './equipment-settings/equipment-registers/register-settings/register-settings.component';
import {EquipmentComponent} from './page-equipment/equipment.component';
import {EquipmentSettingsComponent} from './equipment-settings/equipment-settings.component';
import {ListSupplyTypesComponent} from './equipment-settings/equipment-supply-types/list-supply-types/list-supply-types.component';
import {ListRegistersComponent} from './equipment-settings/equipment-registers/list-registers/list-registers.component';
import {ListGroupsComponent} from './equipment-settings/equipment-groups/list-groups/list-groups.component';
import {ListBrandsComponent} from './equipment-settings/equipment-brands/list-brands/list-brands.component';
import {ListAttributesComponent} from './equipment-settings/equipment-attributes/list-attributes/list-attributes.component';
import {EditAttributesComponent} from './equipment-settings/equipment-attributes/edit-attributes/edit-attributes.component';
import {EditBrandsComponent} from './equipment-settings/equipment-brands/edit-brands/edit-brands.component';
import {EditGroupsComponent} from './equipment-settings/equipment-groups/edit-groups/edit-groups.component';
import {EditSupplyTypesComponent} from './equipment-settings/equipment-supply-types/edit-supply-types/edit-supply-types.component';
import {EquipmentListComponent} from './equipment-list/equipment-list.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {TextMaskModule} from 'angular2-text-mask';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {adminCommonGuards} from '../shared/common-data/guards';
import {ListReasonsComponent} from './equipment-settings/equipment-reason/list-reasons/list-reasons.component';
import {ReasonSettingsComponent} from './equipment-settings/equipment-reason/reason-settings/reason-settings.component';
import {ListObisCodesComponent} from './equipment-settings/equipment-obis-codes/list-obis-codes/list-obis-codes.component';
import {EditObiscodesComponent} from './equipment-settings/equipment-obis-codes/edit-obiscodes/edit-obiscodes.component';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgbNavModule,
    FormsModule,
    EquipmentRoutingModule,
    ReactiveFormsModule,
    WidgetsModule,
    NgSelectModule,
    StoreModule.forFeature('registers', reducers, {metaReducers}),
    EffectsModule.forFeature([RegisterEffects, EditAttributesEffects]),
    NgrxFormsModule,
    DirectivesModule,
    DunamisInputsModule,
    PipesModule,
    //TextMaskModule,
    NgxMaskModule,
    DragDropModule
  ],
  declarations: [
    EquipmentComponent,
    EquipmentSettingsComponent,
    ListSupplyTypesComponent,
    ListRegistersComponent,
    ListGroupsComponent,
    ListBrandsComponent,
    ListAttributesComponent,
    EditAttributesComponent,
    EditBrandsComponent,
    EditGroupsComponent,
    EditSupplyTypesComponent,
    EquipmentListComponent,
    CreateEquipmentComponent,
    RegisterSettingsComponent,
    ListReasonsComponent,
    ReasonSettingsComponent,
    ListObisCodesComponent,
    EditObiscodesComponent
  ],
  providers: [
    EquipmentService,
    ...adminCommonGuards
  ]
})

export class EquipmentModule {
}

import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {WidgetsModule} from "app/widgets/module/widgets.module";
import {PipesModule} from "app/shared/pipes/pipes.module";
import {DunamisInputsModule} from "app/widgets/inputs/shared/dunamis-inputs.module";

import {PopupBuildingCategoriesComponent} from "app/popups/popup.building.categories/popup.building.categories.component";

import {SettingsComponent} from "./page-settings/settings.component";
import {CreateNationalTenantComponent} from "./create-national-tenant/create-national-tenant.component";
import {NationalTenantTableComponent} from "./national-tenant-table/national-tenant-table.component";
import {SettingsService} from "./shared/settings.service";
import {DirectivesModule} from "../../shared/directives/directives.module";


export const adminSettingsRoutes: Routes = [
  {path: '', component: SettingsComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    WidgetsModule,
    PipesModule,
    DunamisInputsModule,
    DirectivesModule
  ],
  declarations: [
    SettingsComponent,
    CreateNationalTenantComponent,
    NationalTenantTableComponent,
    // TODO move popup to module
    PopupBuildingCategoriesComponent
  ],
  providers: [SettingsService],
  //entryComponents: [CreateNationalTenantComponent]
})
export class AdminSettingsModule {
}

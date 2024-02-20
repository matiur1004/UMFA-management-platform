import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgbModule, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";

import {WidgetsModule} from "app/widgets/module/widgets.module";
import {DunamisInputsModule} from "app/widgets/inputs/shared/dunamis-inputs.module";

import {ServicesRoutingModule} from "./services-routing.module";
import {McServicesModule} from "./mc-services/shared/modules/mc-services.module";
import {ServicesComponent} from "./page-services/services.component";
import {PackagesModule} from "./packages/shared/modules/packages.module";
import {McMeterTypesModule} from "./meter-types/shared/modules/meter-types.module";

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    NgbNavModule,
    FormsModule,
    ServicesRoutingModule,
    McServicesModule,
    PackagesModule,
    McMeterTypesModule,
    WidgetsModule,
    DunamisInputsModule
  ],
  declarations: [
    ServicesComponent
  ]
})

export class ServicesModule {
}

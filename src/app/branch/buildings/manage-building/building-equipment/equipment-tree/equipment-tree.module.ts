import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from '@ng-select/ng-select';
import {PipesModule} from "app/shared/pipes/pipes.module";

import {EquipmentTreeComponent} from "./components/equipment-tree/equipment-tree.component";
import {EquipmentsDiagrameComponent} from "./components/equipments-diagrame/equipments-diagrame.component";
import {FilterByLocationPipe} from "./pipes/filter-by-location.pipe";
import {MarkLikeHighlightedPipe} from "./pipes/mark-like-highlighted.pipe";
import {EquipmentsIconsGenerator} from "./equipments-icons-generator.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    PipesModule
  ],
  providers: [
    EquipmentsIconsGenerator
  ],
  declarations: [
    EquipmentTreeComponent,
    EquipmentsDiagrameComponent,
    FilterByLocationPipe,
    MarkLikeHighlightedPipe
  ],
  exports: [
    EquipmentTreeComponent
  ]
})
export class EquipmentTreeModule {
}

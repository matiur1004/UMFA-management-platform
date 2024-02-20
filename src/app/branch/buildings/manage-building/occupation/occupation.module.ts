import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OccupationViewModule} from './occupation-view/occupation-view.module';
import {OccupationCreateModule} from './occupation-create/occupation-create.module';

@NgModule({
  imports: [
    CommonModule,
    OccupationViewModule,
    OccupationCreateModule
  ]
})
export class OccupationModule {
}

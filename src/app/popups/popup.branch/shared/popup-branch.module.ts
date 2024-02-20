import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupBranchComponent} from '../popup.branch.component';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    WidgetsModule,
    PipesModule
  ],
  declarations: [PopupBranchComponent],
  exports: [PopupBranchComponent]
})
export class PopupBranchListModule {
}

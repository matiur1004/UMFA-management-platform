import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BranchLayoutRoutingModule} from './branch-layout-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {PopupBranchListModule} from 'app/popups/popup.branch/shared/popup-branch.module';
import {PopupSearchModule} from 'app/popups/popup.search/shared/popup-search.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {BranchLayoutComponent} from './layout/layout.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {BranchNavMenuComponent} from './nav-menu/nav-menu.component';
import {TopBarComponent} from './top-bar/top-bar.component';
import {PageBranchDetectComponent} from './page-branch-detect/page-branch-detect.component';
import {BranchesGuard} from './branches.guard';

@NgModule({
  imports: [
    CommonModule,
    BranchLayoutRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    PopupBranchListModule,
    PopupSearchModule,
    WidgetsModule,
    PipesModule,
    DunamisInputsModule
  ],
  declarations: [
    BranchLayoutComponent,
    DashboardComponent,
    BranchNavMenuComponent,
    TopBarComponent,
    PageBranchDetectComponent,
  ],
  providers: [
    BranchesGuard
  ]
})
export class BranchLayoutModule {
}

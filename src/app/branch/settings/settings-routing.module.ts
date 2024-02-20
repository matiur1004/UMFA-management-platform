import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BranchSettingsComponent} from './page-branch-settings/settings.component';

const routes: Routes = [
  {path: '', component: BranchSettingsComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchSettingsRoutingModule {
}

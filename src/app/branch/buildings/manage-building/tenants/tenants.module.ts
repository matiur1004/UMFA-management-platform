import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WidgetsModule} from '../../../../widgets/module/widgets.module';
import {PopupExternalLinkModule} from 'app/popups/popup.external.link/shared/popup-external-link.module';
import {PopupSocialListModule} from 'app/popups/popup.social.list/shared/popup-social-list.module';
import {PopupCreateTenantModule} from 'app/popups/popup.create.tenant/shared/popup-create-tenant.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {TenantsComponent} from './page-tenants/tenants.component';

export const tenantsRoutes: Routes = [
  {path: '', component: TenantsComponent}
];

@NgModule({
  declarations: [
    TenantsComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    WidgetsModule,
    DunamisInputsModule,
    NgSelectModule,
    PopupExternalLinkModule,
    PopupSocialListModule,
    PopupCreateTenantModule,
    RouterModule.forChild([]/*tenantsRoutes*/)
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class TenantsModule {
}

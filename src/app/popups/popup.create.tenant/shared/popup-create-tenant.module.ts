import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PopupCreateTenantComponent} from '../popup.create.tenant.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PopupExternalLinkModule} from 'app/popups/popup.external.link/shared/popup-external-link.module';
import {PopupSocialListModule} from 'app/popups/popup.social.list/shared/popup-social-list.module';
import {WidgetsModule} from '../../../widgets/module/widgets.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PopupExternalLinkModule,
    PopupSocialListModule,
    WidgetsModule,
    NgSelectModule,
    DunamisInputsModule
  ],
  declarations: [
    PopupCreateTenantComponent
  ],
  exports: [
    PopupCreateTenantComponent
  ],
  // entryComponents: [
  //   PopupCreateTenantComponent
  // ]
})
export class PopupCreateTenantModule {
}

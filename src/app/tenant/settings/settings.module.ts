import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {metaReducers, reducers} from '../store/reducers';
import {NgrxFormsModule} from 'ngrx-forms';

import {PipesModule} from 'app/shared/pipes/pipes.module';
import {DirectivesModule} from 'app/shared/directives/directives.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';

import {PageSettingsComponent} from './page-settings/page-settings.component';
import {UserGeneralInfoComponent} from './components/user-general-info/user-general-info.component';
import {UserPasswordComponent} from './components/user-password/user-password.component';

import {SettingsEffects} from './store/effects/settings.effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    WidgetsModule,
    PipesModule,
    DirectivesModule,
    NgrxFormsModule,
    StoreModule.forFeature('tenantUserSettings', reducers, {metaReducers}),
    EffectsModule.forFeature([SettingsEffects]),
    NgbNavModule,
    DunamisInputsModule
  ],
  providers: [
    //UserAccountService
  ],
  declarations: [
    PageSettingsComponent,
    UserGeneralInfoComponent,
    UserPasswordComponent
  ]
})
export class SettingsModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {SettingsComponent} from '../../settings.component';
import {SettingsRoutingModule} from '../modules/settings-routing.module';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {metaReducers, reducers} from '../store/reducers';
import {NgrxFormsModule} from 'ngrx-forms';

import {SettingsEffects} from '../store/effects/settings.effects';

import {ClientAccountService} from '../services/client-account.service';
import {UserAccountService} from '../../../../shared/services/user-account.service';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgSelectModule,
    WidgetsModule,
    PipesModule,
    NgrxFormsModule,
    StoreModule.forFeature('clientUserSettings', reducers, {metaReducers}),
    EffectsModule.forFeature([SettingsEffects]),
    SettingsRoutingModule,
    DunamisInputsModule
  ],
  providers: [
    ClientAccountService,
    UserAccountService
  ],
  declarations: [
    SettingsComponent,
  ],
})
export class SettingsModule {
}

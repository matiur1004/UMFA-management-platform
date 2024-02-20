import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {IconSpriteModule} from 'ng-svg-icon-sprite';
import {ToastrModule} from 'ngx-toastr';

import {AppRoutingModule} from './app-routing.module';

import {AuthenticationModule} from './login/auth.module';
import {GeneralModule} from './general/general.module';

import {AppComponent} from './app.component';
import {ProgressSpinnerComponent} from './widgets/progressSpinner/progress-spinner.component';
import {ServicesModule, UserAccountService} from '@services';
import {AuthGuard} from './shared/infrastructures/auth.guard';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {AdminAuthGuard} from 'app/shared/infrastructures/admin.auth.guard';
import {TenantAuthGuard} from 'app/shared/infrastructures/tenant.auth.guard';
import {ClientAuthGuard} from 'app/shared/infrastructures/client.auth.guard';
import {PermissionService} from 'app/shared/services/permission.service';
import {AdminAuthGuardService} from 'app/shared/infrastructures/admin.permission.auth.guard';
import {BranchAuthGuardService} from 'app/shared/infrastructures/branch.permission.auth.guard';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {NgrxFormsModule} from 'ngrx-forms';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {TextMaskModule} from 'angular2-text-mask';
import {DunamisInputsModule} from './widgets/inputs/shared/dunamis-inputs.module';
import {AudioPlayService} from './shared/services/audio-play.service';
import {metaReducers} from '@app/app.reducer';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    ProgressSpinnerComponent
  ],
  imports: [
    //BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IconSpriteModule,
    NgbModule,
    ToastrModule.forRoot({
      closeButton: true
    }),
    // LocalStorageModule.forRoot({
    //   prefix: 'dunamis',
    //   storageType: 'localStorage'
    // }),
    WidgetsModule,
    DunamisInputsModule,
    PipesModule,
    StoreModule.forRoot({}, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      }
    }),
    EffectsModule.forRoot([]),
    NgrxFormsModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    //TextMaskModule,
    GeneralModule,
    AuthenticationModule,
    AppRoutingModule,
    ServicesModule,
    //NgxSliderModule,
  ],
  exports: [
    ToastrModule,
  ],
  providers: [
    AuthGuard,
    AdminAuthGuard,
    TenantAuthGuard,
    ClientAuthGuard,
    PermissionService,
    AdminAuthGuardService,
    BranchAuthGuardService,
    UserAccountService,
    AudioPlayService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

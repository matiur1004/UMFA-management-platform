import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { appInitializer } from './core/helpers';
import { AuthService } from './core/auth/auth.service';
import { DXReportService } from './shared/services/dx-report-service';
import { SnackBarService } from './shared/services';
import { UmfaAdministratorAuthGuard } from '@shared/infrastructures/umfa-administrator.auth.guard';
import { UmfaOperatorAuthGuard } from '@shared/infrastructures/umfa-operator.auth.guard';
import {ToastrModule} from 'ngx-toastr';
import { ClientAdministratorAuthGuard } from '@shared/infrastructures/client-administrator.auth.guard';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        ToastrModule.forRoot({
            closeButton: true,
            preventDuplicates: true,
        }),
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService] },
        DXReportService,
        SnackBarService,
        UmfaOperatorAuthGuard,
        UmfaAdministratorAuthGuard,
        ClientAdministratorAuthGuard
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}

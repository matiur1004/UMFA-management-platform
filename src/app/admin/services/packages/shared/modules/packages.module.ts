import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PackageListComponent} from '../../package-list/package-list.component';
import {FormsModule} from '@angular/forms';
import {PackageDetailComponent} from '../../package-detail/package-detail.component';
import {PackageServiceService} from '../package-service.service';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {PackagesEffects} from 'app/admin/services/packages/shared/store/effects/packages.effects';
import {metaReducers, reducers} from 'app/admin/services/packages/shared/store/reducers';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ServiceTreeModule} from 'app/widgets/service-tree/shared/service-tree.module';
import {PriceInfoPopupComponent} from '../../package-detail/price-info-popup/price-info-popup.component';
import {PackageColorsComponent} from '../../package-detail/package-colors/package-colors.component';
import {NgrxFormsModule} from 'ngrx-forms';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {RouterModule} from '@angular/router';
import {PackageSupplierDetailComponent} from '../../package-detail/package-supplier-detail/package-supplier-detail.component';
import {MeterInfoPopupComponent} from '../../package-list/meter-info-popup/meter-info-popup.component';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {DirectivesModule} from 'app/shared/directives/directives.module';
import {NgSelectModule} from '@ng-select/ng-select';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SlickCarouselModule,
    StoreModule.forFeature('Packages', reducers, {metaReducers}),
    EffectsModule.forFeature([PackagesEffects]),
    WidgetsModule,
    NgrxFormsModule,
    NgbModule,
    ServiceTreeModule,
    PipesModule,
    RouterModule,
    DunamisInputsModule,
    DirectivesModule,
    NgbNavModule,
    NgSelectModule
  ],
  declarations: [
    PackageListComponent,
    PackageDetailComponent,
    PriceInfoPopupComponent,
    PackageColorsComponent,
    PackageSupplierDetailComponent,
    MeterInfoPopupComponent
  ],
  exports: [
    PackageListComponent
  ],
  providers: [
    PackageServiceService
  ],
  // entryComponents: [PackageColorsComponent]
})
export class PackagesModule {
}

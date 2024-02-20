import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PricePopupComponent} from '../service-price/price-popup/price-popup.component';
import {ServicePriceComponent} from '../service-price/service-price.component';
import {ServiceTreeComponent} from '../service-tree.component';
import {ServiceTreeItemComponent} from '../service-tree-item/service-tree-item.component';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CustomizePackageComponent} from '../customize-package/customize-package.component';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    NgbModule,
    WidgetsModule,
    DunamisInputsModule
  ],
  declarations: [
    PricePopupComponent,
    ServicePriceComponent,
    ServiceTreeComponent,
    ServiceTreeItemComponent,
    CustomizePackageComponent
  ],
  exports: [
    PricePopupComponent,
    ServicePriceComponent,
    ServiceTreeComponent,
    ServiceTreeItemComponent,
    CustomizePackageComponent
  ]
})
export class ServiceTreeModule {
}

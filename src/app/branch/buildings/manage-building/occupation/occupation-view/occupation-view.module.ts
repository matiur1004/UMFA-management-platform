import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {DirectivesModule} from 'app/shared/directives/directives.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {PopupShopHistoryModule} from 'app/popups/popup.shop.history/shared/popup-shop-history.module';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {NgxFileDropModule} from 'ngx-file-drop';


import * as fromFloorPlansServices from './components/view-floor-plans/floor-plan/services';
import {ViewOccupationComponent} from './page-view-occupation/view-occupation.component';
import {ViewShopsComponent} from './components/view-shops/view-shops.component';
import {ViewCommonAreasComponent} from './components/view-common-areas/view-common-areas.component';
import {ViewLiabilityComponent} from './components/view-liability/view-liability.component';
import {CommonAreaItemComponent} from './components/view-liability/common-area-item/common-area-item.component';
import {CommonAreaShopItemComponent} from './components/view-liability/common-area-shop-item/common-area-shop-item.component';
import {ShopItemComponent} from './components/view-liability/shop-item/shop-item.component';
import {CommonAreaLiablityViewComponent} from './dialogs/common-area-liablity-view/common-area-liablity-view.component';
import {ViewFloorPlansComponent} from './components/view-floor-plans/view-floor-plans.component';
import {FloorPlanComponent} from './components/view-floor-plans/floor-plan/floor-plan.component';
import {NodeItemComponent} from './components/view-liability/node-item/node-item.component';
import {NodeShopItemComponent} from './components/view-liability/node-shop-item/node-shop-item.component';
import {NodeShopsPopupComponent} from './dialogs/node-shops-popup/node-shops-popup.component';
import {TariffItemComponent} from './components/tariff-item/tariff-item.component';
import {ShopHelper} from '../shared/helpers/shop.helper';
import {LiabilityTabComponent} from './components/liability-tab/liability-tab.component';
import {CommonAreaRelationsComponent} from './dialogs/common-area-relations/common-area-relations.component';
import {PipesModule} from '@app/shared/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    NgbModule,
    WidgetsModule,
    PopupShopHistoryModule,
    NgSelectModule,
    DirectivesModule,
    DunamisInputsModule,
    DragDropModule,
    PipesModule
  ],
  declarations: [
    ViewOccupationComponent,
    ViewShopsComponent,
    ViewCommonAreasComponent,
    ViewLiabilityComponent,
    CommonAreaItemComponent,
    CommonAreaShopItemComponent,
    ShopItemComponent,
    CommonAreaLiablityViewComponent,
    ViewFloorPlansComponent,
    FloorPlanComponent,
    NodeItemComponent,
    NodeShopItemComponent,
    NodeShopsPopupComponent,
    TariffItemComponent,
    LiabilityTabComponent,
    CommonAreaRelationsComponent
  ],
  providers: [
    ...fromFloorPlansServices.services,
    ShopHelper
  ],
  // entryComponents: [
  //   CommonAreaLiablityViewComponent,
  //   NodeShopsPopupComponent,
  //   CommonAreaRelationsComponent
  // ]
})
export class OccupationViewModule {
}

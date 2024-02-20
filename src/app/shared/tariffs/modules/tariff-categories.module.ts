import {NgModule} from '@angular/core';
import {CategoryItemsComponent} from '../category-items/category-items.component';
import {RuleItemComponent} from '../category-items/rule-item/rule-item.component';
import {RulesTreeComponent} from '../category-items/rules-tree/rules-tree.component';
import {NgrxFormsModule} from 'ngrx-forms';
import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TextMaskModule} from 'angular2-text-mask';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FilterAttributesForSupplyPipe} from '../../pipes/filter-attributes-for-supply.pipe';
import {EffectsModule} from '@ngrx/effects';
import {SharedTariffVersionSettingsEffects} from '../store/effects/tariff-version-settings.effects';
import {TariffVersionSettingsPopupComponent} from '../popups/tariff-version-setting-popup/tariff-version-settings-popup.component';
import { NgxMaskModule } from 'ngx-mask';

const components = [
  CategoryItemsComponent,
  RuleItemComponent,
  RulesTreeComponent,
  TariffVersionSettingsPopupComponent
];

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    NgrxFormsModule,
    WidgetsModule,
    DunamisInputsModule,
    //TextMaskModule,
    NgxMaskModule,
    EffectsModule.forFeature([SharedTariffVersionSettingsEffects])
  ],
  declarations: [
    ...components,
    FilterAttributesForSupplyPipe
  ],
  exports: [
    ...components,
    FilterAttributesForSupplyPipe
  ]
})
export class TariffCategoriesModule {
}

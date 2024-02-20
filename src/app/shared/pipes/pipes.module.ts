import {ReadingFileInfoFileTypePipe} from './reading-file-info-file.pipe';
import {NgModule} from '@angular/core';
import {ImagePipe} from './image.pipe';
import {DynCurrencyPipe} from './dyn-currency.pipe';
import {DateForDatepickerPipe} from './date-for-datepicker.pipe';
import {ShortNamePipe} from './short-name.pipe';
import {ArrayLengthPipe} from './array-length.pipe';
import {MeterTypeLabelPipe} from './mete-type-label.pipe';
import {ReadingSourceLabelPipe} from './reading-source-label.pipe';
import {NodeTypeLabelPipe} from './node-type-label.pipe';
import {LocationTypeLabelPipe} from './location-type-label.pipe';
import {SelectedArrayLengthPipe} from './selected-array-length.pipe';
import {UserLogoSrcPipe} from './user-logo-src.pipe';
import {DateDurationPipe} from './date-duration.pipe';
import {EquipmentLogoSrcPipe} from './equipment-logo-src.pipe';
import {PluralWordPipe} from './plural-word.pipe';
import {ReadingStatusPipe} from './reading-status.pipe';
import {EmptyValuePipe} from './empty-value.pipe';
import {FilterTariffsBySupplierPipe} from './filter-tariffs-by-supplier.pipe';
import {MarkRecommendedCategoryPipe} from './mark-recommended-category.pipe';
import {FindLineItemCategoriesPipe} from './find-line-item.pipe';
import {TariffSubcategoryPipe} from './tariff-subcategory.pipe';
import {SupplyTypeLetterPipe} from './supply-type-letter.pipe';
import {ShortMeterNamePipe} from './short-meter-name.pipe';
import {SupplierDetailsPipe} from './supplier-details.pipe';
import {LocationTypeDetailsPipe} from './location-type-details.pipe';
import {AttributeDetailsPipe} from './attribute-details.pipe';
import {ShopDetailsPipe} from './shop-details.pipe';
import {AreaDetailsPipe} from './area-details.pipe';
import {TariffDetailsPipe} from './tariff-details.pipe';
import {LineItemDetailsPipe} from './line-item-details.pipe';
import {TariffApplyTypeLabelPipe} from './tariff-apply-type-label.pipe';
import {FiterTariffsBySubNodePipe} from './fiter-tariffs-by-sub-node.pipe';
import {ParseNumberPipe} from './parse-number.pipe';
import {UnitTypeLabelPipe} from './unit-type-label.pipe';
import {FilterByPropertyPipe} from './filter-by-property.pipe';
import {HasDuplicationFactorPipe} from './has-duplication-factor.pipe';
import {TariffHasDuplicationFactorPipe} from './tariff-has-duplication-factor.pipe';
import {SortByProperyPipe} from './sort-by-propery.pipe';
import {HttpProtocolPipe} from './http-protocol.pipe';
import {TimeOfUseNamePipe} from './time-of-use-name.pipe';
import {ParentMeterByGroupPipe} from './parent-meter-by-group.pipe';
import {SearchReasonPipe} from './search-reason.pipe';
import {DateMediumFormatPipe} from './date-medium.pipe';
import {DateReadingDetailsPipe} from "./date-reading-details.pipe";
import {ActualVersionsPipe} from "./actual-versions.pipe";
import {DateFormatPipe} from './date-format.pipe';
import {FilterTariffsByRecommendedPipe} from "@app/shared/pipes/filter-tariffs-by-recommendet.pipe";

@NgModule({
  declarations: [
    ImagePipe,
    DynCurrencyPipe,
    DateForDatepickerPipe,
    ShortNamePipe,
    ArrayLengthPipe,
    MeterTypeLabelPipe,
    ReadingSourceLabelPipe,
    NodeTypeLabelPipe,
    LocationTypeLabelPipe,
    SelectedArrayLengthPipe,
    UserLogoSrcPipe,
    DateDurationPipe,
    EquipmentLogoSrcPipe,
    PluralWordPipe,
    ReadingStatusPipe,
    FilterTariffsBySupplierPipe,
    FilterTariffsByRecommendedPipe,
    EmptyValuePipe,
    MarkRecommendedCategoryPipe,
    FindLineItemCategoriesPipe,
    TariffSubcategoryPipe,
    SupplyTypeLetterPipe,
    ShortMeterNamePipe,
    SupplierDetailsPipe,
    LocationTypeDetailsPipe,
    AttributeDetailsPipe,
    ShopDetailsPipe,
    AreaDetailsPipe,
    TariffDetailsPipe,
    LineItemDetailsPipe,
    TariffApplyTypeLabelPipe,
    FiterTariffsBySubNodePipe,
    ParseNumberPipe,
    UnitTypeLabelPipe,
    FilterByPropertyPipe,
    HasDuplicationFactorPipe,
    TariffHasDuplicationFactorPipe,
    SortByProperyPipe,
    HttpProtocolPipe,
    TimeOfUseNamePipe,
    ParentMeterByGroupPipe,
    SearchReasonPipe,
    DateMediumFormatPipe,
    DateFormatPipe,
    DateReadingDetailsPipe,
    ReadingFileInfoFileTypePipe,
    ActualVersionsPipe
  ],
  exports: [
    ImagePipe,
    DynCurrencyPipe,
    DateForDatepickerPipe,
    ShortNamePipe,
    ArrayLengthPipe,
    MeterTypeLabelPipe,
    ReadingSourceLabelPipe,
    NodeTypeLabelPipe,
    LocationTypeLabelPipe,
    SelectedArrayLengthPipe,
    UserLogoSrcPipe,
    DateDurationPipe,
    EquipmentLogoSrcPipe,
    PluralWordPipe,
    ReadingStatusPipe,
    EmptyValuePipe,
    FilterTariffsBySupplierPipe,
    FilterTariffsByRecommendedPipe,
    MarkRecommendedCategoryPipe,
    FindLineItemCategoriesPipe,
    TariffSubcategoryPipe,
    SupplyTypeLetterPipe,
    ShortMeterNamePipe,
    SupplierDetailsPipe,
    LocationTypeDetailsPipe,
    AttributeDetailsPipe,
    ShopDetailsPipe,
    AreaDetailsPipe,
    TariffDetailsPipe,
    LineItemDetailsPipe,
    TariffApplyTypeLabelPipe,
    FiterTariffsBySubNodePipe,
    ParseNumberPipe,
    UnitTypeLabelPipe,
    FilterByPropertyPipe,
    HasDuplicationFactorPipe,
    TariffHasDuplicationFactorPipe,
    SortByProperyPipe,
    HttpProtocolPipe,
    TimeOfUseNamePipe,
    ParentMeterByGroupPipe,
    SearchReasonPipe,
    DateMediumFormatPipe,
    DateFormatPipe,
    DateReadingDetailsPipe,
    ReadingFileInfoFileTypePipe,
    ActualVersionsPipe
  ]
})
export class PipesModule {
}

export class RecommendedPriceViewModel {
  electricity = new RecommendPriceItemViewModel();
  water = new RecommendPriceItemViewModel();
  sewerage = new RecommendPriceItemViewModel();
  gas = new RecommendPriceItemViewModel();
  adHoc = new RecommendPriceItemViewModel();

}

export class RecommendPriceItemViewModel {
  fixedPrice = 0;
  perMeter = 0;
  perShop = 0;
  perSquareMeter = 0;
  perTenant = 0;
  perBuilding = 0;
  perCouncilAccount = 0;
  perHour = 0;
  meterTypes = {};
}

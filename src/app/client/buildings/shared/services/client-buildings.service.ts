import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {setURL} from '@shared-helpers';
import {BuildingViewModel, PortfolioViewModel} from '../models/buildings.model';
import {MeterPhotoType} from 'app/branch/buildings/manage-building/building-equipment/shared/models';

@Injectable()
export class ClientBuildingsService {

  private readonly GET_CLIENT_PORTFOLIOS_URL: string = '/api/v1/client-portal/clients/{0}/client-portfolios';
  private readonly CLIENT_BUILDING_DETAILS_URL: string = '/api/v1/client-portal/buildings/{0}/details';
  private readonly GET_CLIENT_SHOP_DETAILS_URL: string = '/api/v1/client-portal/buildings/{0}/shops/{1}/details';
  private readonly GET_CLIENT_BUILDINGS_URL: string = '/api/v1/client-portal/clients/{0}/client-portfolios/{1}/buildings';
  private readonly SAVE_SHOPS_CHANGES_URL: string = '/api/v1/client-portal/buildings/{0}/shops';

  private readonly GET_CLIENT_PORTFOLIO_LOGO_URL: string = '/api/v1/clients/{0}/portfolios/{1}/logo';
  private readonly GET_CLIENT_METER_PHOTO_URL: string = '/api/v1/buildings/{0}/meters/{1}/{2}/image';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getPortfolios(clientId: string) {
    return this.httpHelperService.authJsonGet<PortfolioViewModel[]>(setURL(this.GET_CLIENT_PORTFOLIOS_URL, clientId));
  }

  public getBuildingDetails(buildingId: string) {
    return this.httpHelperService.authJsonGet<any>(setURL(this.CLIENT_BUILDING_DETAILS_URL, buildingId));
  }

  public getBuildings(clientId: string, portfolioId: string) {
    return this.httpHelperService.authJsonGet<BuildingViewModel[]>(setURL(this.GET_CLIENT_BUILDINGS_URL, clientId, portfolioId),
      null, false);
  }

  public getShopDetais(buildingId: string, shopId: string) {
    return this.httpHelperService.authJsonGet<any>(setURL(this.GET_CLIENT_SHOP_DETAILS_URL, buildingId, shopId), null, false);
  }

  public saveChanges(buildingId: string, shops: any[]) {
    return this.httpHelperService.authJsonPost(setURL(this.SAVE_SHOPS_CHANGES_URL, buildingId), shops);
  }

  public getPortfolioLogoUrl(clientId: string, portfolioId: string) {
    return setURL(this.GET_CLIENT_PORTFOLIO_LOGO_URL, clientId, portfolioId) + '?' + new Date().getTime();
  }

  public getMeterPhotoUrl(buildingId: string, meterId: string, meterPhotoType: MeterPhotoType) {
    return setURL(this.GET_CLIENT_METER_PHOTO_URL, buildingId, meterId, meterPhotoType) + '?' + new Date().getTime();
  }
}

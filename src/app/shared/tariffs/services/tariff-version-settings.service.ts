import {TariffVersionSettingsViewModel} from '@app/shared/models/tariff-version-settings.model';
import {Injectable} from '@angular/core';
import {HttpHelperService} from "../../services";
import {setURL} from "../../helper";
import {TariffCategoryAllocatedUnitViewModel} from '../models/tariff-category-allocated-unit.model';

@Injectable()
export class TariffVersionSettingsService {
  private readonly SUPPLIER_TARIFF_VERSION_SETTINGS_URL: string = '/api/v1/tariffs/{0}/settings';
  private readonly BUILDING_TARIFF_VERSION_SETTINGS_URL: string = '/api/v1/tariffs/{0}/{1}/settings';

  private readonly TARIFF_CATEGORIES_ALLOCATED_UNITS_URL: string = '/api/v1/tariffs/allocated-units/{0}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public update(tariffVersionId: string, buildingId: string, tariffVersionSettings: TariffVersionSettingsViewModel) {
    const url = buildingId
      ? setURL(this.BUILDING_TARIFF_VERSION_SETTINGS_URL, buildingId, tariffVersionId)
      : setURL(this.SUPPLIER_TARIFF_VERSION_SETTINGS_URL, tariffVersionId)

    return this.httpHelperService
      .authJsonPut<any>(url, tariffVersionSettings);
  }

  public getAllocatedUnits(tariffVersionId: string, tariffCategoryIds: string[]) {
    return this.httpHelperService
      .authJsonPost<TariffCategoryAllocatedUnitViewModel[]>(this.TARIFF_CATEGORIES_ALLOCATED_UNITS_URL.replace('{0}', tariffVersionId), tariffCategoryIds);
  }
}

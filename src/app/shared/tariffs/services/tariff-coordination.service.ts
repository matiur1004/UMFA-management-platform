import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AggregatedTariffViewModel} from '@models';

@Injectable()
export abstract class TariffCoordinationService {
  public abstract getTariffs(): Observable<AggregatedTariffViewModel[]>;

  public abstract getAllBuildingCategories(): Observable<{ id: string; name: string; }[]>;

  public abstract openTariffDetails(tariffVersionId);

  public abstract openTariffValue(tariffVersionId, tariffValueId);

  public abstract openNewTariffVersion(tariffVersionId);

  public abstract deleteTariffSubVersion(tariffVersionId);

  public abstract deleteTariffVersion(tariffId, majorVersion);

  public abstract updateVersionOrder(orderIndex);

  public abstract updateOrder(orderIndex);

  public abstract updateSupplyTypeFilter(supplyType);

  public abstract updateSearchKey(searchKey);

  public abstract updateBuildingCategoryId(bldCategoryId);

  public abstract requestTariffList();

  public abstract updateTariffVersionId(tariffVersionId);
}

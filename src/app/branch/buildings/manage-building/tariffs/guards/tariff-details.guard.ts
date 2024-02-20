import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Store} from '@ngrx/store';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import * as fromTariff from '../store/reducers';
import {BuildingTariffsService} from '../services/building-tariffs.service';
import * as actions from '../store/actions/building-tariffs.actions';
import * as tariffVersionActions from 'app/shared/tariffs/store/actions/tariff-versions.actions';
import * as tariffVersionSettingsActions from 'app/shared/tariffs/store/actions/tariff-version-settings.actions';
import {box, SetValueAction} from 'ngrx-forms';

@Injectable()
export class TariffDetailsGuard implements CanActivate {
  constructor(private readonly store: Store<fromTariff.State>, private service: BuildingTariffsService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const buildingIdDepth = +next.data['buildingIdDepth'];
    let bldRoute = next;
    if (buildingIdDepth) {
      let i = 0;
      while (i++ < buildingIdDepth && bldRoute.parent) {
        bldRoute = bldRoute.parent;
      }
    }
    const tariffId = next.params['tariffVersionId'];
    const buildingId = bldRoute.params['id'];
    if (!buildingId) {
      return of(false);
    }
    return this.getDataFromApi(tariffId, buildingId).pipe(
      catchError(() => of(false))
    );
  }

  convertToFormModel = (item, lineItemSequence: { sequenceNumber: number }) => {
    const object = {...item, controlPosition: ++lineItemSequence.sequenceNumber, categories: box(item.categories)};
    return object;
  }

  private getDataFromApi(tariffId: string, buildingId: string) {
    return forkJoin([
      this.service.getBuildingTariff(tariffId, buildingId),
      this.service.canEditSupplyType(tariffId)
    ])
      .pipe(
        tap(([tariff, canEditSupplyType]) => {
          this.store.dispatch(new SetValueAction(fromTariff.buildingTariffFormId, this.getFormValue(tariff, canEditSupplyType)));
          this.store.dispatch(new actions.ApiTariffDetailsRequestSucceeded(tariff));
          this.store.dispatch(new tariffVersionActions.UpdateTariffVersions(fromTariff.buildingTariffAreaName,
            tariff.entity.tariffVersions));
          this.store.dispatch(new tariffVersionActions.UpdateTariffSubVersions(fromTariff.buildingTariffAreaName,
            tariff.entity.tariffSubVersions));
          this.store.dispatch(new tariffVersionActions.UpdateTariffValuesVersions(fromTariff.buildingTariffAreaName,
            tariff.entity.tariffValues));
          this.store.dispatch(new tariffVersionSettingsActions.SetTariffVersionSettings(tariff.entity.tariffVersionSettings));
        }),
        map(() => true)
      );
  }

  private getFormValue(tariffVersion, canEditSupplyType) {
    const lineItemSequence = {sequenceNumber: 0};
    const {
      entity: {
        id, supplierId, name, code, supplyType, buildingCategoriesIds,
        seasonalChangesEnabled, touChangesEnabled, createdOn, createdBy,
        disableAfter, basedOnReadingsLineItems, basedOnReadingsAndSettingsLineItems,
        basedOnAttributeLineItems, basedOnCalculationsLineItems, fixedPriceLineItems,
        tariffCategories, tariffVersionSettings
      }
    } = tariffVersion;
    return {
      id: id,
      supplierId: supplierId,
      versionId: tariffVersion.id,
      name: name,
      code: code,
      supplyType: supplyType,
      buildingCategoriesIds: box(buildingCategoriesIds),
      seasonalChangesEnabled: seasonalChangesEnabled,
      touChangesEnabled: touChangesEnabled,
      createdOn: createdOn,
      createdBy: createdBy,
      versionDate: tariffVersion.versionDate,
      majorVersion: tariffVersion.majorVersion,
      minorVersion: tariffVersion.minorVersion,
      version: tariffVersion.version,
      canEditSupplyType: canEditSupplyType,
      disableAfter: disableAfter,
      disableForNewCustomers: !!disableAfter,
      basedOnReadingsLineItems: basedOnReadingsLineItems.map(item => {
        const newItem = this.convertToFormModel(item, lineItemSequence);
        newItem.stepSchema = item.stepSchema ? item.stepSchema.id : '';
        return newItem;
      }),
      basedOnReadingsAndSettingsLineItems: basedOnReadingsAndSettingsLineItems.map(item =>
        this.convertToFormModel(item, lineItemSequence)),
      basedOnAttributesLineItems: basedOnAttributeLineItems.map(item =>
        this.convertToFormModel(item, lineItemSequence)),
      basedOnCalculationsLineItems: basedOnCalculationsLineItems.map(item =>
        this.convertToFormModel(item, lineItemSequence)),
      fixedPriceLineItems: fixedPriceLineItems.map(item =>
        this.convertToFormModel(item, lineItemSequence)),
      tariffCategories: box(tariffCategories),
      tariffVersionSettings: tariffVersionSettings
    };
  }
}

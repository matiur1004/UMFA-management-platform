import {NodeTariffVersionsAction} from './../../branch/buildings/manage-building/shared/enums/node-tariff-versions-action.enum';
import {setURL} from '@shared-helpers';
import {Injectable} from '@angular/core';
import {forkJoin, Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';

import {HttpHelperService} from './http-helper.service';
import {
  BankAccountViewModel,
  BuildingDetailViewModel,
  BuildingViewModel,
  CategoryViewModel,
  ClientPortfolioViewModel,
  ClientViewModel,
  PagingViewModel,
  VersionResultViewModel
} from '@models';
import {BuildingTariffState} from "@app/branch/buildings/manage-building/shared/enums/building-tariff-state.enum";

@Injectable()
export class BuildingService {

  private readonly BUILDINGS_URL: string = '/api/v1/buildings';
  private readonly MARKETING_BUILDINGS_URL: string = '/api/v1/buildings/marketing';
  private readonly BUILDING_URL: string = '/api/v1/buildings/{0}';
  private readonly BUILIDING_BANK_ACCOUNTS_URL: string = 'api/v1/buildings/{0}/bank-accounts';
  private readonly BRANCH_CATEGORIES_URL: string = 'api/v1/branches/categories';
  private readonly ALL_CATEGORIES_URL: string = 'api/v1/branches/all-categories';
  private readonly CLIENTS_URL: string = '/api/v1/buildings/clients';
  private readonly CLIENT_PORTFOLIOS_URL: string = '/api/v1/clients/{0}/portfolios';
  private readonly TARIFF_STATE_URL: string = 'api/v1/building-tariff-state/{0}/{1}';
  private readonly PROCESS_NODE_TARIFF_VERSIONS = '/api/v1/buildings/{0}/process-node-tariff-versions/{1}';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getAll(category: CategoryViewModel | null = null, order: number = 1, searchKey: string = null, offset: number | null = null, limit: number | null = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('order', order.toString());

    if (searchKey) params = params.append('searchKey', searchKey);
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (category) params = params.append('categoryId', category.id.toString());

    return this.httpHelperService.authJsonGet<PagingViewModel<BuildingViewModel>>(this.BUILDINGS_URL, params).pipe(map((response) => {
      response.items.forEach((building) => {
        building.category = building.categories.map(b => b.name).join(', ');
      });

      return response;
    }));
  }

  public getAllForMarketing(category: CategoryViewModel | null = null, order: number = 1, searchKey: string = null, offset: number | null = null, limit: number | null = null) {
    let params: HttpParams = new HttpParams();
    params = params.append('order', order.toString());

    if (searchKey) params = params.append('searchKey', searchKey);
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (category) params = params.append('categoryId', category.id.toString());

    return this.httpHelperService.authJsonGet<PagingViewModel<BuildingViewModel>>(this.MARKETING_BUILDINGS_URL, params).pipe(map((response) => {
      response.items.forEach((building) => {
        building.category = building.categories.map(b => b.name).join(', ');
      });

      return response;
    }));
  }

  public get(buildingId: string) {
    return this.httpHelperService.authJsonGet<BuildingDetailViewModel>(this.BUILDING_URL.replace('{0}', buildingId));
  }

  public create(model: BuildingDetailViewModel) {
    return this.httpHelperService.authMultipartFormDataPut(this.BUILDINGS_URL, model);
  }

  public update(buildingId: string, model: BuildingDetailViewModel) {
    return this.httpHelperService.authMultipartFormDataPost(this.BUILDING_URL.replace('{0}', buildingId.toString()), model);
  }

  public delete(buildingId: string) {
    return this.httpHelperService.authJsonDelete(this.BUILDINGS_URL + '/' + buildingId);
  }

  public getAllCategories() {
    return this.httpHelperService.authJsonGet<CategoryViewModel[]>(this.ALL_CATEGORIES_URL, null, false);
  }

  public getCategories(branchId: string) {
    return this.httpHelperService.authJsonGet<CategoryViewModel[]>(this.BRANCH_CATEGORIES_URL.replace('{0}', branchId), null, false);
  }

  public updateCategories(branchId: string, model: CategoryViewModel[]) {
    return this.httpHelperService.authJsonPost<CategoryViewModel[]>(this.BRANCH_CATEGORIES_URL.replace('{0}', branchId), model, null, false);
  }

  public deleteCategory(branchId: string) {
    return this.httpHelperService.authJsonDelete(this.BRANCH_CATEGORIES_URL.replace('{0}', branchId), null, false);
  }

  public getBranchCategories() {
    return this.httpHelperService.authJsonGet<CategoryViewModel[]>(this.BRANCH_CATEGORIES_URL, null, false);
  }

  public getClients() {
    return this.httpHelperService.authJsonGet<PagingViewModel<ClientViewModel>>(this.CLIENTS_URL, null, false).pipe(
      map(clientPage => clientPage.items),
      flatMap(clients => {
        if (clients.length > 0) {
          return forkJoin(clients.map(client => {
            return this.httpHelperService.authJsonGet<ClientPortfolioViewModel[]>(this.CLIENT_PORTFOLIOS_URL.replace("{0}", client.id)).pipe(map(clientPortfolios => {
              client.portfolios = clientPortfolios;
              return client;
            }));
          }));
        }

        return of([]);
      })
    )
  }

  public getBankAccounts(buildingId: string) {
    return this.httpHelperService.authJsonGet<BankAccountViewModel[]>(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', buildingId), null, false);
  }

  public getBankAccount(buildingId: string, bankAccountId: string) {
    return this.httpHelperService.authJsonGet<BankAccountViewModel>(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', buildingId) + '/' + bankAccountId, null, false);
  }

  public createBankAccount(buildingId: string, bankAccount: BankAccountViewModel) {
    return this.httpHelperService.authJsonPut(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', buildingId), bankAccount, null, false);
  }

  public updateBankAccount(buildingId: string, bankAccountId: string, bankAccount: BankAccountViewModel) {
    return this.httpHelperService.authJsonPost(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', buildingId) + '/' + bankAccountId, bankAccount, null, false);
  }

  public deleteBankAccount(buildingId: string, bankAccountId: string) {
    return this.httpHelperService.authJsonDelete(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', buildingId) + '/' + bankAccountId, null, false);
  }

  public getTariffState(buildingId: string, buildingPeriodsId: string): Observable<BuildingTariffState> {
    return this.httpHelperService.authJsonGet<BuildingTariffState>(setURL(this.TARIFF_STATE_URL, buildingId, buildingPeriodsId), null, false);
  }

  public processNewNodeTariffVersions(
    buildingId: string,
    action: NodeTariffVersionsAction,
  ): Observable<VersionResultViewModel> {

    const url = setURL(this.PROCESS_NODE_TARIFF_VERSIONS, buildingId, action);

    return this.httpHelperService.authJsonPut<VersionResultViewModel>(url, null, null);
  }
}

import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import {forkJoin} from 'rxjs';
import {map} from 'rxjs/operators';

import {BankAccountService, HttpHelperService} from '@services';
import {ClientViewModel} from './client.model';
import {BankAccountViewModel, ContactViewModel, DepartmentViewModel, PagingViewModel} from '@models';
import {BuildingViewModel} from './building.model';
import {ClinetPortfolioViewModel} from './clinet-portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends BankAccountService {

  public selectedClientPortfolio: string = null;
  public selectedClientBankAccount: string = null;
  public selectedClientContact: string = null;

  private readonly CLIENT_URL: string = "/api/v1/clients";
  private readonly CLIENT_BY_ID_URL: string = "/api/v1/clients/{0}";
  private readonly CLIENT_PORTFOLIO_URL: string = "/api/v1/clients/{0}/portfolios";
  private readonly CLIENT_PORTFOLIO_BUILDING_URL: string = "/api/v1/clients/{0}/portfolios/{1}/buildings";
  private readonly CLIENT_CONTACTS_URL: string = "/api/v1/clients/{0}/contacts";
  private readonly CLIENT_CONTACT_UPDATE_URL: string = "/api/v1/clients/{0}/contacts/{1}";
  private readonly BRANCH_DEPARTMENTS_URL: string = "/api/v1/clients/departments";
  private readonly UPDATE_CLIENT_PORTFOLIO_URL: string = "/api/v1/clients/{0}/portfolios/{1}";
  private readonly BUILIDING_BANK_ACCOUNTS_URL: string = "/api/v1/clients/{0}/bank-accounts";
  private readonly CLIENT_CONTACT_LOGO_URL: string = "/api/v1/clients/{0}/contacts/{1}/logo";
  private readonly CLIENT_PORTFOLIO_LOGO_URL: string = "/api/v1/clients/{0}/portfolios/{1}/logo";

  constructor(private httpHelper: HttpHelperService) {
    super();
  }

  public getAll(searchTerm: string, order: number, charectFilter: string | null, offset: number, limit: number | null) {

    let params: HttpParams = new HttpParams();
    if (offset) params = params.append('offset', offset.toString());
    if (limit) params = params.append('limit', limit.toString());
    if (order) params = params.append('order', order.toString());

    if (charectFilter) params = params.append('charectFilter', charectFilter);
    if (searchTerm) params = params.append('searchKey', searchTerm);

    return this.httpHelper.authJsonGet<PagingViewModel<ClientViewModel>>(this.CLIENT_URL, params);
  }

  public getById(clientId: string) {
    return forkJoin([
      this.httpHelper.authJsonGet<ClientViewModel>(this.CLIENT_BY_ID_URL.replace('{0}', clientId)),
      this.httpHelper.authJsonGet<ClinetPortfolioViewModel[]>(this.CLIENT_PORTFOLIO_URL.replace('{0}', clientId))
    ]).pipe(map((data: any[]) => {
      var client: ClientViewModel = data[0];
      client.portfolios = data[1];
      return client;
    }));
  }

  public create(client: ClientViewModel) {
    return this.httpHelper.authMultipartFormDataPut<ClientViewModel>(this.CLIENT_URL, client);
  }

  public update(clientId: string, client: ClientViewModel) {
    return this.httpHelper.authMultipartFormDataPost<ClientViewModel>(this.CLIENT_BY_ID_URL.replace('{0}', clientId), client);
  }

  public getContactsForClient(clientId: string, order: number, offset: number, limit: number) {

    let parametrs = new HttpParams();

    parametrs = parametrs.append("order", order.toString());
    parametrs = parametrs.append("offset", offset.toString());
    if (limit) parametrs = parametrs.append("limit", limit.toString());

    return this.httpHelper.authJsonGet<PagingViewModel<ContactViewModel>>(this.CLIENT_CONTACTS_URL.replace('{0}', clientId), parametrs);
  }

  getBuildings(clientId: string, portfolioId: string) {
    return this.httpHelper.authJsonGet<BuildingViewModel[]>(this.CLIENT_PORTFOLIO_BUILDING_URL.replace('{0}', clientId).replace('{1}', portfolioId));
  }

  public deleteClient(clientId: string) {
    return this.httpHelper.authJsonDelete(this.CLIENT_BY_ID_URL.replace('{0}', clientId));
  }

  public getDepartments() {
    return this.httpHelper.authJsonGet<DepartmentViewModel[]>(this.BRANCH_DEPARTMENTS_URL, null, false);
  }

  public createContact(clientId: string, contact: ContactViewModel) {
    return this.httpHelper.authMultipartFormDataPut<ContactViewModel>(this.CLIENT_CONTACTS_URL.replace('{0}', clientId), contact);
  }

  public updateContact(clientId: string, contactId: string, contact: ContactViewModel) {
    return this.httpHelper.authMultipartFormDataPost<ContactViewModel>(this.CLIENT_CONTACT_UPDATE_URL.replace('{0}', clientId).replace('{1}', contactId), contact);
  }

  public deleteContact(clientId: string, contactId: string) {
    return this.httpHelper.authJsonDelete(this.CLIENT_CONTACT_UPDATE_URL.replace('{0}', clientId).replace('{1}', contactId));
  }

  public getPortfolios(clientId: string) {
    return this.httpHelper.authJsonGet<ClinetPortfolioViewModel[]>(this.CLIENT_PORTFOLIO_URL.replace('{0}', clientId));
  }

  public createPortfolio(clientId: string, model: ClinetPortfolioViewModel) {
    return this.httpHelper.authMultipartFormDataPut(this.CLIENT_PORTFOLIO_URL.replace('{0}', clientId), model);
  }

  public updatePortfolio(clientId: string, clientPortfolioId: string, model: ClinetPortfolioViewModel) {
    return this.httpHelper.authMultipartFormDataPost(this.UPDATE_CLIENT_PORTFOLIO_URL.replace('{0}', clientId).replace('{1}', clientPortfolioId), model);
  }

  public deletePortfolio(clientId: string, clientPortfolioId: string) {
    return this.httpHelper.authJsonDelete(this.UPDATE_CLIENT_PORTFOLIO_URL.replace('{0}', clientId).replace('{1}', clientPortfolioId));
  }

  public getBankAccounts(clientId: string) {
    return this.httpHelper.authJsonGet<BankAccountViewModel[]>(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', clientId), null, false);
  }

  public getBankAccount(clientId: string, bankAccountId: string) {
    return this.httpHelper.authJsonGet<BankAccountViewModel>(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', clientId) + '/' + bankAccountId, null, false);
  }

  public createBankAccount(clientId: string, bankAccount: BankAccountViewModel) {
    return this.httpHelper.authJsonPut(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', clientId), bankAccount, null, false);
  }

  public updateBankAccount(clientId: string, bankAccountId: string, bankAccount: BankAccountViewModel) {
    return this.httpHelper.authJsonPost(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', clientId) + '/' + bankAccountId, bankAccount, null, false);
  }

  public deleteBankAccount(clientId: string, bankAccountId: string) {
    return this.httpHelper.authJsonDelete(this.BUILIDING_BANK_ACCOUNTS_URL.replace('{0}', clientId) + '/' + bankAccountId, null, false);
  }

  public getContactLogoUrl(clientId: string, contactId: string) {
    return this.CLIENT_CONTACT_LOGO_URL.replace('{0}', clientId).replace('{1}', contactId) + '?' + new Date().getTime();
  }

  public getPortfolioLogoUrl(clientId: string, portfolioId: string) {
    return this.CLIENT_PORTFOLIO_LOGO_URL.replace('{0}', clientId).replace('{1}', portfolioId) + '?' + new Date().getTime();
  }
}

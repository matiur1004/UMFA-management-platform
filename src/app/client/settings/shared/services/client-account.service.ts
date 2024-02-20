import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {setURL} from '@shared-helpers';

@Injectable()
export class ClientAccountService {

  private readonly CLIENT_ACCOUNT_URL: string = '/api/v1/client-portal/clients/{0}/general-details';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getDetails(clientId: string) {
    return this.httpHelperService.authJsonGet<any>(setURL(this.CLIENT_ACCOUNT_URL, clientId));
  }
}

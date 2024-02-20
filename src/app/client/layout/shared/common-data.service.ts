import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';

@Injectable()
export class CommonDataService {

  private readonly GET_CLIENT_ID_URL: string = '/api/v1/client-portal/user-client';

  constructor(private httpHelperService: HttpHelperService) {
  }

  public getClientId() {
    return this.httpHelperService.authJsonGet<string>(this.GET_CLIENT_ID_URL);
  }
}

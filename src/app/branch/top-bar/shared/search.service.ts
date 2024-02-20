import {Injectable} from '@angular/core';
import {HttpHelperService} from '@services';
import {Observable} from 'rxjs';
import {SearchViewModel} from 'app/branch/top-bar/shared/search.model';
import {HttpParams} from '@angular/common/http';


@Injectable()
export class SearchService {

  private readonly SEARCH_URL: string = "/api/v1/search";

  constructor(private httpHelperService: HttpHelperService) {
  }

  public get(searchKey: string, offset: number, limit: number): Observable<SearchViewModel> {
    let params = new HttpParams();
    params = params.append("searchKey", searchKey);

    if (offset) params = params.append("offset", offset.toString());
    if (limit) params = params.append("limit", limit.toString());

    return this.httpHelperService.authJsonGet<SearchViewModel>(this.SEARCH_URL, params, false);
  }
}

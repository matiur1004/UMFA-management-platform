import {Injectable} from '@angular/core';
import {HttpHelperService} from './http-helper.service';
import {MeterTypesViewModel} from '@models';


@Injectable({
  providedIn: 'root'
})
export class MeterTypeService {

  private readonly MC_METER_TYPES: string = '/api/v1/meter-types/mc';

  constructor(private http: HttpHelperService) {
  }

  public get() {
    return this.http.authJsonGet<MeterTypesViewModel>(this.MC_METER_TYPES);
  }

  public update(model) {
    return this.http.authJsonPost<MeterTypesViewModel>(this.MC_METER_TYPES, model);
  }
}

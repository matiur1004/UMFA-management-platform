import {HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  VirtualRegisterDetail,
  VirtualRegisterListItem
} from '@app/branch/buildings/manage-building/building-equipment/shared/models';
import {PagingViewModel, VersionResultViewModel, VersionViewModel} from '@models';
import {HttpHelperService} from '@services';

@Injectable({
  providedIn: 'root'
})
export class VirtualRegistersService {
  private readonly VIRTUAL_REGISTER: string = '/api/v1/buildings/{0}/virtual-registers';
  private readonly VIRTUAL_REGISTER_DETAIL: string = '/api/v1/buildings/{0}/virtual-registers/{1}';

  constructor(private http: HttpHelperService) {
  }

  getVirtualRegisters(buildingId: string, payload: { [param: string]: string | string[] }) {
    const params = new HttpParams({fromObject: payload});

    return this.http.authJsonGet<PagingViewModel<VirtualRegisterListItem>>(this.VIRTUAL_REGISTER.replace('{0}', buildingId), params);
  }

  removeVirtualRegister(buildingId: string, payload: { [param: string]: string | string[] }) {
    const params = new HttpParams({fromObject: payload});

    return this.http.authJsonDelete<VersionResultViewModel>(this.VIRTUAL_REGISTER.replace('{0}', buildingId), params);
  }

  getVirtualRegisterDetail(buildingId, payload: { vrId: string, versionId: string }) {
    const vrUrl = this.VIRTUAL_REGISTER_DETAIL.replace('{0}', buildingId).replace('{1}', payload.vrId);
    let params = new HttpParams();
    if (payload.versionId) {
      params = params.append('versionId', payload.versionId);
    }

    return this.http.authJsonGet<VirtualRegisterDetail>(vrUrl, params, false);
  }

  createVirtualRegister(data: VersionViewModel<VirtualRegisterDetail>) {
    return this.http.authJsonPost<VersionResultViewModel>(this.VIRTUAL_REGISTER.replace('{0}', data.entity.buildingId), data);
  }

  updateVirtualRegister(data: VersionViewModel<VirtualRegisterDetail>) {
    return this.http.authJsonPut<VersionResultViewModel>(this.VIRTUAL_REGISTER.replace('{0}', data.entity.buildingId), data);
  }
}

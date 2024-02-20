import {NgModule} from '@angular/core';

import {AuthService} from './auth.service';
import {NotificationService} from './notification.service';
import {ProgressSpinnerService} from './progress-spinner.service';
import {HttpHelperService} from './http-helper.service';
import {BranchManagerService} from './branch-manager.service';
import {WindowRef} from './window-ref.service';
import {PermissionService} from './permission.service';
import {DataService} from './data.service';
import {NationalTenantsService} from './national-tenants.service';
import {UserAccountService} from './user-account.service';
import {TenantService} from './tenant.service';
import {BranchSettingsService} from './branch.service';
import {BuildingService} from './building.service';
import {EquipmentService} from './equipment.service';
import {MeterTypeService} from './meter-types.service';
import {UserProfileService} from './user-profile.service';
import {OccupationService} from './occupation.service';

export * from './auth.service'
export * from './notification.service'
export * from './progress-spinner.service'
export * from './http-helper.service'
export * from './branch-manager.service'
export * from './window-ref.service'
export * from './permission.service'
export * from './data.service'
export * from './national-tenants.service'
export * from './user-account.service';
export * from './tenant.service';
export * from './branch.service';
export * from './building.service';
export * from './equipment.service';
export * from './meter-types.service';
export * from './user-profile.service';
export * from './occupation.service';
export * from './bank-account.service';

@NgModule({
  imports: [],
  declarations: [],
  providers: [
    AuthService,
    NotificationService,
    ProgressSpinnerService,
    HttpHelperService,
    BranchManagerService,
    WindowRef,
    PermissionService,
    DataService,
    NationalTenantsService,
    UserAccountService,
    TenantService,
    BranchSettingsService,
    BuildingService,
    EquipmentService,
    MeterTypeService,
    UserProfileService,
    OccupationService
  ]
})
export class ServicesModule {
}


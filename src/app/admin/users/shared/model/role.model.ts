import {PermissionViewModel} from "./permission.model";

export class RoleDetailViewModel {
  id: string;
  name: string;
  description: string;
  canEdit: boolean;
  isGlobal: boolean;
  permissions: PermissionViewModel[] = new Array<PermissionViewModel>();
}

export class RoleViewModel {
  id: string;
  name: string;
  isSelected: boolean;
  isGlobal: boolean;
  canDelete: boolean;
}

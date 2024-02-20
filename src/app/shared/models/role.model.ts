import {PermissionViewModel} from "./permission.model";

export class RoleDetailViewModel {
  id: string;
  name: string;
  description: string;
  canEdit: boolean;
  permissions: PermissionViewModel[] = new Array<PermissionViewModel>();
}

export class RoleViewModel {
  id: string;
  name: string;
  canEdit: boolean;
  isSelected: boolean;
}

export class PermissionViewModel {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  permissions: PermissionViewModel[] = new Array<PermissionViewModel>();
  isDisabled: boolean;
}

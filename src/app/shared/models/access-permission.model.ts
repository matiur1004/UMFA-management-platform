export class MCAccessPermission {
  canManageBranches: boolean = true;
  canManageRoles: boolean = true;
  canManageUsers: boolean = true;
  canManageSuppliers: boolean = true;
  canManageSettings: boolean = true;
}

export class BranchAccessPermission {
  canManageRoles: boolean = true;
  canManageUserProfiles: boolean = true;
  canViewBuildings: boolean = true;
  canCreateBuildings: boolean = true;
  canUpdateBuildings: boolean = true;
  canViewClients: boolean = true;
  canManageClients: boolean = true;
  canManageSettings: boolean = true;
  canManageFinance: boolean = true;
  canManageBranchSuppliers: boolean = true;
  canManageBuildingTariffs: boolean = true;
  canManageTariffAssignments: boolean = true;
}

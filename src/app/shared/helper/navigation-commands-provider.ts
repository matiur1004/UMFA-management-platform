import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationCommandsProvider {
  branchId: string;

  setBranchId(branchId: string) {
    this.branchId = branchId;
  }

  getBranchCommands(): any[] {
    return ['branch', this.branchId];
  }

  getClientsCommands(clientId: string): any[] {
    return this.getBranchCommands().concat(['clients', clientId]);
  }

  getBuildingsCommands(buildingId: string): any[] {
    return this.getBranchCommands().concat(['buildings', buildingId]);
  }

  getTenantCommands(buildingId: string): any[] {
    return this.getBuildingsCommands(buildingId).concat(['tenants']);
  }

  getUserCommands(userId: string): any[] {
    return this.getBranchCommands().concat(['user-profiles', 'users', userId, {queryParams: {dummy: new Date().getTime()}}]);
  }

  getEquipmentCommands(buildingId: string, equipmentId: string): any[] {
    return this.getVersionCommands(buildingId).concat(['equipment', equipmentId]);
  }

  getNodesCommands(buildingId: string, nodeId: string): any[] {
    return this.getVersionCommands(buildingId).concat(['equipment', 'nodes', nodeId]);
  }

  getShopsCommands(buildingId: string): any[] {
    return this.getOccupationCommands(buildingId).concat(['shops']);
  }

  getCommonAreasCommands(buildingId: string): any[] {
    return this.getOccupationCommands(buildingId).concat(['common-areas']);
  }

  getSuppliersCommands() {
    return this.getBranchCommands().concat('suppliers');
  }

  getPortfolioCommands(clientId: string, portfolioId: string) {
    return this.getBranchCommands().concat(['clients', clientId, 'portfolios', portfolioId])
  }
  private getVersionCommands(buildingId: string): any[] {
    return this.getBuildingsCommands(buildingId).concat(['version', 0]);
  }

  private getOccupationCommands(buildingId: string): any[] {
    return this.getVersionCommands(buildingId).concat(['occupation']);
  }
}

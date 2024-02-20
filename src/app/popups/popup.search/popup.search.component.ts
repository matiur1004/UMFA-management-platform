import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchItemViewModel, SearchViewModel} from '../../branch/top-bar/shared/search.model';
import {Router} from '@angular/router';
import {BranchManagerService} from '@services';
import {NavigationCommandsProvider} from '@shared-helpers';

@Component({
  selector: 'app-popup-search',
  templateUrl: './popup.search.component.html',
  styleUrls: ['./popup.search.component.less']
})
export class PopupSearchComponent implements OnInit {

  @Input() model: SearchViewModel;
  @Output() itemSelected = new EventEmitter<boolean>();

  constructor(private router: Router, private branchManager: BranchManagerService, private navigationProvider: NavigationCommandsProvider) {
  }

  ngOnInit() {
  }

  clientClick(client: SearchItemViewModel) {
    this.applyNavigation(client.branchId, 'Clients', client.id);
  }

  buildingClick(building: SearchItemViewModel) {
    this.applyNavigation(building.branchId, 'Buildings', building.id);
  }

  userClick(user: SearchItemViewModel) {
    this.applyNavigation(user.branchId, 'User', user.id);
  }

  equipmentClick(equipment: SearchItemViewModel) {
    this.applyNavigation(equipment.branchId, 'Equipment', equipment.buildingId, equipment.id);
  }

  nodeClick(node: SearchItemViewModel) {
    this.applyNavigation(node.branchId, 'Nodes', node.buildingId, node.id);
  }

  tenantClick(tenant: SearchItemViewModel) {
    this.applyNavigation(tenant.branchId, 'Tenant', tenant.buildingId);
  }

  shopClick(shop: SearchItemViewModel) {
    this.applyNavigation(shop.branchId, 'Shops', shop.buildingId);
  }

  commonAreaClick(commonArea: SearchItemViewModel) {
    this.applyNavigation(commonArea.branchId, 'CommonAreas', commonArea.buildingId);
  }

  portfolioClick(portfolio: SearchItemViewModel) {
    this.router.navigate([`/branch/${this.branchManager.getCurrentBranch().id}/clients/${portfolio.description}/portfolios/${portfolio.id}`]);
  }
  supplierClick(supplier: SearchItemViewModel) {
    this.applyNavigation(this.branchManager.getCurrentBranch().id, 'Suppliers')
  }
  bankAccountClick(bankAccount: SearchItemViewModel) {
    this.router.navigate([`/branch/${this.branchManager.getCurrentBranch().id}/clients/${bankAccount.clientId}/bankAccount/${bankAccount.id}`]);
  }
  contactClick(contact: SearchItemViewModel) {
    this.router.navigate([`/branch/${this.branchManager.getCurrentBranch().id}/clients/${contact.clientId}/contact/${contact.id}`]);
  }
  private setBranch(branchId) {
    const currentBranch = this.branchManager.getCurrentBranch();
    if (branchId && (!currentBranch || !currentBranch.id || branchId !== currentBranch.id)) {
      this.branchManager.branchChanged(branchId);
    }
  }

  private applyNavigation(branchId, navigationCommandPath, ...navigationParams) {
    this.setBranch(branchId);
    this.navigationProvider.setBranchId(this.branchManager.getCurrentBranch().id);

    const commandsProvider = this.navigationProvider[`get${navigationCommandPath}Commands`];
    if (!commandsProvider) {
      throw new Error('Cannot get navigation commands');
    }
    const commands = commandsProvider.apply(this.navigationProvider, navigationParams);

    this.router.navigate(commands);
    this.itemSelected.next(true);
  }
}

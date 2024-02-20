import {Component, Input, OnInit} from '@angular/core';
import {ClientPortfolioViewModel, ClientViewModel, UserProfileViewModel} from '@models';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {UserProfileService} from '@services';

@Component({
  selector: 'manage-profile-clients',
  templateUrl: './manage-profile-clients.component.html',
  styleUrls: ['./manage-profile-clients.component.less']
})
export class ManageProfileClientsComponent implements OnInit {

  @Input() model: UserProfileViewModel = new UserProfileViewModel();
  @Input() allClients: ClientViewModel[] = new Array<ClientViewModel>();
  @Input() searchedClients: ClientViewModel[] = new Array<ClientViewModel>();
  @Input() isNew: boolean;
  @Input() id: string;
  @Input() showAll: boolean = true;

  showTitle: string = 'All clients';
  filterBy: string = 'Clients';
  checkAll: boolean = false;
  checkAllPartly: boolean = false;

  constructor(private activeModal: NgbActiveModal, private userProfileService: UserProfileService) {
  }

  ngOnInit() {
    this.updateSelected();

    this.searchedClients = this.allClients;
    this.searchedClients.forEach(client => {
      client.portfolios = client.portfolios;
      client.portfolios.forEach(portfolio => {
        portfolio.buildings = portfolio.buildings;
      });
    });

    this.updateCheckboxesState();

    if (!this.showAll) {
      this.showTitle = 'Only assigned clients';
    }
  }

  getClientBuildingsCount(client: ClientViewModel) {
    let buildingsCount = 0;
    for (let portfolio of client.portfolios) {
      buildingsCount += portfolio.buildings.length;
    }
    return buildingsCount;
  }

  getClientSelectedPortfoliosCount(client: ClientViewModel) {
    return client.portfolios.filter(p => p.isSelected).length;
  }

  getClientSelectedBuildingsCount(client: ClientViewModel) {
    let buildingsSelectedCount = 0;
    for (let portfolio of client.portfolios) {
      buildingsSelectedCount += portfolio.buildings.filter(b => b.isSelected).length;
    }
    return buildingsSelectedCount;
  }

  updateCheckboxesState() {
    for (let client of this.searchedClients) {
      for (let portfolio of client.portfolios) {
        let portfolioSelected = portfolio.buildings.length === portfolio.buildings.filter(b => b.isSelected).length;
        portfolio.isSelectedPartly = !portfolioSelected && !!portfolio.buildings.filter(b => b.isSelected).length;
      }
      let clientSelected = client.portfolios.length === client.portfolios.filter(p => p.isSelected).length;
      client.isSelectedPartly = !clientSelected && !!client.portfolios.filter(p => p.isSelected || p.isSelectedPartly).length;
    }
    this.updateCheckAllState();
  }

  updateCheckAllState() {
    this.checkAll = this.searchedClients.length === this.searchedClients.filter(c => c.isSelected).length;
    this.model.isAllDataSelected = this.checkAll;
    this.checkAllPartly = !this.checkAll && !!this.searchedClients.filter(c => c.isSelected || c.isSelectedPartly).length;
  }

  updateSelected() {
    this.allClients.forEach(client => {
      client.isSelected = this.model.clients.find(c => c == client.id) != null;

      client.portfolios.forEach(portfolio => {
        portfolio.isSelected = this.model.clientPortfolios.find(p => p == portfolio.id) != null;

        portfolio.buildings.forEach(building => {
          building.isSelected = this.model.buildings.find(b => b == building.id) != null;
        });
      });
    });
  }

  onClientChanged(client) {
    client.isSelected = !client.isSelected || client.isSelectedPartly;
    client.isSelectedPartly = false;
    this.updateClientState(client.id, client.isSelected);

    client.portfolios.forEach(portfolio => {

      portfolio.isSelected = client.isSelected;
      portfolio.isSelectedPartly = false;
      this.updatePortfolioState(portfolio.id, portfolio.isSelected);

      portfolio.buildings.forEach(building => {
        building.isSelected = client.isSelected;
        this.updateBuildingState(building.id, building.isSelected);
      });

    });

    this.updateCheckAllState();
  }

  onPortfolioChanged(client, portfolio) {
    portfolio.isSelected = !portfolio.isSelected || portfolio.isSelectedPartly;
    portfolio.isSelectedPartly = false;
    this.updatePortfolioState(portfolio.id, portfolio.isSelected);

    portfolio.buildings.forEach(building => {
      building.isSelected = portfolio.isSelected;
      this.updateBuildingState(building.id, building.isSelected);
    });

    client.isSelected = client.portfolios.length === client.portfolios.filter(p => p.isSelected).length;
    client.isSelectedPartly = !client.isSelected && !!client.portfolios.filter(p => p.isSelected || p.isSelectedPartly).length;
    this.updateClientState(client.id, client.isSelected);

    this.updateCheckAllState();
  }

  onBuildingChanged(client, portfolio, building) {
    building.isSelected = !building.isSelected;
    this.updateBuildingState(building.id, building.isSelected);

    portfolio.isSelected = portfolio.buildings.length === portfolio.buildings.filter(b => b.isSelected).length;
    portfolio.isSelectedPartly = !portfolio.isSelected && !!portfolio.buildings.filter(b => b.isSelected).length;
    this.updatePortfolioState(portfolio.id, portfolio.isSelected);

    client.isSelected = client.portfolios.length === client.portfolios.filter(p => p.isSelected).length;
    client.isSelectedPartly = !client.isSelected && !!client.portfolios.filter(p => p.isSelected || p.isSelectedPartly).length;
    this.updateClientState(client.id, client.isSelected);

    this.updateCheckAllState();
  }

  updateBuildingState(id: string, isSelected: boolean) {
    let oldValue = this.model.buildings.find(b => b == id) != null;

    if (isSelected != oldValue) {
      if (isSelected) {
        this.model.buildings.push(id);
      } else {
        let idx = this.model.buildings.indexOf(id);
        if (idx != -1)
          this.model.buildings.splice(idx, 1);
      }
    }
  }

  updatePortfolioState(id: string, isSelected: boolean) {
    let oldValue = this.model.clientPortfolios.find(b => b == id) != null;

    if (isSelected != oldValue) {
      if (isSelected) {
        this.model.clientPortfolios.push(id);
      } else {
        let idx = this.model.clientPortfolios.indexOf(id);
        if (idx != -1)
          this.model.clientPortfolios.splice(idx, 1);
      }
    }
  }

  updateClientState(id: string, isSelected: boolean) {
    let oldValue = this.model.clients.find(b => b == id) != null;

    if (isSelected != oldValue) {
      if (isSelected) {
        this.model.clients.push(id);
      } else {
        let idx = this.model.clients.indexOf(id);
        if (idx != -1)
          this.model.clients.splice(idx, 1);
      }
    }
  }

  dismiss() {
    this.activeModal.close({shouldReload: false});
  }

  save() {
    if (this.isNew) {
      this.userProfileService.createUserProfile(this.model).subscribe((response) => {
        this.activeModal.close({shouldReload: true, id: response.id});
      });
    } else {
      this.userProfileService.updateUserProfile(this.id, this.model).subscribe((response) => {
        this.activeModal.close({shouldReload: true});
      });
    }
  }

  onFilterBy(filterBy: string) {
    if (this.filterBy.toLowerCase() === filterBy.toLowerCase())
      return;

    this.filterBy = filterBy;
  }

  onCheckAll() {
    this.checkAll = !this.checkAll;
    this.model.isAllDataSelected = this.checkAll;
    this.checkAllPartly = false;

    this.allClients.forEach(client => {
      client.isSelected = this.checkAll;
      client.isSelectedPartly = false;
      this.updateClientState(client.id, client.isSelected);

      client.portfolios.forEach(portfolio => {

        portfolio.isSelected = this.checkAll;
        portfolio.isSelectedPartly = false;
        this.updatePortfolioState(portfolio.id, portfolio.isSelected);

        portfolio.buildings.forEach(building => {
          building.isSelected = this.checkAll;
          this.updateBuildingState(building.id, building.isSelected);
        });

      });
    });
  }

  expandClient(event, client: ClientViewModel) {
    if ((event.target && event.target.classList.contains('checkbox-toggle')) || !client.portfolios.length)
      return;

    client.isDetailed = !client.isDetailed;
  }

  expandPortfolio(event, portfolio: ClientPortfolioViewModel) {
    if ((event.target && event.target.classList.contains('checkbox-toggle')) || !portfolio.buildings.length)
      return;

    portfolio.isDetailed = !portfolio.isDetailed;
  }

  onShowAll(showAll: boolean) {
    if (this.showAll === showAll)
      return;

    this.showAll = showAll;

    if (showAll)
      this.showTitle = 'All clients';
    else
      this.showTitle = 'Only assigned clients'
  }

  search(term: string) {
    if (!term) {
      this.searchedClients = this.allClients;
      return;
    }
    term = term.toLowerCase();
    if (this.filterBy.toLowerCase() === 'clients') {
      this.searchedClients = this.allClients.filter(client => {
        let flag = false;
        flag = client.name.toLowerCase().includes(term);

        if (!flag) {
          for (let portfolio of client.portfolios) {
            flag = portfolio.name.toLowerCase().includes(term);

            if (!flag) {
              for (let building of portfolio.buildings) {
                if (building.name.toLowerCase().includes(term)) {
                  flag = true;
                  break;
                }
              }
            }

            if (flag) break;
          }
        }

        return flag;
      });
    } else if (this.filterBy.toLowerCase() === 'portfolios') {
      this.searchedClients = this.allClients;
      for (let client of this.searchedClients) {
        client.portfolios = client.portfolios.filter(portfolio => {
          let flag = false;
          flag = portfolio.name.toLowerCase().includes(term);

          if (!flag) {
            for (let building of portfolio.buildings) {
              flag = building.name.toLowerCase().includes(term);

              if (flag) break;
            }
          }

          return flag;
        });
      }
    } else if (this.filterBy.toLowerCase() === 'buildings') {
      this.searchedClients = this.allClients;
      for (let client of this.searchedClients) {
        client.portfolios = client.portfolios;
        for (let portfolio of client.portfolios) {
          portfolio.buildings = portfolio.buildings.filter(building => building.name.toLowerCase().includes(term));
        }
      }
    }
  }
}

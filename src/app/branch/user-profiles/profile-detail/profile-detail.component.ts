import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {forkJoin, of, Subscription} from 'rxjs';

import {BuildingService, UserProfileService} from '@services';
import {
  BuildingViewModel,
  ClientPortfolioViewModel,
  ClientViewModel,
  RoleViewModel,
  UserProfileUserViewModel,
  UserProfileViewModel
} from '@models';
import {StringExtension} from 'app/shared/helper/string-extension';
import {ClientService} from '../../clients/shared/client.service';
import {ManageProfileComponent} from './manage-profile/manage-profile.component';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.less'],
  providers: [ClientService, BuildingService]
})
export class ProfileDetailComponent implements OnInit, OnDestroy {

  model: UserProfileViewModel = new UserProfileViewModel();
  allClients: ClientViewModel[] = new Array<ClientViewModel>();
  selectedClients: ClientViewModel[] = new Array<ClientViewModel>();
  allRoles: RoleViewModel[] = new Array<RoleViewModel>();
  allUsers: UserProfileUserViewModel[] = new Array<UserProfileUserViewModel>();

  isNew = true;
  id: string;
  clientCount = 0;
  filterBy = 'Clients';

  public branchId: string;
  private pathFromRoot$: Subscription;

  constructor(
    private userProfileService: UserProfileService,
    private clientService: ClientService,
    private buildingService: BuildingService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.pathFromRoot$ = this.activatedRoute.pathFromRoot[2].params.subscribe(params => {
      this.branchId = params['branchid'];
    });

    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];

      if (StringExtension.isGuid(id)) {
        this.isNew = false;
        this.id = id;
      }

      this.loadData();
    });

  }

  loadData() {

    const newProfile = new UserProfileViewModel();
    newProfile.name = 'New Profile';

    let getUserPortfolioRequest = of(newProfile);
    const getUsersRequest = this.userProfileService.getAllUsers(null, null, 0, 0, 0);
    const getRolesRequest = this.userProfileService.getRoles(null, 0, 0);
    const getClients = this.userProfileService.getClients();

    if (!this.isNew) {
      getUserPortfolioRequest = this.userProfileService.getUserProfileById(this.id);
    }

    forkJoin([getUserPortfolioRequest, getClients, getRolesRequest, getUsersRequest]).subscribe((data: any[]) => {
      this.model = data[0];
      this.clientCount = this.model.clients.length;
      this.allRoles = data[2].items;
      this.allUsers = data[3].items;

      this.allClients = data[1];
      this.fetchSelectedList();

      this.model.users = this.model.users.map(u => {
        const user = new UserProfileUserViewModel();

        user.id = u.id;
        const destUser = this.allUsers.find(gUser => gUser.id == u.id);
        if (destUser) {
          user.email = destUser.email;
          user.fullName = destUser.fullName;
        }

        if (user.logoUrl) {
          user.logoUrl = u.logoUrl + '?' + Math.random();
        }

        user.descriptionRoles = u.roles.map(role => {
          const roleModel = data[2].items.find(r => r.id == role);
          return roleModel;
        });

        user.roles = u.roles;

        return user;
      });
    });
  }

  fetchSelectedList() {
    const selectedClients: ClientViewModel[] = new Array<ClientViewModel>();

    this.allClients.forEach(c => {
      let shouldAddClient = false;

      const client = new ClientViewModel();
      client.id = c.id;
      client.name = c.name;
      client.portfolios = new Array<ClientPortfolioViewModel>();
      client.logoUrl = c.logoUrl;

      let clientBuildingsLength = 0;

      if (this.model.clients.find(cId => cId == client.id)) {
        shouldAddClient = true;
        client.isSelected = true;
      }

      c.portfolios.filter(p => {
        let shouldAddPortfolio = false;

        const portfolio = new ClientPortfolioViewModel();
        portfolio.id = p.id;
        portfolio.name = p.name;
        portfolio.buildings = new Array<BuildingViewModel>();

        if (this.model.clientPortfolios.find(pId => pId == portfolio.id)) {
          portfolio.isSelected = true;

          shouldAddClient = true;
          shouldAddPortfolio = true;
        }

        p.buildings.forEach(b => {
          const building = new BuildingViewModel();
          building.id = b.id;
          building.name = b.name;
          building.categoryDescription = b.categoryDescription;
          building.totalGla = b.totalGla;
          building.logoUrl = b.logoUrl;

          if (this.model.buildings.find(bId => bId == building.id)) {
            building.isSelected = true;

            shouldAddClient = true;
            shouldAddPortfolio = true;

            portfolio.buildings.push(building);
          }
        });

        portfolio.buildingsLength = portfolio.buildings.length;
        clientBuildingsLength += portfolio.buildingsLength;

        if (shouldAddPortfolio) {
          client.portfolios.push(portfolio);
        }

      });

      client.portfoliosLength = client.portfolios.length;
      client.buildingsLength = clientBuildingsLength;

      if (shouldAddClient) {
        selectedClients.push(client);
      }

    });

    this.selectedClients = selectedClients;
  }

  onEdit(showAllClients: boolean = true) {
    const modalRef = this.modalService.open(ManageProfileComponent, {backdrop: 'static'});
    modalRef.componentInstance.model = JSON.parse(JSON.stringify(this.model));
    modalRef.componentInstance.allClients = JSON.parse(JSON.stringify(this.allClients));
    modalRef.componentInstance.isNew = this.isNew;
    modalRef.componentInstance.allUsers = JSON.parse(JSON.stringify(this.allUsers));
    modalRef.componentInstance.allRoles = JSON.parse(JSON.stringify(this.allRoles));
    modalRef.componentInstance.id = this.id;
    modalRef.componentInstance.showAllClients = showAllClients;

    modalRef.result.then((result) => {
      if (!result) {
        return;
      }

      if (result.shouldReload) {
        if (this.isNew && result.id) {
          this.id = result.id;
          this.router.navigate(['/branch', this.branchId, 'user-profiles', result.id]);
        }
        this.loadData();
      }
    }, () => {
    });
  }

  expandClient(event, client: ClientViewModel) {
    if (event.target && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('dropdown-item'))) {
      return;
    }

    client.isDetailed = !client.isDetailed;
  }

  expandPortfolio(event, portfolio: ClientPortfolioViewModel) {
    if (event.target && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('dropdown-item'))) {
      return;
    }

    portfolio.isDetailed = !portfolio.isDetailed;
  }

  onRemoveRole(user, role, idx) {

    const model = JSON.parse(JSON.stringify(this.model));

    model.users.find(u => u.id == user.id).roles.splice(idx, 1);

    if (!this.isNew) {
      this.userProfileService.updateUserProfile(this.id, model).subscribe(r => {
        user.roles.splice(idx, 1);
        user.descriptionRoles.splice(idx, 1);
      });

    }

  }

  onRemoveUser(user, idx) {

    const model = JSON.parse(JSON.stringify(this.model));
    model.users.splice(idx, 1);

    if (!this.isNew) {
      this.userProfileService.updateUserProfile(this.id, model).subscribe(r => {
        this.model.users.splice(idx, 1);
      });
    }
  }

  onFilterBy(filterBy: string) {
    if (this.filterBy.toLowerCase() === filterBy.toLowerCase()) {
      return;
    }

    this.filterBy = filterBy;
    if (filterBy.toLowerCase() === 'clients') {
      this.selectedClients.forEach(client => {
        client.isDetailed = false;
        client.portfolios.forEach(portfolio => {
          portfolio.isDetailed = false;
        });
      });
    } else if (filterBy.toLowerCase() === 'portfolios') {
      this.selectedClients.forEach(client => {
        client.isDetailed = true;
        client.portfolios.forEach(portfolio => {
          portfolio.isDetailed = false;
        });
      });
    } else {
      this.selectedClients.forEach(client => {
        client.isDetailed = true;
        client.portfolios.forEach(portfolio => {
          portfolio.isDetailed = true;
        });
      });
    }
  }

  onClientRemove(clientId: string) {
    const model = JSON.parse(JSON.stringify(this.model));
    model.clients = model.clients.filter(c => c !== clientId);
    this.userProfileService.updateUserProfile(this.id, model).subscribe((response) => {
      this.model.clients = this.model.clients.filter(c => c !== clientId);
      this.fetchSelectedList();
    });
  }

  onPortfolioRemove(client: ClientViewModel, portfolioId: string) {
    const model = JSON.parse(JSON.stringify(this.model));
    model.clientPortfolios = model.clientPortfolios.filter(p => p !== portfolioId);
    this.userProfileService.updateUserProfile(this.id, model).subscribe((response) => {
      client.portfolios = client.portfolios.filter(p => p.id !== portfolioId);
    });
  }

  onBuildingRemove(portfolio: ClientPortfolioViewModel, buildingId: string) {
    const model = JSON.parse(JSON.stringify(this.model));
    model.buildings = model.buildings.filter(b => b !== buildingId);
    this.userProfileService.updateUserProfile(this.id, model).subscribe((response) => {
      portfolio.buildings = portfolio.buildings.filter(b => b.id !== buildingId);
    });
  }

  profileTitleChanged() {
    this.userProfileService.updateUserProfile(this.model.id, this.model).subscribe();
  }

  ngOnDestroy(): void {
    this.pathFromRoot$ && this.pathFromRoot$.unsubscribe();
  }
}

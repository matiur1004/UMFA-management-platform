import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgbModal, NgbNav} from '@ng-bootstrap/ng-bootstrap';

import {
  BranchAccessPermission,
  BuildingViewModel,
  CategoryViewModel,
  ClientPortfolioViewModel,
  ClientViewModel,
  PagingViewModel
} from '@models';
import {BranchManagerService, BuildingService, PermissionService} from '@services';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';

@Component({
  selector: 'marketing-list',
  templateUrl: './marketing-list.component.html',
  styleUrls: ['./marketing-list.component.less']
})
export class MarketingListComponent implements OnInit {

  permissionChangedSubject: Subscription;
  accessPermission: BranchAccessPermission;
  model: PagingViewModel<BuildingViewModel> = new PagingViewModel<BuildingViewModel>();
  itemsPerPage: number | null = 50;
  page: number = 1;
  category: CategoryViewModel | null;
  categories: CategoryViewModel[] = new Array<CategoryViewModel>();
  clients: ClientViewModel[] = new Array<ClientViewModel>();
  client: ClientViewModel = new ClientViewModel();
  clientPortfolio: ClientPortfolioViewModel = new ClientPortfolioViewModel();
  //selectedClientPortfolioText: string = 'Select portfolio';
  searchTerms: string = '';
  //selectedClientText: string = 'Select client';
  orderIndex: number = 1;
  mapCenter = new google.maps.LatLng(-13, 23);
  mapZoom = 4;
  showOnMap = false;
  buildingsOnMap: BuildingViewModel[] = this.model.items;

  active: any = "tab-0";
  public branchId: string;
  public selectedBuilding: BuildingViewModel;
  @ViewChild('nav') private tabs: NgbNav;
  private $branchSubscruber: Subscription;

  constructor(
    private buildingService: BuildingService,
    private branchManagerService: BranchManagerService,
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.loadPermissionsData();
    this.$branchSubscruber = this.branchManagerService.getBranchObservable().subscribe((branch) => {
      this.branchId = branch.id;
      this.loadData();
    });
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.$branchSubscruber.unsubscribe();
    this.permissionChangedSubject.unsubscribe();
  }

  loadPermissionsData() {
    this.accessPermission = this.permissionService.branchAccessPermission;
    this.permissionChangedSubject = this.permissionService.getBranchPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });
  }

  loadCategories() {
    this.buildingService.getBranchCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  loadData() {
    this.buildingService.getAllForMarketing(this.category, this.orderIndex, this.searchTerms, this.page * this.itemsPerPage - this.itemsPerPage, this.itemsPerPage).subscribe((buildings) => {
      this.model = buildings;
      buildings.items.forEach(building => {
        let client = this.clients.find(c => c.id === building.client.id)
        if (client && !client.portfolios.find(p => p.id === building.clientPortfolio.id)) {
          client.portfolios.push(building.clientPortfolio);
        } else if (!client) {
          client = building.client;
          client.portfolios = new Array<ClientPortfolioViewModel>();
          client.portfolios.push(building.clientPortfolio);
          this.clients.push(client);
        }
      });

      if (buildings.items.length) {
        this.buildingsOnMap = buildings.items;
      } else {
        this.buildingService.getAllForMarketing(this.category, this.orderIndex, null, this.page * this.itemsPerPage - this.itemsPerPage, this.itemsPerPage).subscribe(buildings => {
          this.buildingsOnMap = buildings.items;
        });
      }
    });
  }

  search(term: string): void {
    this.searchTerms = term;
    this.loadData();
  }

  categorySelected(category: CategoryViewModel | null) {
    this.category = category;
    this.loadData();
  }

  /*




    setItemsPerPage(value: number | null) {
      this.itemsPerPage = value;
      this.loadData();
    }

    onPageChange(page: number) {
      this.page = page;
      this.loadData();
    }



    changeOrderIndex(idx) {
      if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
        this.orderIndex *= -1;
      else
        this.orderIndex = idx;

      this.loadData();
    }



    clientChange(client) {
      this.client = client;
      this.clientPortfolio = new ClientPortfolioViewModel();
      this.selectedClientText = client.name;
      this.selectedClientPortfolioText = "Select portfolio";

      this.buildingsOnMap = this.model.items.filter(building => building.client.id == client.id);
    }

    clientPortfolioChanged(clientPortfolio) {
      this.clientPortfolio = clientPortfolio;
      this.selectedClientPortfolioText = clientPortfolio.name;
      this.buildingsOnMap = this.model.items.filter(building => building.clientPortfolio.id == this.clientPortfolio.id);
    }





    onBuildingPress(model) {
      this.router.navigate(['marketing', model.id]);
    }
  */

  /*resetMapDropdowns() {
   this.selectedClientText = "Select client";
   this.selectedClientPortfolioText = "Select portfolio";
   this.buildingsOnMap = this.model.items;
  }*/

  delete(buildingId: string) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.buildingService.delete(buildingId).subscribe(() => {
        this.model.items = this.model.items.filter(item => item.id !== buildingId);

        this.buildingService.getBranchCategories().subscribe((categories) => {
          this.categories = categories;
        });
      });
    }, () => {
    });
  }

  onShowOnMap(building: BuildingViewModel) {
    this.selectedBuilding = building;
    this.tabs.select('tab-1');
    this.showOnMap = true;
  }

  onTabChange(nextId: string) {
    /*if (nextId === 'tab-1') {
      this.resetMapDropdowns();
      this.mapZoom = 4;
      this.mapCenter = new google.maps.LatLng(-13, 23);
    }*/
  };

}

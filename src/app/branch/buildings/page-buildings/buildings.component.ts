import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgbModal, NgbNav} from '@ng-bootstrap/ng-bootstrap';

import {BranchManagerService, BuildingService, PermissionService} from '@services';
import {
  BranchAccessPermission,
  BuildingViewModel,
  CategoryViewModel,
  ClientPortfolioViewModel,
  ClientViewModel,
  PagingViewModel
} from '@models';

import {DeleteDialogComponent} from '../../../widgets/delete-dialog/delete-dialog.component';
import * as fromStore from '../manage-building/shared/store/state/common-data.state';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.less']
})
export class BuildingsComponent implements OnInit {

  permissionChangedSubject: Subscription;
  accessPermission: BranchAccessPermission;
  model: PagingViewModel<BuildingViewModel> = new PagingViewModel<BuildingViewModel>();
  itemsPerPage: number | null = 50;
  page: number = 1;
  itemsPerPageList = [30, 50, 100]
  category: CategoryViewModel | null;
  categories: CategoryViewModel[] = new Array<CategoryViewModel>();
  clients: ClientViewModel[] = new Array<ClientViewModel>();
  client: ClientViewModel = new ClientViewModel();
  clientPortfolio: ClientPortfolioViewModel = new ClientPortfolioViewModel();
  selectedClientText: string = 'Select client';
  selectedClientPortfolioText: string = 'Select portfolio';
  searchTerms: string = '';
  orderIndex: number = 1;
  mapCenter = new google.maps.LatLng(-13, 23);
  mapZoom = 4;
  showOnMap = false;
  buildingsOnMap: BuildingViewModel[] = this.model.items;
  public currentBranchId: string;
  @ViewChild('nav') private tabs: NgbNav;
  active: any = 1;
  private branchSubscruber: Subscription;

  constructor(private buildingService: BuildingService,
              private branchManagerService: BranchManagerService,
              private modalService: NgbModal,
              private permissionService: PermissionService,
              private router: Router,
              private readonly store$: Store<fromStore.State>
  ) {
  }

  ngOnInit() {
    this.accessPermission = this.permissionService.branchAccessPermission;
    this.currentBranchId = this.branchManagerService.getBranchId();
    this.permissionChangedSubject = this.permissionService.getBranchPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });

    this.branchSubscruber = this.branchManagerService.getBranchObservable().subscribe((branch) => {
      this.currentBranchId = branch.id;
      this.buildingService.getBranchCategories().subscribe((categories) => {
        this.categories = categories;
      });
      this.loadData();
    });
  }

  loadData() {
    this.buildingService.getAll(this.category, this.orderIndex, this.searchTerms, this.page * this.itemsPerPage - this.itemsPerPage, this.itemsPerPage).subscribe((buildings) => {
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
        this.buildingService.getAll(this.category, this.orderIndex, null, this.page * this.itemsPerPage - this.itemsPerPage, this.itemsPerPage).subscribe(buildings => {
          this.buildingsOnMap = buildings.items;
        });
      }
    });
  }

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

  categorySelected(category: CategoryViewModel | null) {
    this.category = category;
    this.loadData();
  }

  setItemsPerPage(value: number | null) {
    this.itemsPerPage = value;
    this.loadData();
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadData();
  }

  getItemsDetails() {
    let text = '';

    if (this.itemsPerPage !== null) {
      let start = this.page * this.itemsPerPage - this.itemsPerPage + 1;
      let end = this.page * this.itemsPerPage;

      if (start > this.model.total) {
        start = this.model.total;
      }
      if (end > this.model.total) {
        end = this.model.total;
      }

      text = 'Showing {0}-{1} of {2} buildings';
      text = text.replace('{0}', start.toString());
      text = text.replace('{1}', end.toString());
      text = text.replace('{2}', this.model.total.toString());
    } else {
      text = 'Showing all {0} buildings'.replace('{0}', this.model.total.toString());
    }

    return text;
  }

  search(term: string): void {
    this.searchTerms = term;
    this.loadData();
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1)))
      this.orderIndex *= -1;
    else
      this.orderIndex = idx;

    this.loadData();
  }

  onShowOnMap(building: BuildingViewModel) {
    this.tabs.select('tab-1');
    this.mapZoom = 13;
    this.showOnMap = true;
    this.mapCenter = new google.maps.LatLng(building.address.latitude, building.address.longitude);
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

  resetMapDropdowns() {
    this.selectedClientText = "Select client";
    this.selectedClientPortfolioText = "Select portfolio";
    this.buildingsOnMap = this.model.items;
  }

  onTabChange(nextId: string) {
    if (nextId === '2') {
      this.resetMapDropdowns();
      this.mapZoom = 4;
      this.mapCenter = new google.maps.LatLng(-13, 23);
    }
  };

  ngOnDestroy(): void {
    this.branchSubscruber.unsubscribe();
    this.permissionChangedSubject.unsubscribe();
  }


  onBuildingPress(building) {
    if (building.isOperationsAgreementComplete) {
      this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'occupation']);
    } else {
      this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'edit']);
    }
  }
}

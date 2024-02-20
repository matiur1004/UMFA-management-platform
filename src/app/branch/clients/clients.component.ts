import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from './shared/client.service';
import {ClientViewModel} from './shared/client.model';
import {Subject, Subscription} from 'rxjs';
import {BranchManagerService, BuildingService, PermissionService} from '@services';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {BranchAccessPermission, PagingViewModel} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {ClinetPortfolioViewModel} from 'app/branch/clients/shared/clinet-portfolio.model';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less']
})
export class ClientsComponent implements OnInit, OnDestroy {

  permissionChangedSubject: Subscription;
  accessPermission: BranchAccessPermission;
  model: PagingViewModel<ClientViewModel> = new PagingViewModel<ClientViewModel>();
  charectFilter: string | null = null;
  searchTerms: string;
  offset: number = 0;
  pageSize: number = 30;
  isSymbolSelected: boolean = true;
  orderIndex: number = 1;
  page: number = 1;
  pages: number[];
  itemsPerPageList = [30, 50, 100];
  currentBranchId: string;
  private searchTermsSubject = new Subject<string>();
  private branchSubscruber: Subscription;

  constructor(
    private clientService: ClientService,
    private branchManagerService: BranchManagerService,
    private buildingService: BuildingService,
    private modalService: NgbModal,
    private permissionService: PermissionService
  ) {

  }

  ngOnInit() {
    this.currentBranchId = this.branchManagerService.getBranchId();
    this.accessPermission = this.permissionService.branchAccessPermission;
    this.permissionChangedSubject = this.permissionService.getBranchPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });

    this.branchSubscruber = this.branchManagerService.getBranchObservable().subscribe((branch) => {
      this.currentBranchId = branch.id;
      this.loadData();
    });

    this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchTerms = term;
        this.loadData();
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    this.branchSubscruber.unsubscribe();
    this.permissionChangedSubject.unsubscribe();
  }

  loadData() {
    this.clientService.getAll(this.searchTerms, this.orderIndex, this.charectFilter, this.page * this.pageSize - this.pageSize, this.pageSize).subscribe((response) => {
      this.model = response;

      if (this.pageSize) {
        let quotient = Math.floor(this.model.total / this.pageSize);
        let remainder = this.model.total % this.pageSize;
        if (remainder === 0)
          this.pages = Array.from({length: quotient}, (v, k) => k + 1);
        else
          this.pages = Array.from({length: quotient + 1}, (v, k) => k + 1);
      } else {
        this.pages = [];
      }
    });
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  filter(symbol: string | null): void {
    if (!this.charectFilter && !symbol) return;

    if (this.charectFilter == symbol) {
      this.charectFilter = null;
      this.isSymbolSelected = false;
    } else {
      this.charectFilter = symbol;
      this.isSymbolSelected = true;
    }
    this.loadData();
  }

  setItemsPerPage(value: number | null) {
    if (value > this.model.total) {
      this.page = 1;
    }
    this.pageSize = value;
    this.loadData();
  }

  setPage(page: number) {
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

  clientToggle(event: any, client: ClientViewModel) {
    if (event.target && event.target.classList.contains('dropdown-toggle'))
      return;

    if (!client.isSelected && client.totalProfiles)
      this.clientService.getById(client.id).subscribe((response) => {
        Object.assign(client, response);
        response.portfolios.forEach(portfolio => {
          this.getBuildingsList(client, portfolio);
        });
        client.isSelected = true;
      });
    else {
      client.isSelected = false;
    }
  }

  portfolioToggle(event: any, client: ClientViewModel, portfolio: ClinetPortfolioViewModel) {
    if (event.target && event.target.classList.contains('dropdown-toggle'))
      return;

    if (!portfolio.isSelected && portfolio.totalBuildings) {
      this.getBuildingsList(client, portfolio);
    } else {
      portfolio.isSelected = false;
    }
  }

  getBuildingsList(client: ClientViewModel, portfolio: ClinetPortfolioViewModel) {
    this.clientService.getBuildings(client.id, portfolio.id).subscribe((response) => {
      portfolio.buildings = response;
      portfolio.isSelected = true;
      return portfolio;
    });
  }

  onDelete(client) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.clientService.deleteClient(client.id).subscribe(() => {
        this.loadData();
      });
    }, (reason) => {
    });
  }

  onDeletePortfolio(client: ClientViewModel, clientPortfolio) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.clientService.deletePortfolio(client.id, clientPortfolio.id).subscribe(res => {
        let idx = client.portfolios.indexOf(clientPortfolio)
        if (idx != -1)
          client.portfolios.splice(idx, 1);
      });
    }, (reason) => {
    });
  }

  onDeleteBuilding(clientPortfolio, building) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.buildingService.delete(building.id).subscribe(res => {
        clientPortfolio.buildings = clientPortfolio.buildings.filter(b => b.id !== building.id);
      });
    }, (reason) => {
    });
  }

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {ClientViewModel} from './shared/client.model';
import {ClientService} from './shared/client.service';
import {BranchAccessPermission} from '@models';
import {ClientContactsComponent} from './client-contacts/client-contacts.component';
import {ClientPortfoliosComponent} from './client-portfolios/client-portfolios.component';
import {StringExtension} from 'app/shared/helper/string-extension';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {BranchManagerService, PermissionService} from '@services';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.less']
})
export class ClientComponent implements OnInit {

  @ViewChild("nav") tabs: NgbNav;
  @ViewChild("clientContactsCmp") clientContactCmp: ClientContactsComponent;
  @ViewChild("clientPortfolioCmp") clientPortfolioCmp: ClientPortfoliosComponent;

  id: string;
  isNew: boolean = true;
  model: ClientViewModel = new ClientViewModel();
  createTitle: string = "Add Contact";
  currentTab: number = 0;
  tabId: string = 'tab-0'

  public currentBranchId;

  permissionChangedSubject: Subscription;
  accessPermission: BranchAccessPermission;

  constructor(
    private branchManager: BranchManagerService,
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService,
    private router: Router,
    private location: Location,
    private permissionService: PermissionService
  ) {
  }

  ngOnInit() {
    this.currentBranchId = this.branchManager.getBranchId();
    this.accessPermission = this.permissionService.branchAccessPermission;
    this.permissionChangedSubject = this.permissionService.getBranchPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });

    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      let clientPortfolio = params['clientPortfolio'];
      let clientBankAccount = params['bankAccount'];
      let clientContact = params['contact'];
      if (StringExtension.isGuid(id)) {
        this.isNew = false;
        this.id = id;
        this.clientService.getById(this.id).subscribe((client) => {
          this.model = client;
          if (StringExtension.isGuid(clientPortfolio)) {
            this.clientService.selectedClientPortfolio = clientPortfolio;
            this.location.replaceState('/branch/' + this.currentBranchId + '/clients/' + id);
            this.tabs.select('tab-2');
          }
          if (StringExtension.isGuid(clientBankAccount)) {
            this.clientService.selectedClientBankAccount = clientBankAccount;
            this.location.replaceState('/branch/' + this.currentBranchId + '/clients/' + id);
            this.tabs.select('tab-3');
          }
          if (StringExtension.isGuid(clientContact)) {
            this.clientService.selectedClientContact = clientContact;
            this.location.replaceState('/branch/' + this.currentBranchId + '/clients/' + id);
            this.tabs.select('tab-1');
          }
          
        });
      }
    });
  }

  ngOnDestroy() {
    this.permissionChangedSubject.unsubscribe();
  }

  onSubmit(client: ClientViewModel) {
    if (this.isNew) {
      this.clientService.create(client).subscribe((response) => {
        this.model = response;
        this.id = response.id;
        this.isNew = false;

        this.router.navigate(['/branch', this.currentBranchId, 'clients', response.id]);
      });
    } else {
      this.clientService.update(this.id, client).subscribe((response) => {
        this.router.navigate(['/branch', this.currentBranchId, 'clients']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/branch', this.currentBranchId, 'clients']);
  }

  onTabChange(event) {
    if (event.nextId == 'tab-1') {
      this.currentTab = 1;
    } else if (event.nextId == 'tab-2') {
      this.currentTab = 2;
    } else {
      this.currentTab = 0;
    }
  }
}

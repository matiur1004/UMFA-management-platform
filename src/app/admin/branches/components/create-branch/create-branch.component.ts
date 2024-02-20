import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs';

import {BranchManagerService} from '@services';

import {BranchViewModel} from '../../models/branch.model';
import {BranchService} from '../../branch.service';


@Component({
  selector: 'create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.less'],
})
export class CreateBranchComponent implements OnInit, AfterViewInit {

  public model: BranchViewModel;
  public isNew: boolean;
  public detailedBankAccount: boolean;
  public tabIndex: any = 'tab-0';
  public updateData: () => void;
  @ViewChild('nav', {static: false}) private tabs: NgbNav;
  private generalInfoTabChanged = new Subject<any>();

  constructor(public activeModal: NgbActiveModal, private branchService: BranchService, private branchManager: BranchManagerService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.tabs) {
      this.tabs.select('tab-' + this.tabIndex);
    }
  }

  onTabChange(event: any) {
    if (event.activeId === 'tab-0') {
      this.generalInfoTabChanged.next(event);
    }
  };

  dismiss() {
    this.activeModal.dismiss();
  }

  next(tabIndex: number) {
    this.tabs.select('tab-' + tabIndex);
  }

  submit() {
    if (this.isNew) {
      this.branchService.create(this.model).subscribe(() => {
        this.updateData();
        this.branchManager.getAllBranches();
        this.activeModal.close();
      });
    }
  }
}

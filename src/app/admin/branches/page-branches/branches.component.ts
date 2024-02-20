import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {BranchViewModel} from '../models/branch.model';
import {BranchService} from '../branch.service';
import {CreateBranchComponent} from '../components/create-branch/create-branch.component';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.less']
})
export class BranchesComponent implements OnInit {

  model: BranchViewModel[];

  constructor(
    private branchService: BranchService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.branchService.getAll().subscribe((branches) => {
      this.model = branches;
      this.model.sort((a,b) => a.name.localeCompare(b.name));
    });
  }

  onUpdate() {
    this.branchService.update(this.model[0]).subscribe();
  }

  handleFileInput(files: FileList) {
    this.model[0].logo = files.item(0);
  }

  onCreate() {
    const options: any = {
      backdrop: 'static',
      size: 'lg'
    }
    const modalRef = this.modalService.open(CreateBranchComponent, options);
    modalRef.componentInstance.model = new BranchViewModel();
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.detailedBankAccount = false;
    modalRef.componentInstance.updateData = this.loadData;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  onEditModel(event: any, idx: number, detailedBankAccount: boolean) {
    const modalRef = this.modalService.open(CreateBranchComponent);
    modalRef.componentInstance.model = this.model[idx];
    modalRef.componentInstance.isNew = false;
    modalRef.componentInstance.detailedBankAccount = event.detailedBankAccount;
    modalRef.componentInstance.tabIndex = event.tabIndex;
  }

}

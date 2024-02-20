import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {BankAccountViewModel} from '@models';
import {StringExtension} from 'app/shared/helper/string-extension';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';
import {BankAccountService} from '@services';
import {BankAccountComponent} from '../bank-account/bank-account.component';
import { ClientService } from '@app/branch/clients/shared/client.service';


@Component({
  selector: 'bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.less']
})
export class BankAccountsComponent implements OnInit {

  model: BankAccountViewModel[] = new Array<BankAccountViewModel>();
  @Output() modelChange = new EventEmitter<BankAccountViewModel[]>();

  id: string;

  constructor(private bankAccountService: BankAccountService, private activatedRoute: ActivatedRoute, private modalService: NgbModal, private clientService: ClientService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (StringExtension.isGuid(id)) {
        this.id = id;
        this.loadData();
      }
    });
  }

  view(index: number) {
    let bankAccount = this.model[index];
    const modalRef = this.modalService.open(BankAccountComponent);
    modalRef.componentInstance.model = bankAccount;
    modalRef.componentInstance.isNew = false;
    modalRef.componentInstance.buildingId = this.id;

    modalRef.result.then((result) => {
      this.model[index] = result;
    }, (reason) => {
    });
  }

  edit(index: number) {
    let bankAccount = this.model[index];

    const modalRef = this.modalService.open(BankAccountComponent);
    modalRef.componentInstance.model = bankAccount;
    modalRef.componentInstance.isNew = false;
    modalRef.componentInstance.buildingId = this.id;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  loadData() {
    this.bankAccountService.getBankAccounts(this.id).subscribe((bankAccounts) => {
      bankAccounts.forEach(p => {
        this.model = bankAccounts;
        if (this.clientService.selectedClientBankAccount) {
          let currentClientBankAccount = bankAccounts.findIndex(p => p.id == this.clientService.selectedClientBankAccount);
          if (currentClientBankAccount > -1) {
            this.clientService.selectedClientBankAccount = '';
            this.edit(currentClientBankAccount);
          }
        }
      });
      
    });
  }

  delete(index: number) {
    const modalRef = this.modalService.open(DeleteDialogComponent, {backdrop: 'static'});
    modalRef.result.then((result) => {
      let bankAccount = this.model[index];
      this.bankAccountService.deleteBankAccount(this.id, bankAccount.id).subscribe(() => {
        this.model = this.model.filter(b => b.id !== bankAccount.id);
      });
    }, (reason) => {
    });


  }

  add() {
    const modalRef = this.modalService.open(BankAccountComponent);
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.buildingId = this.id;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }
}

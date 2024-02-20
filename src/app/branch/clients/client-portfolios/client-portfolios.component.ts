import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreatePortfolioComponent} from './create-portfolio/create-portfolio.component';
import {ClinetPortfolioViewModel} from '../shared/clinet-portfolio.model';
import {ClientViewModel} from '../shared/client.model';
import {ClientService} from '../shared/client.service';
import {DeleteDialogComponent} from 'app/widgets/delete-dialog/delete-dialog.component';

@Component({
  selector: 'client-portfolios',
  templateUrl: './client-portfolios.component.html',
  styleUrls: ['./client-portfolios.component.less']
})
export class ClientPortfoliosComponent implements OnInit {

  @Input() model: ClientViewModel;

  portfolios: ClinetPortfolioViewModel[] = new Array<ClinetPortfolioViewModel>();

  constructor(private modalService: NgbModal, private clientService: ClientService) {
  }

  ngOnInit() {
    this.loadData();
  }

  onCreate() {
    const modalRef = this.modalService.open(CreatePortfolioComponent);
    modalRef.componentInstance.model = new ClinetPortfolioViewModel();
    modalRef.componentInstance.isNew = true;
    modalRef.componentInstance.clientId = this.model.id;
    modalRef.result.then((shouldReload) => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  onEdit(event: any, clientPortfolio: ClinetPortfolioViewModel) {
    if (event && event.target && (event.target.classList.contains('dropdown-toggle') || event.target.classList.contains('on-delete')))
      return;

    const modalRef = this.modalService.open(CreatePortfolioComponent);
    modalRef.componentInstance.model = clientPortfolio;
    modalRef.componentInstance.isNew = false;
    modalRef.componentInstance.clientId = this.model.id;
    modalRef.result.then((shouldReload) => {
      if (shouldReload) {
        this.loadData();
      }
    }, () => {
    });
  }

  onDelete(portfolio, idx) {
    const modalRef = this.modalService.open(DeleteDialogComponent);
    modalRef.result.then((result) => {
      this.clientService.deletePortfolio(this.model.id, portfolio.id).subscribe(() => {
        this.loadData();
      });
    }, () => {
    });
  }

  loadData() {
    this.clientService.getPortfolios(this.model.id).subscribe(portfolios => {
      portfolios.forEach(p => {
        if (this.clientService.selectedClientPortfolio) {
          let currentClientPortfolio = portfolios.find(p => p.id == this.clientService.selectedClientPortfolio);

          if (currentClientPortfolio) {
            this.clientService.selectedClientPortfolio = '';
            this.onEdit({}, currentClientPortfolio);
          }
        }
      });
      this.portfolios = portfolios;
    });
  }


}

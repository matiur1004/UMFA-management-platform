import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import * as portfolioActions from './shared/store/actions/portfolio.actions';

import * as portfolioSelector from './shared/store/selectors/portfolios.selector';
import {PortfolioViewModel} from './shared/models/buildings.model';

@Component({
  selector: 'client-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.less']
})
export class BuildingsComponent implements OnInit, OnDestroy {

  portfolios$: Observable<PortfolioViewModel[]>;
  numberOfBuildings$: Observable<number>;

  constructor(private router: Router, private store: Store<any>) {
    this.portfolios$ = store.pipe(select(portfolioSelector.getPortfolios));
    this.numberOfBuildings$ = store.pipe(select(portfolioSelector.getTotalNumberOfBuildings));
  }

  ngOnInit() {
    this.store.dispatch(new portfolioActions.ClientPortfolioListRequest());
  }

  ngOnDestroy() {

  }

  portfolioToggle(event) {
    this.store.dispatch(new portfolioActions.UpdateIsToggle(event));
  }

  onGetBuildingView(event) {
    this.router.navigate(['client', 'buildings', event]);
  }

}

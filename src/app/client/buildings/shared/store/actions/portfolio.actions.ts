import {Action as StoreAction} from '@ngrx/store';

export const CLIENT_PORTFOLIO_LIST_REQUEST = '[Client Portfolios] CLIENT_PORTFOLIO_LIST_REQUEST';
export const CLIENT_PORTFOLIO_LIST_REQUEST_COMPLETE = '[Client Portfolios] CLIENT_PORTFOLIO_LIST_REQUEST_COMPLETE';

export const UPDATE_IS_TOGGLE = '[Client Portfolios] UPDATE_IS_TOGGLE';

export const SET_PORTFOLIO = '[Client Portfolios] SET_PORTFOLIO';

export class ClientPortfolioListRequest implements StoreAction {
  readonly type = CLIENT_PORTFOLIO_LIST_REQUEST;

  constructor() {
  }
}

export class ClientPortfolioListRequestComplete implements StoreAction {
  readonly type = CLIENT_PORTFOLIO_LIST_REQUEST_COMPLETE;

  constructor(public payload: any) {
  }
}

export class UpdateIsToggle implements StoreAction {
  readonly type = UPDATE_IS_TOGGLE;

  constructor(public payload: any) {
  }
}

export class SetPortfolio implements StoreAction {
  readonly type = SET_PORTFOLIO;

  constructor(public payload: any) {
  }
}

export type Actions = ClientPortfolioListRequest | ClientPortfolioListRequestComplete |
  UpdateIsToggle | SetPortfolio;

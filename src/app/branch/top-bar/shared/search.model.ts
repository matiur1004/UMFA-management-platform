export class SearchViewModel {
  clients: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  buildings: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  users: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  equipments: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  tenants: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  shops: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  nodes: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  commonAreas: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  suppliers: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  portfolios: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  bankAccounts: SearchItemViewModel[] = new Array<SearchItemViewModel>();
  contacts: SearchItemViewModel[] = new Array<SearchItemViewModel>();
}

export class SearchItemViewModel {
  id: string;
  title: string;
  description: string;
  branchId: string;
  buildingId: string;
  clientId: string;
}

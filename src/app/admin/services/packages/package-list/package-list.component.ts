import {Component, OnInit} from '@angular/core';
import {PackageViewModel} from '@models';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import * as fromPackages from '../shared/store/reducers';
import * as packagesAction from '../shared/store/actions/packages.actions';
import {Router} from '@angular/router';

@Component({
  selector: 'package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.less'],
})
export class PackageListComponent implements OnInit {

  packagesList$: Observable<PackageViewModel[]>;
  packagesOrder$: Observable<number>;
  packagesCategory$: Observable<number>;
  page$: Observable<number>;
  packagesItemsDetailsText$: Observable<string>;

  slideConfig = {"slidesToShow": 4, "slidesToScroll": 4, "infinite": false};

  constructor(private store: Store<fromPackages.State>, private router: Router) {
    this.packagesList$ = store.select(fromPackages.getPackagesWithFilter);
    this.page$ = store.select(fromPackages.getPage);
    this.packagesItemsDetailsText$ = store.select(fromPackages.getItemsDetails);
    this.packagesOrder$ = store.select(fromPackages.getPackagesOrder);
    this.packagesCategory$ = store.select(fromPackages.getPackagesCategory);
  }

  ngOnInit() {
    this.store.dispatch(new packagesAction.GetPackagesRequest());
  }

  onCreate() {
    this.router.navigate(['admin/services/packages/craete']);
  }

  onChangePackageStatus(event) {
    this.store.dispatch(new packagesAction.UpdatePackageStatusRequest(event));
  }

  onDelete(event) {
    this.store.dispatch(new packagesAction.DeletePackageRequest(event));
  }

  onChangeOrder(event) {
    this.store.dispatch(new packagesAction.UpdatePackagesOrder(event));
  }

  onChangeCategory(event) {
    this.store.dispatch(new packagesAction.UpdatePackagesCategory(event));
  }

}

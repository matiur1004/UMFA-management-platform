import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, startWith, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as supplierStore from '../shared/store/reducers';
import * as supplierSelectors from '../shared/store/selectors';

@Component({
  selector: 'manage-supplier',
  templateUrl: './manage-supplier.component.html',
  styleUrls: ['./manage-supplier.component.less']
})
export class ManageSupplierComponent implements OnInit, OnDestroy {
  supplierId: string;
  tabId: string = "tab-0";
  redirectPath: any[] = ['admin', 'suppliers'];
  private destroyed = new Subject();

  constructor(
    private store: Store<supplierStore.State>,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.store.pipe(select(supplierSelectors.getSupplierId)).subscribe(supplierId => {
      this.supplierId = supplierId;
    });
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      startWith(this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
      takeUntil(this.destroyed)
    )
      .subscribe((event) => {
        this.tabId = event['tab'];
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onBeforeTabChange($event) {
    switch ($event.nextId) {
      case 'tab-0':
        this.router.navigate(['admin', 'suppliers', this.supplierId]);
        break;
      case 'tab-1':
        this.router.navigate(['admin', 'suppliers', this.supplierId, 'categories']);
        break;
      case 'tab-2':
        this.router.navigate(['admin', 'suppliers', this.supplierId, 'tariffs']);
        break;
    }

  }
}

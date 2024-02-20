import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, startWith, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {FormGroupState} from "ngrx-forms";
import {FormValue} from "@app/shared/tariffs/store/reducers/tariff-form.store";
import {select, Store} from "@ngrx/store";
import * as fromTariff from '../../../shared/store/reducers';
import * as selectors from '../../../shared/store/selectors';
import * as tariffActions from '../../../shared/store/actions/tariff.actions';


@Component({
  selector: 'manage-tariff-version',
  templateUrl: './manage-tariff-version.component.html',
  styleUrls: ['./manage-tariff-version.component.less']
})
export class ManageTariffVersionComponent implements OnInit, OnDestroy {
  tabId: string = 'tab-0';
  redirectPath: any[];

  formState$: Observable<FormGroupState<FormValue>>;

  private destroyed = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store$: Store<fromTariff.State>,
  ) {
    this.formState$ = this.store$.pipe(select(selectors.getTariffForm));
  }

  ngOnInit(): void {
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

    this.redirectPath = ['admin', 'suppliers', this.activatedRoute.snapshot.params['supplierId'], 'tariffs'];

  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onBeforeTabChange($event): void {
    const routeExtras = {relativeTo: this.activatedRoute}

    switch ($event.nextId) {
      case 'tab-0':
        this.router.navigate(['./'], routeExtras);
        break;
      case 'tab-1':
        this.router.navigate(['settings'], routeExtras);
        break;
    }
  }

  addTariffVersion(): void {
    this.store$.dispatch(new tariffActions.AddTariffVersion(false));
  }
}

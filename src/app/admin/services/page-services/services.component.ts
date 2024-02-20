import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Location} from '@angular/common'
import {filter, map} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.less']
})
export class ServicesComponent implements OnInit, OnDestroy {

  tabId: string = 'tab-0';

  routeEvent$: Subscription;

  constructor(router: Router, route: ActivatedRoute, private location: Location) {
    this.routeEvent$ = router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => {
        return route.snapshot.data['tab'];
      })).subscribe(r => {
      if (r) {
        this.tabId = r;
      }
    });

  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.routeEvent$.unsubscribe();
  }

  onBeforeTabChange($event) {
    let toReplace = '/admin/services';
    if ($event.nextId === 'tab-1')
      toReplace = '/admin/services/packages';
    if ($event.nextId === 'tab-2')
      toReplace = '/admin/services/meter-types';

    this.location.replaceState(toReplace);
  }

}

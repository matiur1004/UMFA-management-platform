import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, Subscription} from 'rxjs';

@Component({
  selector: 'manage-tariffs',
  templateUrl: './manage-tariffs.component.html',
  styleUrls: ['./manage-tariffs.component.less']
})
export class ManageTariffsComponent implements OnInit, OnDestroy {
  public versionId = 0;
  public buildingId: string;
  public branchId: string;
  private pathSubscriptoin$: Subscription;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.pathSubscriptoin$ = combineLatest(
      this.activatedRoute.pathFromRoot[2].params,
      this.activatedRoute.pathFromRoot[4].params,
      this.activatedRoute.pathFromRoot[5].params
    ).subscribe(([branchParams, buildingParams, versionParams]) => {
      this.branchId = branchParams['branchid'];
      this.buildingId = buildingParams['id'];
      this.versionId = versionParams['vid'] || 0;
    });
  }

  ngOnDestroy() {
    this.pathSubscriptoin$ && this.pathSubscriptoin$.unsubscribe();
  }
}

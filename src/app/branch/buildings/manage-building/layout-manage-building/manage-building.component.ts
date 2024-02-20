import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';

import {BuildingModel, BuildingViewModel} from '@models';
import {BranchManagerService, BuildingService} from '@services';

import * as fromOccupation from '../occupation/shared/store/reducers';

import * as fromMeterReadings from '../meter-readings/billing-readings/shared/store/reducers';
import * as billingReadingsAction from '../meter-readings/billing-readings/shared/store/actions/billing-readings.actions';
@Component({
  selector: 'manage-building',
  templateUrl: './manage-building.component.html',
  styleUrls: ['./manage-building.component.less']
})
export class ManageBuildingComponent implements OnInit {

  buildingId: string;
  building: BuildingViewModel = new BuildingViewModel();
  buildings: BuildingModel[] = new Array<BuildingModel>();
  isComplete: boolean = true;
  isComplete$: Observable<boolean>;

  public currentBranchId: string;

  constructor(
    private buildingService: BuildingService,
    private branchManager: BranchManagerService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<fromOccupation.State>,
    private meterStore: Store<fromMeterReadings.State>,
  ) {
    this.isComplete$ = this.store.select(fromOccupation.getCompleteStatus);
  }

  ngOnInit(): void {
    this.currentBranchId = this.branchManager.getBranchId();
    this.activatedRoute.params.subscribe(params => {
      this.buildingId = params['id'];

      this.buildingService.getAll().subscribe(buildings => {
        if (buildings.items.length) {
          this.buildings = [];
          buildings.items.forEach((item: any) => {
            const building = new BuildingModel();
            building.id = item.id;
            building.name = item.name;
            building.address = item.address;
            if (item.id == this.buildingId) {
              building.isSelected = true;
              this.isComplete = item.isOccupationComplete;
            }
            this.buildings.push(building);
          });
          this.building = buildings.items.find(b => b.id === this.buildingId);
        }
      });
    });
  }

  isActive(subpath) {
    const url = this.router.url;
    return url.indexOf(subpath) !== -1;
  }

  onBuildingSelected(building: BuildingModel) {
    this.building.id = building.id;
    this.building.name = building.name;

    let url = this.router.url;
    let lastUrlSegment = url.substr(url.lastIndexOf('/') + 1);
    this.meterStore.dispatch(new billingReadingsAction.UpdateSearchKey(''));
  
    switch (lastUrlSegment) {
      case 'occupation':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'occupation']);
        break;
      case 'tenants':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'tenants']);
        break;
      case 'equipment':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'equipment']);
        break;
      case 'meter-readings':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'meter-readings']);
        break;
      case 'reports':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'reports']);
        break;
      case 'history':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'history']);
        break;
      case 'locations':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'equipment', 'locations']);
        break;
      case 'nodes':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'equipment', 'nodes']);
        break;
      case 'equipment-templates':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'equipment', 'equipment-templates']);
        break;
      case 'equipment-tree':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'equipment', 'equipment-tree']);
        break;
      case 'allocated-tariffs':
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'tariffs', 'allocated-tariffs']);
        break;

      default:
        this.router.navigate(['/branch', this.currentBranchId, 'buildings', building.id, 'version', 0, 'occupation']);
        break;
    }
  }
}

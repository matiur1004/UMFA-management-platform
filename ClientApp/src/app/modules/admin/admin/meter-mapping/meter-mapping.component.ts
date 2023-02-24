import {
    NgModule,
    Component,
    Pipe,
    PipeTransform,
    enableProdMode,
    OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IAmrMeter, IUmfaBuilding, IopUser } from 'app/core/models';
import {
    BuildingService,
    MeterService,
    SnackBarService,
    UserService,
} from 'app/shared/services';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import {
    FormControl,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'app/shared/services/dialog.service';
import { IUmfaMeter } from 'app/core/models/umfameter.model';

@Component({
    selector: 'app-meter-mapping',
    templateUrl: './meter-mapping.component.html',
    styleUrls: ['./meter-mapping.component.scss'],
})

export class MeterMappingComponent implements OnInit {
    user: IopUser;
    umfaMeters$: Observable<IUmfaMeter[]>;
    scadaMeters$: any = {};
    mappedMeters$: any = {};
    selectedBuildingId: 0;
    selectedAmrMeter: any;
    selectedUmfaMeter: any;
    selectedMappedMeter: any;
    buildings: IUmfaBuilding[];
    readonly allowedPageSizes = [10, 15, 20, 50, 'All'];
    selectedRegistryControl = new FormControl();
    selectedTOUControl = new FormControl();
    loading: boolean = true;
    form: UntypedFormGroup;
    meters$: Observable<IAmrMeter[]>;
    errMessage: any;
    UmfaId: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private meterService: MeterService,
        private sbService: SnackBarService,
        private bldService: BuildingService,
        private usrService: UserService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.form = this._formBuilder.group({
            Id: [0],
            UmfaId: [null],
        })
        const usr = this.usrService.userValue;
        this.bldService.getBuildingsForUser(usr.UmfaId).subscribe({
            next: (bldgs) => {
                this.onBuildingsRetrieved(bldgs);
            },
            error: (err) => (this.errMessage = err),
            complete: () => (this.loading = false),
        });
        this.meters$ =  this.meterService.getMetersForUser(usr.Id);
    }

    getBuildings(): void {
        const usr = this.usrService.userValue;
        this.bldService.getBuildingsForUser(usr.UmfaId).subscribe({
            next: (bldgs) => {
                this.onBuildingsRetrieved(bldgs);
            },
            error: (err) => (this.errMessage = err),
            complete: () => (this.loading = false),
        });
    }

    onBuildingsRetrieved(bldgs: any) {
        this.buildings = bldgs;
        // this.UmfaId = this.buildings[0].BuildingId;
    }

    selectionChanged(e: any) {
        console.log("Selected BuildingId: " + e.BuildingId);
        this.selectedBuildingId = e.BuildingId;
        this.umfaMeters$ = this.bldService.getMetersForBuilding(e.BuildingId)
      }

    selectAmrMeter(e) {
        this.selectedAmrMeter = e.value;
        console.log("AMR Meter: " + this.selectedAmrMeter);
    }

    selectUmfaMeter(e) {
        this.selectedUmfaMeter = e.selectedRowsData[0];
        console.log("Umfa Meter: " + this.selectedUmfaMeter);
    }

    selectMappedMeter(e) {
        this.selectedMappedMeter = e.selectedRowsData[0];
        console.log("Mapped Meter: " + this.selectedMappedMeter);
    }

    onDelete(e) {
        console.log('Delete', e);
        e.event.preventDefault();
    }
}

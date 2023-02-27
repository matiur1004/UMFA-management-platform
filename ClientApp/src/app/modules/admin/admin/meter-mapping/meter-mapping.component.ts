import {
    NgModule,
    Component,
    Pipe,
    PipeTransform,
    enableProdMode,
    OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { IUmfaBuilding, IopUser } from 'app/core/models';
import {
    BuildingService,
    MeterService,
    SnackBarService,
    UserService,
} from 'app/shared/services'
import {
    FormControl,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUmfaMeter } from 'app/core/models/umfameter.model';
import { IAmrUser } from 'app/core/models';
import { IScadaMeter } from 'app/core/models/scadameter.model';
import { IMappedMeter } from 'app/core/models/mappedmeter.model';

@Component({
    selector: 'app-meter-mapping',
    templateUrl: './meter-mapping.component.html',
    styleUrls: ['./meter-mapping.component.scss'],
})

export class MeterMappingComponent implements OnInit {
    user: IopUser;
    umfaMeters$: Observable<IUmfaMeter[]>;
    scadaMeters$: Observable<IScadaMeter[]>;
    mappedMeters$: Observable<IMappedMeter[]>;
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
    //meters$: Observable<IAmrMeter[]>;
    errMessage: any;
    scadaUser: IAmrUser;
    scadaUserName: any;
    scadaPassword: any;
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
        //this.meters$ =  this.meterService.getMetersForUser(usr.Id);
    }

    onBuildingsRetrieved(bldgs: any) {
        this.buildings = bldgs;
    }

    selectionChanged(e: any) {
        console.log("Selected BuildingId: " + e.BuildingId);
        this.selectedBuildingId = e.BuildingId;
        this.getUmfaMetersForBuilding(this.selectedBuildingId);
        this.getScadaUserDetails(this.UmfaId);
        this.getMappedMetersForBuilding(this.UmfaId)
      }

    getUmfaMetersForBuilding(buildingId): void {
        this.bldService.getMetersForBuilding(buildingId).subscribe({
            next: (metrs) => {
                this.onBuildingsRetrieved(metrs);
            },
            error: (err) => (this.errMessage = err),
            complete: () => (this.loading = false),
        });
    }

    onMetersRetrieved(metrs: any ){
        this.umfaMeters$ = metrs;
    }

    getScadaUserDetails(userId){
        this.usrService.getAmrScadaUser(userId).subscribe({
            next: au => {
              this.onAmrScadaUserRetrieved(au)
            },
            error: err => this.errMessage = err
          });
    }

    async onAmrScadaUserRetrieved(aU: IAmrUser): Promise<void> {
        this.scadaUser = aU;
            this.scadaUserName =  this.scadaUser.ScadaUserName;
            this.scadaPassword = this.scadaUser.ScadaPassword;
            this.getScadaMetersForUser(this.scadaUserName, this.scadaPassword)
    }

    getScadaMetersForUser(userName, userPassword){
        // this.usrService.getAmrScadaUser(userId).subscribe({
        //     next: au => {
        //       this.onAmrScadaUserRetrieved(au)
        //     },
        //     error: err => this.errMessage = err
        //   });

    }

    getMappedMetersForBuilding(buildingId){

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

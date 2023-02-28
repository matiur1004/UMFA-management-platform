import {
    NgModule,
    Component,
    Pipe,
    PipeTransform,
    enableProdMode,
    OnInit,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
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
    Validators,
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
    umfaMeters: IUmfaMeter[] = [];
    scadaMeters: IScadaMeter[] = [];
    mappedMeters$: Observable<IMappedMeter[]>;
    selectedBuildingId: 0;
    selectedUmfaMeter: any;
    selectedScadaMeter: any;
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

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private bldService: BuildingService,
        private usrService: UserService,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit() {
        this.form = this._formBuilder.group({
            //Id: [0],
            UmfaId: [null, Validators.required],
            UmfaMeterId: [null, Validators.required],
            ScadaMeterId: [null, Validators.required],
            RegisterType: [null, Validators.required],
            TimeOfUse: [null, Validators.required],
            SupplyType: [null, Validators.required],
            Location: [null, Validators.required],
            Description: ['', Validators.required]
        })
        this.bldService.buildings$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: IUmfaBuilding[]) => {
                this.buildings = data;
            });
        //this.meters$ =  this.meterService.getMetersForUser(usr.Id);
    }

    selectionChanged(e: any) {
        this.selectedBuildingId = e.BuildingId;
        this.getUmfaMetersForBuilding(this.selectedBuildingId);
        this.getScadaUserDetails(this.usrService.userValue.UmfaId);
        this.getMappedMetersForBuilding(e.BuildingId)
      }

    getUmfaMetersForBuilding(buildingId): void {
        this.bldService.getMetersForBuilding(buildingId).subscribe({
            next: (metrs) => {
                this.onMetersRetrieved(metrs);
            },
            error: (err) => (this.errMessage = err),
            complete: () => (this.loading = false),
        });
}

    onMetersRetrieved(metrs: any ){
        this.umfaMeters = metrs;
    }

    getScadaUserDetails(userId){
        this.usrService.getAmrScadaUser(1).subscribe({
            next: au => {
              this.onAmrScadaUserRetrieved(au)
            },
            error: err => this.errMessage = err
          });
    }

    async onAmrScadaUserRetrieved(aU: IAmrUser): Promise<void> {
        this.scadaUser = aU;
        // this.scadaUserName =  this.scadaUser.ScadaUserName;
        // this.scadaPassword = this.scadaUser.ScadaPassword;
        this.scadaUserName = 'umfagtw.gtwadmin';
        this.scadaPassword = 'gtwgtwumfa';
        this.getScadaMetersForUser(this.scadaUserName, this.scadaPassword)
    }

    getScadaMetersForUser(userName, userPassword){
        this.usrService.getScadaMetersForUser(userName, userPassword).subscribe(res => {
            this.scadaMeters = res;
        })
    }

    getMappedMetersForBuilding(buildingId){
        this.bldService.getMappedMetersForBuilding(buildingId).subscribe(res => {
            console.log('mapped meters', res);
        })
    }

    selectScadaMeter(e) {
        console.log(e);
        this.selectedScadaMeter = e.data;
        this.form.get('ScadaMeterId').setValue(this.selectedScadaMeter.Serial);
    }

    selectUmfaMeter(event) {
        this.selectedUmfaMeter = event.data;
        this.form.get('UmfaMeterId').setValue(this.selectedUmfaMeter.MeterId);
    }

    selectMappedMeter(e) {
        this.selectedMappedMeter = e.selectedRowsData[0];
        console.log("Mapped Meter: " + this.selectedMappedMeter);
    }

    onDelete(e) {
        console.log('Delete', e);
        e.event.preventDefault();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}

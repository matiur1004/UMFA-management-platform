import {
    NgModule,
    Component,
    Pipe,
    PipeTransform,
    enableProdMode,
    OnInit,
    ViewChild,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IUmfaBuilding, IopUser } from 'app/core/models';
import {
    BuildingService,
    MeterMappingService,
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
import { DxDataGridComponent } from 'devextreme-angular';
import dxDataGrid from 'devextreme/ui/data_grid';
import { ALERT_MODAL_CONFIG, CONFIRM_MODAL_CONFIG } from '@core/config/modal.config';
import { UmfaUtils } from '@core/utils/umfa.utils';

@Component({
    selector: 'app-meter-mapping',
    templateUrl: './meter-mapping.component.html',
    styleUrls: ['./meter-mapping.component.scss'],
})

export class MeterMappingComponent implements OnInit {
    @ViewChild('umfaMeterTable') umfaMeterGrid!: DxDataGridComponent;
    @ViewChild('scadaMeterTable') scadaMeterGrid!: DxDataGridComponent;

    user: IopUser;
    umfaMeters: IUmfaMeter[] = [];
    scadaMeters: IScadaMeter[] = [];
    mappedMeters: IMappedMeter[] = [];
    selectedBuildingId = 0;
    selectedPartnerId = 0;
    selectedUmfaMeter: any;
    selectedScadaMeter: any;
    selectedMappedMeter: any;
    buildings: IUmfaBuilding[];
    allBuildings: IUmfaBuilding[] = [];
    partners: IUmfaBuilding[];
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
    applyFilterTypes: any;
    currentFilter: any;

    registerTypes: any[] = [];
    timeOfUses: any[] = [];
    supplyTypes: any[] = [];
    supplyToItems: any[] = [];
    locationTypes: any[] = [];
    filteredlocationTypes: any[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private bldService: BuildingService,
        private mappedMetersService: MeterMappingService,
        private usrService: UserService,
        private _formBuilder: UntypedFormBuilder,
        private _ufUtils: UmfaUtils
    ) {
        this.onRemoveMappedMeter = this.onRemoveMappedMeter.bind(this);
        this.applyFilterTypes = [{
            key: 'auto',
            name: 'Immediately',
        }, {
            key: 'onClick',
            name: 'On Button Click',
        }];
        this.currentFilter = this.applyFilterTypes[0].key;
    }

    ngOnInit() {
        this.form = this._formBuilder.group({
            //Id: [0],
            partnerId: [null, Validators.required],
            UmfaId: [null, Validators.required],
            UmfaMeterId: [null, Validators.required],
            ScadaMeterId: [null, Validators.required],
            RegisterType: [null, Validators.required],
            TimeOfUse: [null, Validators.required],
            SupplyType: [null, Validators.required],
            SupplyTo: [null, Validators.required],
            LocationType: [null, Validators.required],
            Description: ['', Validators.required]
        })
        this.bldService.buildings$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: IUmfaBuilding[]) => {
                this.allBuildings = data;
                this.buildings = data;
            });

        this.bldService.partners$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any[]) => {
                this.partners = data;
            });

        this.mappedMetersService.registerTypes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any[]) => {
                this.registerTypes = data;
            });

        this.mappedMetersService.timeOfUses$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any[]) => {
                this.timeOfUses = data;
            });

        this.mappedMetersService.supplyTypes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any[]) => {
                this.supplyTypes = data;
            });

        this.mappedMetersService.supplyToItems$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any[]) => {
                this.supplyToItems = data;
            });

        this.mappedMetersService.locationTypes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any[]) => {
                this.locationTypes = data;
                this.filteredlocationTypes = data;
            });

        this.form.get('SupplyType').valueChanges.subscribe(supplyType => {
            this.filteredlocationTypes = this.locationTypes.filter(item => item.SupplyType == supplyType);
            if(this.form.get('SupplyTo').value) {
                this.filteredlocationTypes = this.filteredlocationTypes.filter(item => item.SuppliesTo == this.form.get('SupplyTo').value);
            }
        })

        this.form.get('SupplyTo').valueChanges.subscribe(supplyTo => {
            this.filteredlocationTypes = this.locationTypes.filter(item => item.SuppliesTo == supplyTo);
            if(this.form.get('SupplyType').value) {
                this.filteredlocationTypes = this.filteredlocationTypes.filter(item => item.SupplyType == this.form.get('SupplyType').value);
            }
        })
        //this.meters$ =  this.meterService.getMetersForUser(usr.Id);
    }

    selectionChanged(e: any) {
        this.selectedBuildingId = e.BuildingId;
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

    onMetersRetrieved(metrs: IUmfaMeter[]) {
        this.umfaMeters = metrs;
        this.updateUmfaMeterMappedField();
    }

    onUmfaMeterRowPrepared(event) {
        if (event.rowType === "data") {
            let meterId = event.data.MeterId;
            if (this.mappedMeters.find(mm => mm.BuildingServiceId == meterId)) {
                event.rowElement.style.background = '#4ade80'; //#212c4f
                //event.rowElement.style.color = 'white';
            }
        }
    }

    onScadaMeterRowPrepared(event) {
        if (event.rowType === "data") {
            let serialNo = event.data.Serial;
            if (this.mappedMeters.find(mm => mm.ScadaSerial == serialNo)) {
                event.rowElement.style.background = '#4ade80';
                //event.rowElement.style.color = 'white';
            }
        }
    }

    customBuildingSearch(term: string, item: any) {
        term = term.toLocaleLowerCase();
        return item.Name.toLocaleLowerCase().indexOf(term) > -1;
    }

    getScadaUserDetails(userId) {
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

    getScadaMetersForUser(userName, userPassword) {
        this.usrService.getScadaMetersForUser(userName, userPassword).subscribe(res => {
            this.scadaMeters = res;
            this.updateScadaMeterMappedField();
        })
    }

    getMappedMetersForBuilding(buildingId) {
        this.bldService.getMappedMetersForBuilding(buildingId).subscribe(res => {
            this.mappedMeters = res;
            this.getUmfaMetersForBuilding(this.selectedBuildingId);
            this.getScadaUserDetails(this.usrService.userValue.UmfaId);
            //console.log('mapped meters', res);
        })
    }

    selectScadaMeter(e) {
        this.selectedScadaMeter = e.data;
        this.form.get('ScadaMeterId').setValue(this.selectedScadaMeter.Serial);
    }

    selectUmfaMeter(event) {
        this.selectedUmfaMeter = event.data;
        this.form.get('UmfaMeterId').setValue(this.selectedUmfaMeter.MeterId);
    }

    selectMappedMeter(e) {
        this.selectedMappedMeter = e.data;
        console.log("Mapped Meter: " + this.selectedMappedMeter);
    }

    onDelete(e) {
        console.log('Delete', e);
        e.event.preventDefault();
    }

    addMeterMapping() {
        let formData = this.form.value;
        let building = this.buildings.find(bld => bld.BuildingId == formData['UmfaId']);
        let umfaMeter = this.umfaMeters.find(ufM => ufM.MeterId == formData['UmfaMeterId']);
        let scadaMeter = this.scadaMeters.find(scm => scm.Serial == formData['ScadaMeterId']);
        let touItem = this.timeOfUses.find(tou => tou.Id == formData['TimeOfUse']);
        let registerTypeItem = this.registerTypes.find(rt => rt.RegisterTypeId == formData['RegisterType']);
        let data: any = {};
        data = {
            ...data,
            'UserId': this.usrService.userValue.Id,
            'BuildingId': formData['UmfaId'],
            'BuildingName': building.Name,
            'PartnerId': building.PartnerId,
            'PartnerName': building.Partner,
            'BuildingServiceId': umfaMeter.MeterId,
            'MeterNo': umfaMeter.MeterNo,
            'UmfaDescription': umfaMeter.Description,
            'Description': formData['Description'],
            'ScadaSerial': scadaMeter['Serial'],
            'ScadaDescription': scadaMeter['Name'],
            'RegisterType': registerTypeItem.RegisterTypeName,
            'RegisterTypeId': registerTypeItem.RegisterTypeId,
            'TOUHeader': touItem.Name,
            'TOUId': touItem.Id,
            'SupplyType': formData['SupplyType'],
            'SupplyTo': formData['SupplyTo'],
            'LocationType': formData['LocationType']
        };
        if (this.checkExistingInMappedMeters(data)) {
            const dialogRef = this._ufUtils.fuseConfirmDialog(
                ALERT_MODAL_CONFIG,
                '',
                `This mapped meter is already existing!`);
        } else {
            this.bldService.addMappedMeter(data).subscribe(res => {
                this.umfaMeterGrid.instance.clearSelection();
                this.scadaMeterGrid.instance.clearSelection();
                this.form.reset();
                this.form.get('partnerId').setValue(this.selectedPartnerId);
                this.form.get('UmfaId').setValue(this.selectedBuildingId);
                this.mappedMeters.push({ ...res });
                this.umfaMeterGrid.instance.refresh();
                this.scadaMeterGrid.instance.refresh();
            })
        }
    }

    checkExistingInMappedMeters(data) {
        if (this.mappedMeters.find(meter =>
            meter.BuildingServiceId == data['BuildingServiceId'] &&
            meter.ScadaSerial == data['ScadaSerial'] &&
            meter.RegisterType == data['RegisterType'] &&
            meter.TOUHeader == data['TOUHeader'] &&
            meter.SupplyType == data['SupplyType'] &&
            meter.Location == data['Location']
        )) {
            return true;
        }

        return false;

    }

    onRemoveMappedMeter(e) {
        e.event.preventDefault();
        const dialogRef = this._ufUtils.fuseConfirmDialog(
            CONFIRM_MODAL_CONFIG,
            '',
            `Are you sure you want to remove?`);
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                let index = this.mappedMeters.findIndex(mm => mm.MappedMeterId == e.row.data.MappedMeterId);
                this.bldService.removeMappedMeter(e.row.data.MappedMeterId)
                    .subscribe(res => {
                        this.mappedMeters.splice(index, 1);
                        // update mapped field
                        this.updateScadaMeterMappedField();
                        this.updateUmfaMeterMappedField();

                        this.umfaMeterGrid.instance.refresh();
                        this.scadaMeterGrid.instance.refresh();
                    })
            }
        });

    }

    updateScadaMeterMappedField() {
        this.scadaMeters = this.scadaMeters.map(item => {
            if (this.mappedMeters.find(mm => mm.ScadaSerial == item.Serial)) item.Mapped = true
            else item.Mapped = false;
            return item;
        });
    }
    updateUmfaMeterMappedField() {
        this.umfaMeters = this.umfaMeters.map(item => {
            if (this.mappedMeters.find(mm => mm.BuildingServiceId == item.MeterId)) item.Mapped = true
            else item.Mapped = false;
            return item;
        });
    }

    onPartnerChanged(event) {
        this.selectedPartnerId = event.Id;
        this.buildings = this.allBuildings.filter(obj => obj.PartnerId == event.Id);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}

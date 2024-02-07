import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogConstants } from 'app/core/helpers';
import { DialogService } from 'app/shared/services/dialog.service';
import { BuildingService, MeterService, SnackBarService, UserService } from 'app/shared/services';
import { AmrMeterUpdate, IAmrMeter, IMeterMakeModel, IUmfaBuilding, IUtility } from 'app/core/models';

@Component({
  templateUrl: './amr-meter-edit.component.html',
  styleUrls: ['./amr-meter-edit.component.scss']
})
export class AmrMeterEditComponent implements OnInit {

  loading: boolean = true;
  pageTitle = 'Edit Amr Meter';

  opUsrId: number;
  amrMeter: IAmrMeter;
  updMeter: AmrMeterUpdate;
  buildings: IUmfaBuilding[];
  utils: IUtility[];
  makes: IMeterMakeModel[];
  makeItems: any[];
  modelItems: any[];

  errMessage: string;

  form: UntypedFormGroup;
  phaseItems = [{Label: 'Single', Id: 1}, {Label: 'Dual', Id: 2}, {Label: 'Three', Id: 3}];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private meterService: MeterService,
    private sbService: SnackBarService,
    private bldService: BuildingService,
    private usrService: UserService,
    private dialogService: DialogService,
    private _formBuilder: UntypedFormBuilder
  ) { }

  getAmrMeter(id: number): void {
    this.meterService.getMeter(id).subscribe({
      next: m => {
        this.onAmrMeterRetrieved(m)
        this.getUtilities();
        this.getBuildings();
        this.initForm();
      },
      error: err => this.errMessage = err
    });
  }

  getUtilities(): void {
    this.meterService.getUtilties().subscribe({
      next: u => {
        this.onUtilitiesRetrieved(u);
      },
      error: err => this.errMessage = err.error,
    });
  }

  getBuildings(): void {
    const usr = this.usrService.userValue;
    this.bldService.getBuildingsForUser(usr.UmfaId).subscribe({
      next: bldgs => {
        this.onBuildingsRetrieved(bldgs);
      },
      error: err => this.errMessage = err,
      complete: () => this.loading = false,
    });
  }

  async onUtilitiesRetrieved(utils: IUtility[]): Promise<void> {
    this.utils = utils;
    if (this.amrMeter.Id == 0) this.changeUtil(this.utils[0].Id);
    else {
      this.makes = this.utils.find(u => u.Id == this.amrMeter.UtilityId).MakeModels;
      this.makeItems = []; 
      this.modelItems = [];
      this.makes.forEach(item => {
        let filterMake = this.makeItems.find(obj => obj.Name == item.Make);
        if(!filterMake) this.makeItems.push({Name: item.Make});

        let filterModel = this.makeItems.find(obj => obj.Name == item.Model);
        if(!filterModel) this.modelItems.push({Name: item.Model});
      });
    }
  }

  async onBuildingsRetrieved(bldgs: IUmfaBuilding[]): Promise<void> {
    this.buildings = bldgs;
    if (this.amrMeter.Id == 0) this.amrMeter.UmfaId = this.buildings[0].BuildingId;
  }


  async onAmrMeterRetrieved(m: IAmrMeter): Promise<void> {
    this.amrMeter = m;

    if (!this.amrMeter) {
      this.pageTitle = 'User not found';
    } else {
      if (this.amrMeter.Id === 0) {
        this.pageTitle = 'Add New Meter';
        this.amrMeter.UserId = this.opUsrId;
      } else {
        this.pageTitle = `Edit Meter: ${this.amrMeter.MeterNo}`;
      }
    }
  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      Id: [0],
      MeterNo: [null, [Validators.required, Validators.minLength(3)]],
      Description: ['', [Validators.required, Validators.minLength(3)]],
      UmfaId: [null, [Validators.required]],
      UtilityId: [null, [Validators.required]],
      MakeModelId: [null, [Validators.required]],
      Make: ['', [Validators.required]],
      Model: ['', [Validators.required]],
      Phase: [null, [Validators.required]],
      CbSize: [null, [Validators.required, Validators.min(5)]],
      CtSizePrim: [null, [Validators.required, Validators.min(5)]],
      CtSizeSec: [null, [Validators.required]],
      ProgFact: [null, [Validators.required]],
      Digits: [null, [Validators.required]],
      CommsId: [null, [Validators.required]],
      MeterSerial: [null, [Validators.required]]
    });

    this.route.paramMap.subscribe(
      (params) => {
        this.opUsrId = +params.get('opId');
        const id = +params.get('meterId');
        this.getAmrMeter(id);
      });
  }

  initForm() {
    if(this.amrMeter) {
      this.form.patchValue(this.amrMeter);
    }
  }

  selectUtil(val: number): void {
    this.changeUtil(val);
  }

  makeModelChange(val: number): void {
    this.changeMakeModel(val);
  }

  changeMakeModel(val: number): void {
    var mm = this.makes.find(m => m.Id == val);
    this.amrMeter.MakeModelId = mm.Id;
    this.amrMeter.Make = mm.Make;
    this.amrMeter.Model = mm.Model;
    this.form.get('Make').setValue(mm.Make);
    this.form.get('Model').setValue(mm.Model);
  }

  changeUtil(val: number): void {
    var util = this.utils.find(u => u.Id == val);
    this.makes = util.MakeModels;
    this.amrMeter.UtilityId = util.Id;
    this.amrMeter.Utility = util.Name;
    this.changeMakeModel(this.makes[0].Id);
  }

  async saveAmrMeter() {
    if(!this.form.valid) {

    } else {
      this.updMeter = new AmrMeterUpdate;
      this.updMeter.UserId = this.opUsrId;
      let formData = this.form.value;
      // get util
      var util = this.utils.find(u => u.Id == this.form.get('UtilityId').value);
      let Utility = util.Name;

      // get building 
      // var bld = this.buildings.find(b => b.BuildingId  == this.form.get('UmfaId').value);
      let BuildingName = 'BuildingName';

      this.updMeter.Meter = { ...formData, Utility, BuildingName };
      this.updMeter.Meter.Active = true;
      var dialData = DialogConstants.updateDialog;
      this.dialogService.confirmDialog(dialData).subscribe({
        next: r => {
          if (r) {
            this.meterService.updateMeter(this.updMeter).subscribe({
              next: a => {
                this.amrMeter = a;
                this.router.navigate(['admin/amrMeter']);
                this.sbService.passDataToSnackComponent({ msg: 'Meter saved Successfully', style: 'success' });
              },
              error: err => this.errMessage = err
            });
          }
          else {
            this.sbService.passDataToSnackComponent({ msg: 'Meter Not Changed', style: 'cancel' });
          }
        },
        error: err => this.errMessage = err,
      });
    }
    
  }

  async deleteAmrMeter() {
    this.updMeter = new AmrMeterUpdate;
    this.updMeter.UserId = this.opUsrId;
    this.updMeter.Meter = this.amrMeter;
    this.updMeter.Meter.Active = false;
    
    this.updMeter.Meter.BuildingName = 'BuildingName';

    var dialData = DialogConstants.deleteDialog;
    this.dialogService.confirmDialog(dialData).subscribe({
      next: r => {
        if (r) {
          this.meterService.updateMeter(this.updMeter).subscribe({
            next: a => {
              this.amrMeter = a;
              this.router.navigate(['admin/amrMeter']);
              this.sbService.passDataToSnackComponent({ msg: 'Meter Removed Successfully', style: 'success' });
            },
            error: err => this.errMessage = err
          });
        }
        else {
          this.sbService.passDataToSnackComponent({ msg: 'Meter Not Removed', style: 'cancel' });
        }
      },
      error: err => this.errMessage = err,
    });
  }

}

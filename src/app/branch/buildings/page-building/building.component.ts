import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {forkJoin, of, Subject, Subscription} from 'rxjs';

import {BranchManagerService, BuildingService, MeterTypeService, PermissionService} from '@services';
import {
  BankAccountViewModel,
  BranchAccessPermission,
  BuildingDetailViewModel,
  CategoryViewModel,
  ClientPortfolioViewModel,
  ClientViewModel,
  MeterTypeViewModel,
  SupplyType,
  SupplyTypeDropdownItems,
  SupplyTypeText
} from '@models';

import {StringExtension} from 'app/shared/helper/string-extension';
import { BuildingStatus, BuildingStatusDropdownItems } from '@app/shared/models/building-status.model';
import { UserService } from '@app/admin/users/shared/user.service';
import { number } from 'ngrx-forms/validation';
import { LocalStorageService } from '@app/shared/services/local-storage.service';


@Component({
  selector: 'building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.less']
})
export class BuildingComponent implements OnInit {

  id: string;
  versionId: string = null;
  isNew: boolean = true;
  activeId: string = "tab-0";

  permissionChangedSubject: Subscription;
  accessPermission: BranchAccessPermission;

  dataLoaded: boolean = false;

  clients: ClientViewModel[] = new Array<ClientViewModel>();
  client: ClientViewModel = new ClientViewModel();

  category: CategoryViewModel = new CategoryViewModel();

  clientPortfolio: ClientPortfolioViewModel = new ClientPortfolioViewModel();

  categories: CategoryViewModel[] = new Array<CategoryViewModel>();
  selecedCategoryIds: string[] = new Array<string>();
  
  selectedStatus: any;
  statusDropdownItems =  BuildingStatusDropdownItems;

  bankAccounts: BankAccountViewModel[] = new Array<BankAccountViewModel>();

  meterTypes: MeterTypeViewModel[] = new Array<MeterTypeViewModel>();
  form: FormGroup;
  isActiveForReading: boolean = false;
  logoUrl: string = null;
  addressChangedSubject: Subject<boolean> = new Subject();
  submitNotify = new Subject<any>();
  isHeadOfficeAdmin: boolean = false;

  supplyTypeItems: any[] = [];

  formErrors = {
    "name": '',
    "clientId": '',
    "clientPortfolioId": '',
    "area": '',
    "categoryIds": '',
    "status": ''
  }
  validationMessages = {
    "name": {
      "required": "Name is required",
    },
    "clientId": {
      "required": "Client is required",
    },
    "clientPortfolioId": {
      "required": "Client Portfolio is required",
    },
    "area": {
      "required": "Area is required",
      "min": "Value must be greater than zero",
      "max": "Value must be less than 1000000"
    },
    "phone": {
      "required": "Phone is required",
      "pattern": "Phone number not in the correct format"
    },
    "email": {
      "required": "Email is required",
      "email": "Email address not in the correct format"
    },
    "categoryIds": {
      "required": "Category is required",
    },
    "numberOfTenants": {
      "max": "The Number Of Tenants should be less then 999999",
    },
    "numberOfShops": {
      "max": "The Number Of Shops should be less then 999999",
    },
    "numberOfMeters": {
      "max": "The Number Of Meters should be less then 999999",
    },
    "numberOfMeterTypes": {
      "max": "The Number Of Meters should be less then 999999",
    },
    "numberOfSqMetres": {
      "max": "The Number Of Squqre Metres should be less then 999999",
    },
    "numberOfCouncilAcc": {
      "max": "The Number Of Council Acc. should be less then 999999",
    },
    "numberOfHours": {
      "max": "The Number Of Hours should be less then 999999",
    }
  }
  protected isSubmitted: boolean = false;

  constructor(private buildingService: BuildingService, private fb: FormBuilder, private activatedRoute: ActivatedRoute,
              private router: Router, private branchManager: BranchManagerService, private meterTypeService: MeterTypeService,
              private location: Location, private permissionService: PermissionService, private userServie: UserService, private localStorageService: LocalStorageService) {

  }

  get numberOfMeterTypes(): FormArray {
    return this.form.get('numberOfMeterTypes') as FormArray;
  }

  ngOnInit() {
    this.accessPermission = this.permissionService.branchAccessPermission;
    this.permissionChangedSubject = this.permissionService.getBranchPermissionChangedSubject().subscribe(accessPermission => {
      this.accessPermission = accessPermission;
    });

    // check if user is mc_admin
    //this.isMcAdmin = this.localStorageService.get('is_mc_admin') ?? false;

    this.client.name = "Building company";
    this.clientPortfolio.name = "Select portfolio";

    this.activatedRoute.params.subscribe(params => {
      this.createForm(new BuildingDetailViewModel());
      let id = params['id'];
      let versionId = params['versionId'];

      if (StringExtension.isGuid(id)) {
        this.isNew = false;
        this.id = id;
      }

      let clientsObs = this.buildingService.getClients();
      let buildingDetail = of(new BuildingDetailViewModel());
      let bankAccounts = of(new Array<BankAccountViewModel>());
      let categoriesObds = this.buildingService.getAllCategories();
      let meterTypesObs = this.meterTypeService.get();
      let userDetailObs = of(null);
      if(!this.localStorageService.get('userId')) this.isHeadOfficeAdmin = false;
      else {
        userDetailObs = this.userServie.getUser(this.localStorageService.get('userId'));
      }
      
      if (!this.isNew) {
        buildingDetail = this.buildingService.get(this.id);
        bankAccounts = this.buildingService.getBankAccounts(this.id);
      }

      let join = forkJoin(clientsObs, categoriesObds, buildingDetail, bankAccounts, meterTypesObs, userDetailObs);
      join.subscribe(result => {
        let building = result[2];
        this.bankAccounts = result[3];
        this.clients = result[0];
        this.categories = result[1];
        this.meterTypes = result[4].meterTypes;
        //Head Office Admin
        const userDetails = result[5];
        if(!userDetails.role || !userDetails) this.isHeadOfficeAdmin = false;
        else {
          this.isHeadOfficeAdmin = userDetails.role.name.toLowerCase() == 'head office admin';
        }
        this.selecedCategoryIds = building.categoryIds;
        this.selectedStatus = building.status;
        this.isActiveForReading = building.isActiveForReading;

        if (!this.isNew) {
          let client = this.clients.find(c => c.id == building.clientId);
          if (client) {
            this.client = client;
            this.clientPortfolio = client.portfolios.find(p => p.id == building.clientPortfolioId);
          }

          this.logoUrl = building.logoUrl;
          this.createForm(building);
        } else {
          let newBuilding = new BuildingDetailViewModel();
          newBuilding.numberOfMeterTypes = this.meterTypes;
          this.createForm(newBuilding);
        }

        this.dataLoaded = true;

        if (StringExtension.isGuid(versionId)) {
          this.versionId = versionId;
          this.activeId = "tab-2";
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.permissionChangedSubject.unsubscribe();
  }

  clientChange(client) {
    this.client = client;
    this.form.patchValue({clientId: client.id, clientPortfolioId: null});
    this.clientPortfolio = new ClientPortfolioViewModel();
    this.clientPortfolio.name = "Select portfolio";
  }

  clientPortfolioChanged(clientPortfolio) {
    this.clientPortfolio = clientPortfolio;
    this.form.patchValue({clientPortfolioId: clientPortfolio.id});
  }

  categoriesChanged(categories: CategoryViewModel[]) {
    let categoryIds = <FormArray>this.form.controls["categoryIds"];

    while (categoryIds.length !== 0) {
      categoryIds.removeAt(0)
    }

    this.selecedCategoryIds.forEach(id => {
      categoryIds.push(this.fb.control(id));
    });

  }

  statusChanged(event) {
    this.form.patchValue({status: event.value});
  }
  createForm(model: BuildingDetailViewModel) {
    this.supplyTypeItems = SupplyTypeDropdownItems.sort((a, b) => {
      return a.label > b.label ? 1: -1;
    });
    let numberOfMeters = model.numberOfMeterTypes.sort((a, b) => {
      if(a.supplyType == b.supplyType) {
        return a.name > b.name ? 1: -1;
      } else {
        return a.supplyType > b.supplyType ? 1 : -1;
      }
    })
    this.supplyTypeItems = this.supplyTypeItems.map((item) => {
      item['meters'] = numberOfMeters.filter(meter => meter.supplyType == item.value);
      return item;
    }).filter(item => item.meters.length > 0);

    this.form = this.fb.group({
      id: [model.id],
      name: [model.name, Validators.required],
      clientId: [model.clientId, Validators.required],
      clientPortfolioId: [model.clientPortfolioId, Validators.required],
      area: [model.area, [Validators.required, Validators.min(0), Validators.max(999999)]],
      categoryIds: this.fb.array(model.categoryIds.map(c => this.fb.control(c)), Validators.required),
      status: [model.status],
      address: [model.address],
      logo: [null],
      isActiveForReading: [model.isActiveForReading],
      numberOfTenants: [model.numberOfTenants, [Validators.min(0), Validators.max(999999)]],
      numberOfShops: [model.numberOfShops, [Validators.min(0), Validators.max(999999)]],
      numberOfMeters: [model.numberOfMeters, [Validators.min(0), Validators.max(999999)]],
      numberOfMeterTypes: this.fb.array(numberOfMeters.map(pn => this.fb.group({
        id: [pn.id],
        name: [pn.name],
        supplyType: [pn.supplyType],
        value: [pn.value],
        quantity: [pn.quantity, [Validators.min(0), Validators.max(999999)]]
      }))),
      numberOfSqMetres: [model.numberOfSqMetres, [Validators.min(0), Validators.max(999999)]],
      numberOfCouncilAcc: [model.numberOfCouncilAcc, [Validators.min(0), Validators.max(999999)]],
      numberOfHours: [model.numberOfHours, [Validators.min(0), Validators.max(999999)]]
    });

    this.form.valueChanges.subscribe(data => this.onValueFormChange(data));
  }

  save() {
    this.submitNotify.next();
    if (!this.form.valid) {
      this.isSubmitted = true;
      this.onValueFormChange();
      return;
    }

    if (this.isNew) {
      this.buildingService.create(this.form.value).subscribe(response => {
        this.location.back();
      });
    } else {
      const model = this.form.value as BuildingDetailViewModel;
      model.logoUrl = this.logoUrl;

      this.buildingService.update(this.id, model).subscribe();
    }
  }

  onValueFormChange(data?: any) {
    if (!this.form) return;
    let form = this.form;

    for (let field in this.formErrors) {
      this.formErrors[field] = "";
      let control = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && this.isSubmitted && !control.valid)) {
        let message = this.validationMessages[field];
        for (let key in control.errors) {
          this.formErrors[field] = message[key];
        }
      }
    }
  }

  logoChanged(file) {
    this.form.controls["logo"].setValue(file);
  }

  coordinatesChanged(model: BuildingDetailViewModel) {
    this.form.controls['address'].setValue(model.address);
  }

  onAddressChanged(event) {
    this.addressChangedSubject.next(true);
  }

  onCancel() {
    this.onNavigate();
  }

  onNavigate() {
    const branchId = this.branchManager.getBranchId();
    if (this.router.url.includes('buildings')) {
      this.router.navigate([`/branch/${branchId}/buildings`]);
    } else {
      this.router.navigate([`/branch/${branchId}/marketing`]);
    }
  }

  supplyTypeToString(item: number): string {
    switch (item) {
      case SupplyType.Electricity:
        return 'Electricity';

      case SupplyType.Gas:
        return 'Gas';

      case SupplyType.Sewerage:
        return 'Sewerage';

      case SupplyType.Water:
        return 'Water';

      case SupplyType.AdHoc:
        return 'AdHoc';

      default:
        return 'Electricity';
    }
  }

}

import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { EnterReadingPopupComponent } from "@app/branch/buildings/manage-building/meter-readings/billing-readings/enter-reading-popup/enter-reading-popup.component";
import { ApplyEstimatedPopupComponent } from "@app/branch/buildings/manage-building/meter-readings/billing-readings/readings-list/readings-list-item/apply-estimated-popup/apply-estimated-popup.component";
import * as billingReadingsAction from "@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/actions/billing-readings.actions";
import * as enterReadingFormActions from '@app/branch/buildings/manage-building/meter-readings/billing-readings/shared/store/actions/enter-reading-form.actions';
import { PopupRegisterChangeVersionReadingComponent } from "@app/popups/popup-register-change-version-reading/popup-register-change-version-reading.component";
import { PopupCreateVirtualRegisterComponent } from "@app/popups/popup.create-virtual-register/popup.create-virtual-register.component";
import { EquipmentTemplateViewModel, FieldType, ObisCodeViewModel, RegisterViewModel, SupplyType, TimeOfUse, UnitOfMeasurement } from '@models';
import { NgbDateParserFormatter, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Actions, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { EquipmentService } from "@services";
import {
    NgbDateFRParserFormatter,
    ngbDateNgrxValueConverter,
    numberRegex,
    ratioMask,
    ratioPlaceholderMask
} from "@shared-helpers";
import { PopupCommentComponent } from "app/popups/popup.comment/popup.comment.component";
import { ImgModalComponent } from "app/widgets/img-modal/img-modal.component";
import { FormGroupState, MarkAsSubmittedAction, SetValueAction } from "ngrx-forms";
import { combineLatest, Observable, Subject, Subscription  } from "rxjs";
import { map } from "rxjs/operators";
import * as buildingCommonData from "../../../shared/store/selectors/common-data.selectors";
import {
    AssignedVirtualRegister,
    MeterPhotoType,
    MeterRegisterViewModel,
    MeterViewModel,
    VirtualRegisterType
} from "../../shared/models";
import * as equipmentFormActions from "../../shared/store/actions/equipment-form.actions";
import * as equipmentActions from "../../shared/store/actions/equipment.actions";
import * as fromEquipment from "../../shared/store/reducers";
import * as fromEquipmentFormStore from "../../shared/store/reducers/equipment-form.store";
import * as fromEquipmentStore from "../../shared/store/reducers/equipment.store";

import ConnectToAmrSystemRequest = equipmentFormActions.ConnectToAmrSystemRequest;
import GetReadingsFromAmrSystemRequest = equipmentFormActions.GetReadingsFromAmrSystemRequest;
import { LocalStorageService } from "@app/shared/services/local-storage.service";

@Component({
  selector: "equipment-details",
  templateUrl: "./equipment-details.component.html",
  styleUrls: ["./equipment-details.component.less"],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class EquipmentDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Output() startEstimation = new EventEmitter();
  @Output() applyEstimation = new EventEmitter();
  @Output() removeNode = new EventEmitter();
  @Output() readingDate = new Date();
  DEFAULT_UNIT_NAME = "kWh";
  ratioMask = ratioMask;
  ratioPlaceholderMask = ratioPlaceholderMask;
  numberRegex = numberRegex;
  formState$: Observable<FormGroupState<any>>;
  locations$: Observable<any>;
  supplies$: Observable<any>;
  locationTypes$: Observable<any>;
  unitOptions$: Observable<any[]>;
  notIncludedRegisters$: Observable<any[]>;
  equipmentTemplateTitles$: Observable<string[]>;
  isElectricityBreakersGroup$: Observable<boolean>;
  isAmrIntegrationAllowed$: Observable<boolean>;
  isEquipmentComplete$: Observable<any>;
  isMeter$: Observable<boolean>;
  VirtualRegisterType = VirtualRegisterType;
  parentMeters$: Observable<any>;
  equipmentTemplate$: Observable<EquipmentTemplateViewModel>;
  equipmentTemplate: EquipmentTemplateViewModel;
  subscriber$: any;
  branchId: string;
  buildingId: string;
  version: string;
  meterId: string;
  locationId: string;
  supplyType = SupplyType;
  fieldTypes = FieldType;
  unitsOfMeasurement$: Observable<UnitOfMeasurement[]>;
  meterPhotoType = MeterPhotoType;
  defaultEquipmentPhotoUrl = "";
  formEquipmentPhotoUrl = "";
  equipmentPhotoUrl = "";
  actualPhotoUrl: string;
  comment$: Subscription;
  formStateSub: Subscription;
  equipmentTemplateSub: Subscription;
  unitOfMeasurementSub: Subscription;
  comment: string;
  logo = null;
  logogUrl = "";
  registerChange = false;
  registerInitialValue = "";
  estimatePopupObject: Object = {};

  defaultImage = "assets/images/upload-file/upload-image.svg";
  selectedIcon0 = "../../../../../../assets/images/icons/equipment/registerTypes/cumulative.svg";
  selectedIconAlt0 = "Cumulative";
  selectedIcon1 = "../../../../../../assets/images/icons/equipment/registerTypes/resetted-max.svg";
  selectedIconAlt1 = "Resetted-Max";
  selectedIcon2 = "../../../../../../assets/images/icons/equipment/registerTypes/resetted.svg";
  selectedIconAlt2 = "Resetted";

  equipmentRegistersDict$: Observable<{ [key: string]: RegisterViewModel[] }>;
  ngbDateNgrxValueConverter = ngbDateNgrxValueConverter;
  unitsOfMeasurement: UnitOfMeasurement[];
  isBuildingWithAmrAccount$: Observable<boolean>;
  amrImportLastDate$: Observable<Date>;
  equipmentUnitsOfMeasurement$: Observable<UnitOfMeasurement[]>;
  equipmentList$: Observable<MeterViewModel[]>;
  defaultRegister$: Observable<any>;
  obisCodes: Object = new Array<ObisCodeViewModel>();
  registerId: "";
  equipmentLists: MeterViewModel[] = [];
  currentIndex: number = -1;
  equipmentListUrl: any[];
  buildingPeriodIsFinalized$: Observable<any>;

  constructor(
    private store: Store<fromEquipment.State>,
    private equipmentStore: Store<fromEquipmentStore.State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private equipmentService: EquipmentService,
    private localStorageService: LocalStorageService,
  ) {
    this.equipmentList$ = this.store.pipe(select(fromEquipment.getEquipmentList));
    this.equipmentList$.subscribe(res => {
      this.equipmentLists = res;
    });
    this.formState$ = this.store.pipe(select(fromEquipment.getEquipmentFormFormState));
    this.locations$ = this.store.pipe(select(fromEquipment.getEquipmentFormLocations));
    this.supplies$ = this.store.pipe(select(fromEquipment.getEquipmentSupplies));
    this.defaultRegister$ = this.store.pipe(select(fromEquipment.getDefaultRegister, {name: this.DEFAULT_UNIT_NAME}));
    this.locationTypes$ = this.store.pipe(select(fromEquipment.getEquipmentLocationTypes));
    this.unitOptions$ = this.store.pipe(select(fromEquipment.getEquipmentUnitOptions));
    this.notIncludedRegisters$ = this.store.pipe(select(fromEquipment.getEquipmentNotIncludedRegisters));
    this.parentMeters$ = this.store.pipe(select(fromEquipment.getAvailableParentsMeters));
    this.isAmrIntegrationAllowed$ = this.store.pipe(select(fromEquipment.getEquipmentFormIsAmrIntegrationAllowed));
    this.isElectricityBreakersGroup$ = this.store.pipe(select(fromEquipment.getEquipmentFormIsElectricityBreakersGroup));
    this.isMeter$ = this.store.pipe(select(fromEquipment.isEquipmentContainRegisters));
    this.equipmentTemplate$ = this.store.pipe(select(fromEquipment.getEquipmentEquipmentTemplate));

    this.equipmentRegistersDict$ = store.pipe(select(fromEquipment.getEquipmentEquipmentTemplateRegistersDict));

    this.comment$ = store.pipe(select(buildingCommonData.getSelectedHistoryLog)).subscribe(log => {
      this.comment = log ? log.comment : "";
    });

    this.equipmentTemplateTitles$ = store.pipe(select(fromEquipment.getEquipmentEquipmentTemplates),
      map(items => items.map(equipmentTemplate => `${equipmentTemplate.brand} ${equipmentTemplate.model}`)));

    this.unitsOfMeasurement$ = this.store.pipe(select(buildingCommonData.getUnitsOfMeasurement));

    this.equipmentUnitsOfMeasurement$ = this.store.pipe(select(fromEquipment.getEquipmentUnitsOfMeasurement));

    this.unitOfMeasurementSub = this.unitsOfMeasurement$.subscribe(units => {
      this.unitsOfMeasurement = units;
    });

    this.isEquipmentComplete$ = this.store.pipe(select(fromEquipment.getEquipmentIsComplete))
    
  }

  ngOnInit() {
    const pathFromRoot = this.activatedRoute.pathFromRoot;
    const equipmentParams = pathFromRoot[7].params;

    this.subscriber$ = combineLatest([pathFromRoot[2].params, pathFromRoot[4].params, pathFromRoot[5].params, equipmentParams])
      .subscribe(([branchParams, buildingParams, versionParams, equipmentParams]) => {
        this.branchId = branchParams["branchid"];
        this.buildingId = buildingParams["id"];
        this.version = versionParams["vid"];
        this.meterId = equipmentParams["equipmentId"];
        this.locationId = equipmentParams["locationId"];
        this.equipmentListUrl = ['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.version, 'equipment'];

        this.currentIndex = this.equipmentLists.findIndex(equipment => equipment.id == this.meterId);
        this.store.dispatch(new equipmentFormActions.EditEquipment(this.meterId));
      });

    this.formStateSub = this.formState$.subscribe(form => {
      this.formEquipmentPhotoUrl = form.controls.logoUrl.value ? form.controls.logoUrl.value : "";
      this.getEquipmentPhotoUrl();
    });

    this.equipmentTemplateSub = this.equipmentTemplate$.subscribe(template => {
      this.defaultEquipmentPhotoUrl = (template && template.logoUrl) ? template.logoUrl : "";
      this.getEquipmentPhotoUrl();
    });

    this.equipmentTemplate$.subscribe(template => {
      if (template != null) {
        this.equipmentTemplate = template;
        this.equipmentTemplate.registers.sort((a, b) => a.sequenceNumber < b.sequenceNumber
          ? -1
          : (a.sequenceNumber > b.sequenceNumber ? 1 : 0));
      }
    });

    this.equipmentStore.dispatch(new equipmentActions.RequestBranchAmrAccounts(this.branchId));
    this.isBuildingWithAmrAccount$ = this.store.pipe(select(fromEquipment.isBuildingWithAmrAccount));
    this.amrImportLastDate$ = this.store.pipe(select(fromEquipment.getAmrImportLastDate, {meterId: this.meterId}));

    this.equipmentService.getAllObisCodes("").subscribe((response) => {
      this.obisCodes = response;
      });
    
    this.buildingPeriodIsFinalized$ = this.store.pipe(select(buildingCommonData.getIsFinalized));
  }

  ngOnDestroy() {
    this.formStateSub && this.formStateSub.unsubscribe();
    this.unitOfMeasurementSub && this.unitOfMeasurementSub.unsubscribe();
    this.equipmentTemplateSub && this.equipmentTemplateSub.unsubscribe();
    this.comment$ && this.comment$.unsubscribe();
    this.subscriber$ && this.subscriber$.unsubscribe();
    this.store.dispatch(new equipmentFormActions.ClearLocalEquipment());
  }

  onRemoveRegister($event) {
    this.store.dispatch(new equipmentFormActions.RemoveRegister($event));
  }

  onAddRegister($event) {
    this.store.dispatch(new equipmentFormActions.AddRegister($event));
  }

  onLocationChanged($event) {
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.locationId.id, $event.id));
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.locationName.id, $event.name));
  }

  onSupplyToChanged($event) {
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.supplyId.id, $event.id));
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.supplyName.id, $event.name));
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.locationType.id, ""));
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.supplyToLocationId.id, null));
  }

  onLocationTypeChanged($event) {
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.locationType.id, $event.name));
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.supplyToLocationId.id, $event.id));
  }

  comboSettingsChange(event) {
    this.store.dispatch(new equipmentFormActions.ComboSettingsChange({value: event}));
  }

  onParentsListChanged(event) {
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.parentMeters.id, event));
  }

  onSave() {
    const currentDate = (new Date()).toISOString().replace(/-/g, "").split("T")[0];
    if (currentDate === this.version) {
      //Just Save Normally
      const modalRef = this.modalService.open(PopupCommentComponent, {
        backdrop: "static",
        windowClass: "comment-modal"
      });

      modalRef.componentInstance.date = new Date();
      modalRef.componentInstance.comment = this.comment;

      modalRef.result.then(({ comment, date, actionType }) => {
        this.store.dispatch(new MarkAsSubmittedAction(fromEquipmentFormStore.InitState.id));
        this.store.dispatch(new equipmentFormActions.SendRequestEquipment({
          comment: comment,
          date: date,
          actionType: actionType
        }));
      }, () => {
      });
    } else {
      //Check If There were changes
      if (this.registerChange === false) {
        //Just Save Normally
        const modalRef = this.modalService.open(PopupCommentComponent, {
          backdrop: "static",
          windowClass: "comment-modal"
        });

        modalRef.componentInstance.date = new Date();
        modalRef.componentInstance.comment = this.comment;

        modalRef.result.then(({ comment, date, actionType }) => {
          this.store.dispatch(new MarkAsSubmittedAction(fromEquipmentFormStore.InitState.id));
          this.store.dispatch(new equipmentFormActions.SendRequestEquipment({
            comment: comment,
            date: date,
            actionType: actionType
          }));
        }, () => {
        });
      } else {
        //Save As New Version
        const modalRef = this.modalService.open(PopupRegisterChangeVersionReadingComponent, {
          backdrop: "static",
          windowClass: "comment-modal"
        });

        modalRef.componentInstance.date = new Date();
        modalRef.componentInstance.comment = this.comment;
        modalRef.componentInstance.readingType = 1;
        modalRef.componentInstance.registerId = this.registerId;

        modalRef.result.then(({ comment, date, actionType, readingType, registerId }) => {
          this.readingDate = date;
          this.store.dispatch(new MarkAsSubmittedAction(fromEquipmentFormStore.InitState.id));
          this.store.dispatch(new equipmentFormActions.SendRequestEquipment({
            comment: comment,
            date: date,
            actionType: actionType,
            readingType: readingType,
            registerId: registerId
          }));
          
          this.redirectToReadings();
          //Goto Readings Page
          if (readingType === 1) {
            //EnterReadingPopupComponent
            this.enterReadingPopup();
          }
          else
          {
            //ApplyEstimatedPopupComponent
            this.estimatePopupObject = {meterId: this.meterId, registerId: this.registerId, timeOfUse: this.getTimeOfUse, readingDate: this.readingDate.toISOString()};
            this.applyEstimatePopup(this.estimatePopupObject);
          }
          this.localStorageService.remove('EquipmentDetailRegisters');
          
        }, () => {
          this.store.dispatch(new equipmentFormActions.SetEquipmentDetailRegisters(this.localStorageService.get('EquipmentDetailRegisters')));
        });
      }
    }
  }

  redirectToReadings() {
    this.router.navigate(["/branch", this.branchId, "buildings", this.buildingId, 'meter-readings']);
  }

  applyEstimatePopup($event) {
    this.store.dispatch(new billingReadingsAction.ReadingListOpenEstimation($event));
    const modalRef = this.modalService.open(ApplyEstimatedPopupComponent, {
      backdrop: 'static',
      windowClass: 'apl-estmtd-modal'
    });

    modalRef.componentInstance.meterId = $event.meterId;
    modalRef.componentInstance.registerId = $event.registerId;
    modalRef.componentInstance.readingDate = $event.readingDate;

    modalRef.result.then(({ notes, value, reason, isRollover }) => {
      
      this.store.dispatch(new billingReadingsAction.ApplyEstimatedClickApply({
        meterId: $event.meterId,
        registerId: $event.registerId,
        timeOfUse: $event.timeOfUse,
        notes: notes,
        value: value,
        isRollover: isRollover,
        reason
      }));
    }, () => {
    });
  }

  enterReadingPopup() {
    this.store.dispatch(new billingReadingsAction.UpdateMeterIdToEnterReadings(this.meterId));
    this.store.dispatch(new enterReadingFormActions.MarkAsUnsubmitted());

    const modalRef = this.modalService.open(EnterReadingPopupComponent, {
      backdrop: 'static',
      windowClass: 'enter-rdngs-modal'
    });
    modalRef.componentInstance.readingDate = this.readingDate;
    modalRef.componentInstance.isFromEquipment = true;
  }

  trackById(index) {
    return index;
  }

  onCancel() {
    if (this.locationId) {
      this.router.navigate(["/branch", this.branchId, "buildings", this.buildingId,
        "version", this.version, "equipment", "locations", this.locationId]);
    } else {
      this.router.navigate(["/branch", this.branchId, "buildings", this.buildingId, "version", this.version, "equipment"]);
    }
  }

  onOpenRegisterImage(url: string) {
    const modalRef = this.modalService.open(ImgModalComponent);
    modalRef.componentInstance.url = url;
    modalRef.componentInstance.isReadonlyImage = true;
  }

  logoChanged(result) {
    this.store.dispatch(new equipmentFormActions.UpdateActualPhoto({photo: result, photoUrl: this.equipmentPhotoUrl}));
  }

  onEquipmentTemplateTitleChange($event) {
    this.store.dispatch(new SetValueAction(fromEquipmentFormStore.InitState.controls.equipmentModel.id, $event));
  }

  onRegisterScaleChange(event) {
    this.registerId = event.registerId;
    this.registerChange = true;
    this.store.dispatch(new equipmentFormActions.ChangeRegisterScale(
      {
        index: event.index,
        scaleId: event.scaleId
      }));
  }

  onRegisterRatioChange(event) {
    this.registerId = event.registerId;
    this.registerChange = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  onConnectToAmrSystem() {
    this.store.dispatch(new ConnectToAmrSystemRequest(this.meterId));
  }

  onGetReadingsFromAmrSystem() {
    this.store.dispatch(new GetReadingsFromAmrSystemRequest(this.meterId));
  }

  onParentMeterChange($event) {
    this.store.dispatch(new equipmentFormActions.ChangeParentMeter($event));
  }

  onToggleBreaker() {
    this.store.dispatch(new equipmentFormActions.ToggleBreakerRequest(this.meterId));
  }

  isAttrPhotoAdded(control) {
    return !!(control.value.newPhotoUrl || control.value.photoUrl);
  }

  getEquipmentPhotoUrl() {
    this.equipmentPhotoUrl = this.formEquipmentPhotoUrl ? this.formEquipmentPhotoUrl : this.defaultEquipmentPhotoUrl;
  }

  onDropRegisters(event: CdkDragDrop<MeterRegisterViewModel[]>) {
    this.store.dispatch(new equipmentFormActions.ChangeRegisterSequence({
      from: event.previousIndex,
      to: event.currentIndex
    }));
  }

  onDropVirtualRegisters(event: CdkDragDrop<AssignedVirtualRegister[]>) {
    this.store.dispatch(new equipmentFormActions.ChangeVirtualRegisterSequence({
      from: event.previousIndex,
      to: event.currentIndex
    }));
  }

  onAddVirtualRegister() {
    const modalRef = this.modalService.open(PopupCreateVirtualRegisterComponent);
    modalRef.componentInstance.unitsOfMeasurement$ = this.equipmentUnitsOfMeasurement$;
    modalRef.componentInstance.defaultRegister$ = this.defaultRegister$;
    modalRef.componentInstance.meterId = this.meterId;
    modalRef.result.then((result: AssignedVirtualRegister) => {
      this.store.dispatch(new equipmentFormActions.AddVirtualRegister(result));
    }, () => {
    });
  }

  onRemoveVirtualRegister(id: string) {
    this.store.dispatch(new equipmentFormActions.RemoveVirtualRegister(id));
  }

  getUnitOfMeasurementTypeName(unitOfMeasurement: number) {
    const unit = this.unitsOfMeasurement.find(unit => unit.unitType === unitOfMeasurement);
    return unit ? unit.defaultName : "";
  }

  onChangeExpandVR(id: string) {
    this.store.dispatch(new equipmentFormActions.ExpandVirtualRegister(id));
  }

  onRemoveAssignedMeter(vrId: string, assignedMeterId: string, type: VirtualRegisterType) {
    this.store.dispatch(new equipmentFormActions.RemoveAssignedRegister({vrId, assignedMeterId, type}));
  }

  onAssignRegisterToVirtualRegister(vrId: string, type: VirtualRegisterType, register) {
    const {factor, id} = register;
    this.store.dispatch(new equipmentFormActions.AddAssignedRegisterToVR({
      vrId,
      type,
      register: {id: id.value, factor: factor.value}
    }));
  }

  onChangeTargetMeter(id: string, vrId: string) {
    this.store.dispatch(new equipmentFormActions.TargetMeterRegister({id, vrId}));
  }

  getTimeOfUse(timeOfUse) {
    return timeOfUse !== null ? TimeOfUse[timeOfUse] : TimeOfUse[TimeOfUse.None];
  }

  onPrevEquipment() {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.version, 'equipment', this.equipmentLists[this.currentIndex-1].id]);
  }

  onNextEquipment() {
    this.router.navigate(['/branch', this.branchId, 'buildings', this.buildingId, 'version', this.version, 'equipment', this.equipmentLists[this.currentIndex+1].id]);
  }
}


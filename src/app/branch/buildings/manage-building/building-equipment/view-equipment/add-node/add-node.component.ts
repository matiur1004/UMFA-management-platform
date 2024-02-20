import {Component, OnInit} from '@angular/core';
import {NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, of} from 'rxjs';
import {distinctUntilChanged, map, startWith, withLatestFrom} from 'rxjs/operators';
import {Router} from '@angular/router';

import {BranchManagerService} from '@services';
import {DropdownItem, SupplyToViewModel, SupplyTypeDropdownItems} from '@models';

import {NgbDateFRParserFormatter} from 'app/shared/helper/ngb-date-fr-parser-formatter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromNodeState from '../../shared/store/reducers';
import * as nodeAction from '../../shared/store/actions/node.actions';
import {PopupCommentComponent} from 'app/popups/popup.comment/popup.comment.component';
import * as buildingCommonData from '../../../shared/store/selectors/common-data.selectors';

@Component({
  selector: 'add-node',
  templateUrl: './add-node.component.html',
  styleUrls: ['./add-node.component.less'],
  providers: [{provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter}]
})
export class AddNodeComponent implements OnInit {

  supplies$: Observable<SupplyToViewModel[]>;
  form: FormGroup;
  showAllErrors = false;

  supplyTypes = SupplyTypeDropdownItems;

  locationTypeOptions$: Observable<DropdownItem[]>;
  supplyToOptions$: Observable<DropdownItem[]>;

  constructor(
    private store: Store<fromNodeState.State>,
    private modalService: NgbModal,
    private branchManager: BranchManagerService,
    private router: Router,
    private fb: FormBuilder) {
    this.supplies$ = this.store.pipe(select(fromNodeState.getAllSupplies));
  }

  createForm() {
    this.showAllErrors = false;
    let fb = this.fb;
    this.form = fb.group({
      name: fb.control('', [Validators.required]),
      supplyType: fb.control(-1, [Validators.min(0)]),
      supplyTo: fb.control(null),
      locationType: fb.control(null),
      description: fb.control(null)
    });

    const supplyType$ = this.form.controls.supplyType.valueChanges
      .pipe(
        startWith(null),
        distinctUntilChanged());

    this.supplyToOptions$ = supplyType$
      .pipe(
        withLatestFrom(this.supplies$),
        map(([supplyType, supplies]) => this.getSuppliesForSupplyType(supplies, supplyType).map(s => ({
          label: s.name,
          value: s.id
        })))
      );

    this.locationTypeOptions$ = this.form.controls.supplyTo.valueChanges.pipe(
      startWith(null),
      withLatestFrom(supplyType$, this.supplies$),
      map(([supplyTo, supplyType, supplies]) => this.getLocationTypes(supplies, supplyTo, supplyType).map(l => ({
        label: l.name,
        value: l.id
      })))
    );

  }

  getSuppliesForSupplyType(supplies, supplyType) {
    if (!supplies || supplyType === undefined || supplyType === null) {
      return [];
    }
    return supplies.filter(s => s.supplyTypes.some(t => t.supplyType === +supplyType));
  }

  getLocationTypes(supplies, supplyTo, supplyType) {
    if (!supplies || !supplyTo) {
      return [];
    }
    const supply = supplies.find(s => s.id === supplyTo);
    const supplyTypeItem = supply && supply.supplyTypes.find(s => s.supplyType === +supplyType);
    return supplyTypeItem ? supplyTypeItem.supplyToLocations : [];
  }

  ngOnInit() {
    this.createForm();
  }

  onSave() {
    if (!this.form.valid) {
      this.showAllErrors = true;
      return;
    }
    const nodeData = this.form.value;
    const modalRef = this.openSavePopup(nodeData.name);

    modalRef.result.then(({comment, date, actionType}) => {
      this.store.dispatch(new nodeAction.ApiRequestCreateNode({
        comment: comment,
        versionDate: date,
        action: actionType,
        entity: {
          name: nodeData.name,
          description: nodeData.description,
          supplyType: nodeData.supplyType,
          supplyToId: nodeData.supplyTo,
          supplyToLocationId: nodeData.locationType
        }
      }));
    }, () => {
    });
  }

  openSavePopup(nodeName) {
    const modalRef = this.modalService.open(PopupCommentComponent, {
      backdrop: 'static',
      windowClass: 'comment-modal'
    });

    modalRef.componentInstance.date = new Date();
    modalRef.componentInstance.comment = 'Add New Node - ' + nodeName;

    return modalRef;
  }

  onCancel() {
    of(null).pipe(
      withLatestFrom(
        this.store.pipe(select(buildingCommonData.getBuildingId)),
        this.store.pipe(select(buildingCommonData.getSelectedHistoryLog))
      )
    ).subscribe(([_, buildingId, version]) => {
      const branchId = this.branchManager.getBranchId();
      this.router.navigate(['/branch', branchId, 'buildings', buildingId, 'version', version.versionDay, 'equipment', 'nodes'])
    });
  }
}

import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {
  BrandViewModel,
  EquipmentAttributeViewModel,
  EquipmentGroupViewModel,
  EquipmentTemplateAttributeViewModel,
  EquipmentTemplateFilterDetailViewModel,
  EquipmentTemplateFilterViewModel,
  EquipmentTemplateListItemViewModel,
  EquipmentTemplateViewModel,
  FieldType,
  PagingViewModel,
  SupplyType,
  UNITS_PER_PAGE
} from '@models';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {EquipmentService} from '@services';
import {forkJoin, Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {CreateEquipmentComponent} from '../create-equipment/create-equipment.component';

@Component({
  selector: 'equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.less']
})
export class EquipmentListComponent implements OnInit, OnDestroy {

  @Input() newEquipmentCreatedEvent: Observable<void>;
  model: PagingViewModel<EquipmentTemplateListItemViewModel> = new PagingViewModel<EquipmentTemplateListItemViewModel>();
  selectedEquipmentGroupText = 'All equip. group';
  selectedBrandText = 'All brands';
  selectedModelText = 'All models';
  fieldType = FieldType;
  filterDetail: EquipmentTemplateFilterDetailViewModel = new EquipmentTemplateFilterDetailViewModel();
  allEquipmentGroups: EquipmentGroupViewModel[] = new Array<EquipmentGroupViewModel>();
  allBrands: BrandViewModel[] = new Array<BrandViewModel>();
  allEquipmentAttributes: EquipmentAttributeViewModel[] = new Array<EquipmentAttributeViewModel>();
  allEquipmentTemplateAttributes: EquipmentTemplateAttributeViewModel[] = new Array<EquipmentTemplateAttributeViewModel>();
  allEquipmentTemplateModels: string[] = new Array<string>();
  form: FormGroup;
  isExpandFilter = false;
  orderIndex = 1;
  itemsPerPage: number | null = UNITS_PER_PAGE[1];
  page = 1;
  itemsPerPageList = UNITS_PER_PAGE;
  private newEquipmentCreatedSubscription: any;
  private filter: EquipmentTemplateFilterViewModel = new EquipmentTemplateFilterViewModel();
  private searchTermsSubject = new Subject<string>();
  private searchTerms = '';
  private supplyType = SupplyType;

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private equipmentService: EquipmentService) {
  }

  ngOnInit() {
    this.createForm();
    this.onResetFilter();

    const equipmentGroups = this.equipmentService.getAllEquipmentGroups('');
    const brands = this.equipmentService.getAllBrands('');
    const equipmentAttributes = this.equipmentService.getAllEquipmentAttributes('');
    const equipmentTemplateAttributes = this.equipmentService.getAllEquipmentTemplateAttributes();
    const equipmentTemplateModels = this.equipmentService.getAllEquipmentTemplateModels();

    this.filterDetail.supplyTypes = [{supplyType: SupplyType.Electricity, isChecked: true},
      {supplyType: SupplyType.Water, isChecked: true},
      {supplyType: SupplyType.Gas, isChecked: true},
      {supplyType: SupplyType.Sewerage, isChecked: true},
      {supplyType: SupplyType.AdHoc, isChecked: true}];

    const join = forkJoin(equipmentGroups, brands, equipmentAttributes, equipmentTemplateAttributes, equipmentTemplateModels);
    join.subscribe(result => {
      this.allEquipmentGroups = result[0] as EquipmentGroupViewModel[];
      this.allBrands = result[1] as BrandViewModel[];
      this.allEquipmentAttributes = result[2] as EquipmentAttributeViewModel[];
      this.allEquipmentTemplateAttributes = result[3] as EquipmentTemplateAttributeViewModel[];
      this.allEquipmentTemplateModels = result[4] as string[];

      this.updateFilter();

    });

    this.searchTermsSubject.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(500),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      tap((term: string) => {
        this.searchTerms = term;
        this.loadData();
      })
    ).subscribe();

    this.newEquipmentCreatedSubscription = this.newEquipmentCreatedEvent.subscribe(() => this.loadData());
  }

  ngOnDestroy(): void {
    this.searchTermsSubject.unsubscribe();
    this.newEquipmentCreatedSubscription.unsubscribe();
  }

  createForm() {
    this.form = this.formBuilder.group({
      allSupplyTypes: [true],
      supplyTypes: this.formBuilder.array([]),
      equipmentGroupId: [null],
      brandId: [null],
      model: [''],
      isOldModel: [true],
      attributes: this.formBuilder.array([])
    });

    this.createFormControlForSupplyTypes();
    this.createFormControlForAttributes();
  }

  createFormControlForSupplyTypes() {
    const control = this.form.controls['supplyTypes'] as FormArray;

    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.filterDetail.supplyTypes.forEach(elem => {
      control.push(
        this.formBuilder.group({
          supplyType: [elem.supplyType],
          isChecked: [elem.isChecked]
        })
      );
    });
  }

  updateFilter() {
    const filter = this.filterDetail;

    const types = filter.supplyTypes.filter(s => s.isChecked == true).map(s => s.supplyType);
    filter.equipmentGroups = this.allEquipmentGroups.filter(e => types.find(s => s === e.supplyType) != null);

    if (filter.checkedEquipmentGroup != null &&
      filter.equipmentGroups.find(e => e.id === filter.checkedEquipmentGroup.id) == null) {
      filter.checkedEquipmentGroup = null;
    }

    filter.brands = this.allBrands.filter(a => {
      let flag = false;
      a.equipmentGroups.forEach(elem => {
        if (filter.equipmentGroups.find(eq => eq.id == elem.id) != null) {
          flag = true;
        }
      });
      return flag;
    });

    if (filter.checkedBrand != null &&
      filter.brands.find(e => e.id === filter.checkedBrand.id) == null) {
      filter.checkedBrand = null;
    }

    const previousEquipmentAttributes = Object.assign([], filter.equipmentAttributes);

    filter.equipmentAttributes = this.allEquipmentAttributes.filter(a => {
      let flag = false;
      a.equipmentGroups.forEach(elem => {
        if (filter.equipmentGroups.find(eq => eq.id == elem.id) != null) {
          flag = true;
        }
      });
      return flag;
    }).map(a => {
      return {attribute: a, value: '', numberValue: '', unitValues: []};
    });

    filter.equipmentAttributes.forEach(pa => {
      const attr = previousEquipmentAttributes.find(a => a.attribute.id == pa.attribute.id);
      if (attr != null) {
        pa.value = attr.value;
        pa.numberValue = attr.numberValue;
      }
    });

    filter.equipmentTemplateAttributes = {};

    this.filterDetail = filter;

    this.createFormControlForSupplyTypes();
    this.createFormControlForAttributes();
    this.selectedBrandText = this.filterDetail.checkedBrand != null ? this.filterDetail.checkedBrand.name : 'All brands';
    this.selectedEquipmentGroupText = this.filterDetail.checkedEquipmentGroup != null ? this.filterDetail.checkedEquipmentGroup.name : 'All equip. groups';
    this.selectedModelText = this.filterDetail.checkedModel != null ? this.filterDetail.checkedModel : 'All models';
  }

  createFormControlForAttributes() {
    const control = this.form.controls['attributes'] as FormArray;

    while (control.length !== 0) {
      control.removeAt(0);
    }

    this.filterDetail.equipmentAttributes.forEach(element => {
      control.push(
        this.formBuilder.group({
          id: [element.attribute.id],
          name: [element.attribute.name],
          value: [element.value],
          numberValue: [element.numberValue]
        })
      );
    });
  }

  onSupplyTypeChanged(isChecked: boolean, idx: number) {
    if (isChecked) {
      this.form.controls['allSupplyTypes'].setValue(false);
    }
    this.filterDetail.supplyTypes[idx].isChecked = !isChecked;
    this.updateFilter();
  }

  onAllSupplyTypesChanged() {
    if (!this.form.controls['allSupplyTypes'].value) {
      this.filterDetail.supplyTypes.forEach(s => {
        s.isChecked = true;
      });
      this.updateFilter();
    }
  }

  onEquipmentGroupChanged(equipmentGroup: EquipmentGroupViewModel) {
    this.filterDetail.checkedEquipmentGroup = equipmentGroup;
    this.updateFilter();
  }

  onBrandChanged(brand: BrandViewModel) {
    this.filterDetail.checkedBrand = brand;
    this.updateFilter();
  }

  onModelChanged(model: string) {
    this.filterDetail.checkedModel = model;
    this.updateFilter();
  }

  onAttributeChanged(attr) {
    this.filterDetail.equipmentAttributes.forEach(a => {
      if (a.attribute.id == attr.attribute.id) {
        if (attr.attribute.fieldType === FieldType.Combo) {
          a.value = attr.value;
        } else {
          a.numberValue = attr.value;
        }
      }
    });
    this.updateFilter();
  }

  loadData() {
    const itemsOffset = this.page * this.itemsPerPage - this.itemsPerPage;
    this.equipmentService.getAllEquipmentTemplates(this.filter, this.orderIndex, this.searchTerms, itemsOffset, this.itemsPerPage)
      .subscribe((response: PagingViewModel<EquipmentTemplateListItemViewModel>) => {
        this.model = response;
      });
  }

  search(term: string): void {
    this.searchTermsSubject.next(term);
  }

  onEdit(equipmentTemplate: EquipmentTemplateViewModel) {
    const modalRef = this.modalService.open(CreateEquipmentComponent);
    modalRef.componentInstance.equipmentId = equipmentTemplate.id;

    modalRef.result.then((result) => {
      this.loadData();
    }, (reason) => {
    });
  }

  onDelete(equipmentTemplate: EquipmentTemplateViewModel) {
    this.equipmentService.deleteEquipmentTemplate(equipmentTemplate.id).subscribe(() => {
      this.loadData();
    });
  }

  onClone(equipmentTemplateId: string) {
    this.equipmentService.getEquipmentTemplate(equipmentTemplateId).subscribe((equpmentTemplate) => {
      const newEquipmentTemplate = {...equpmentTemplate, equipmentModel: 'Copy - ' + equpmentTemplate.equipmentModel};

      this.equipmentService.createEquipmentTemplate(newEquipmentTemplate).subscribe(() => {
        this.loadData();
      });
    });
  }

  getItemsDetails() {
    let text = '';

    if (this.itemsPerPage !== null) {
      let start = this.page * this.itemsPerPage - this.itemsPerPage + 1;
      let end = this.page * this.itemsPerPage;

      if (start > this.model.total) {
        start = this.model.total;
      }
      if (end > this.model.total) {
        end = this.model.total;
      }

      text = 'Showing {0}-{1} of {2} units of equipment';
      text = text.replace('{0}', start.toString());
      text = text.replace('{1}', end.toString());
      text = text.replace('{2}', this.model.total.toString());
    } else {
      text = 'Showing all {0} units of equipment'.replace('{0}', this.model.total.toString());
    }

    return text;
  }

  setItemsPerPage(value: number | null) {
    this.page = 1;
    this.itemsPerPage = value;
    this.loadData();
  }

  onResetFilter() {
    this.filterDetail.checkedBrand = null;
    this.filterDetail.checkedModel = null;
    this.filterDetail.checkedEquipmentGroup = null;
    this.filterDetail.equipmentAttributes = this.allEquipmentAttributes.filter(a => {
      let flag = false;
      a.equipmentGroups.forEach(elem => {
        if (this.filterDetail.equipmentGroups.find(eq => eq.id == elem.id) != null) {
          flag = true;
        }
      });
      return flag;
    }).map(a => {
      return {attribute: a, value: '', numberValue: '', unitValues: []};
    });
    this.filterDetail.supplyTypes.forEach(s => {
      s.isChecked = true;
    });

    this.updateFilter();

    this.form.controls['allSupplyTypes'].setValue(true);
    this.form.controls['isOldModel'].setValue(true);

    this.filter = new EquipmentTemplateFilterViewModel();
    this.filter.isOldModel = true;
    this.filter.supplyTypes.push(SupplyType.Electricity, SupplyType.AdHoc, SupplyType.Gas, SupplyType.Sewerage, SupplyType.Water);
    this.loadData();
  }

  onApply() {
    this.filter = new EquipmentTemplateFilterViewModel();
    this.filter.attributes = this.filterDetail.equipmentAttributes;
    this.filter.brandId = this.filterDetail.checkedBrand != null ? this.filterDetail.checkedBrand.id : null;
    this.filter.equipmentGroupId = this.filterDetail.checkedEquipmentGroup != null ? this.filterDetail.checkedEquipmentGroup.id : null;
    this.filter.isOldModel = this.form.controls['isOldModel'].value;
    this.filter.supplyTypes = this.filterDetail.supplyTypes.filter(s => s.isChecked == true).map(s => s.supplyType);
    this.filter.equipmentModel = this.filterDetail.checkedModel;
    this.loadData();
  }

  onExpandFilter() {
    if (this.isExpandFilter) {
      this.isExpandFilter = false;
    } else {
      this.isExpandFilter = true;
    }
  }

  changeOrderIndex(idx) {
    if (this.orderIndex == idx || (this.orderIndex == (idx * -1))) {
      this.orderIndex *= -1;
    } else {
      this.orderIndex = idx;
    }

    this.loadData();
  }

  onClose() {
    this.isExpandFilter = false;
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadData();
  }

}

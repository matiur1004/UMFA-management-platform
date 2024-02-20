import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchFilterModel} from '../../models/search-filter.model';
import {NodeType} from '../../models';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.less']
})
export class SearchFormComponent implements OnInit {
  @Input() suppliers: any[];
  @Input() areas: any[];
  @Output() onSearch: EventEmitter<SearchFilterModel> = new EventEmitter<SearchFilterModel>();
  isAdvanceSearchDisplayed = false;
  searchForm: SearchFilterModel;
  locationTypes: any[] = [];
  nodeType = NodeType;
  nodeTypes = [
    {
      label: NodeType[NodeType.Single],
      value: NodeType.Single
    },
    {
      label: NodeType[NodeType.Multi],
      value: NodeType.Multi
    }
  ];
  tariffs: any[] = [];
  showFilter: boolean;

  constructor(private datePipe: DatePipe) {
    this.searchForm = {
      name: '',
      nodeType: '',
      areaId: '',
      tariffIds: [],
      supplyToId: '',
      locationTypeId: null,
      attributeValueFilter: {
        attributeId: null,
        min: null,
        max: null,
      }
    };
  }

  @Input('tariffs')
  set croppedListOfTariffs(tariffs: any[]) {
    if (tariffs) {
      this.tariffs = tariffs.map(tariff => {
        let name = tariff.entity.name + ' ' + tariff.majorVersion + '-' + this.datePipe.transform(tariff.versionDate, 'dd/MM/yyyy');
        return {
          id: tariff.id,
          name: name
        }
      }).sort((a, b) => {
        return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0);
      });
    }
  }

  @Input('attributes')
  set attributes(attributes: any[]) {
    if (attributes) {
      var cbSizeAttribute = attributes.find(attribute => attribute.name.toLocaleLowerCase() === "cb size");
      this.searchForm.attributeValueFilter.attributeId = cbSizeAttribute && cbSizeAttribute.id;
    }
  }

  ngOnInit() {
    this.onResetFilter();
  }

  onResetFilter() {
    this.searchForm.name = '';
    this.searchForm.nodeType = '';
    this.searchForm.areaId = '';
    this.searchForm.tariffIds = [];
    this.searchForm.supplyToId = '';
    this.searchForm.locationTypeId = null;
    this.locationTypes = [];
    this.searchForm.attributeValueFilter = {
      attributeId: this.searchForm.attributeValueFilter.attributeId,
      min: null,
      max: null,
    };
    this.onSubmit();
  }

  onToggleAdvanceSearch() {
    this.isAdvanceSearchDisplayed = !this.isAdvanceSearchDisplayed;
  }

  onChangeQuickFilter() {
    this.onSubmit();
  }

  onSubmit() {
    let query = {...this.searchForm};
    this.onSearch.emit(query);
  }

  updateSupplyTo() {
    if (this.searchForm.supplyToId != '') {
      this.locationTypes = this.suppliers && this.suppliers.find(supplier => supplier.id === this.searchForm.supplyToId).locationTypes;
      this.searchForm.locationTypeId = '';
    } else {
      this.locationTypes = [];
      this.searchForm.locationTypeId = null;
    }
  }
}

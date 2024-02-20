import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SupplyType } from '@app/shared/models';
import { TenantCostReportFilterViewModel } from '../../../shared/models/consumption-report.model';
import { TenantDetailConsumptionReportModel } from '../../../shared/models/detail-consumption-report.model';
import { ConsumptionReportService } from '../../services/consumption-report.service';

@Component({
  selector: 'detail-consumption-tenants-list',
  templateUrl: './detail-consumption-tenants-list.component.html',
  styleUrls: ['./detail-consumption-tenants-list.component.less']
})
export class DetailConsumptionTenantsListComponent implements OnInit {
  @Input() tenants: any[] = []
  @Output() expandToggleTenantEvent = new EventEmitter<any>();
  serviceType = SupplyType;
  constructor(
  ) { }

  ngOnInit(): void {
  }

  onExpandToggleTenant(event, depth) {
    if(depth == 0) {
      this.expandToggleTenantEvent.emit({id: event.id, depth: depth});
    } else {
      if(depth == 1) {
        if(event.isExpanded) {
          event.isExpanded = false;
          event.childs = [];
        } else {
          event.isExpanded = true;
          let childElements = [];
          let item = new TenantDetailConsumptionReportModel();
          item.tenantName = '';
          item.shopName = '';
          //item.shopDetailName = event.details.shopOwnCosts.shopName;
          item.shopDetailName = 'Shop Own Costs';
          item.costs = [{
            totalExel: event.details.shopOwnCosts.total,
            vat: event.details.shopOwnCosts.totalIncVat - event.details.shopOwnCosts.total,
            totalIncl: event.details.shopOwnCosts.totalIncVat
          }]
          item.details = event.details.shopOwnCosts.nodeTariffSections;
          childElements.push(item);
          event.details.commonAreaCosts.map(commonAreaItem => {
            let item = new TenantDetailConsumptionReportModel();
            item.tenantName = '';
            item.shopName = '';
            item.shopDetailName = commonAreaItem.commonAreaName;
            item.details = commonAreaItem.nodeTariffSections;
            item.costs = [{
              totalExel: commonAreaItem.total,
              vat: commonAreaItem.totalIncVat - commonAreaItem.total,
              totalIncl: commonAreaItem.totalIncVat
            }]
            childElements.push(item);
          })
          event.childs = childElements;
        }
      } else if(depth == 2) {
        if(event.isExpanded) {
          event.isExpanded = false;
          event.childs = [];
        } else {
          event.isExpanded = true;
          let childElements = [];
          event.details.forEach(element => {
            let item = new TenantDetailConsumptionReportModel();
            item.tenantName = '';
            item.shopName = '';
            item.supplyName = `${this.serviceType[element.supplyType]} - ${element.tariffName}`;
            item.id = element.nodeId;
            item.details = element.lineItems;
            item.costs = [{
              totalExel: element.lineItemsTotalPrice,
              vat: element.lineItemsTotalPriceVatInc - element.lineItemsTotalPrice,
              totalIncl: element.lineItemsTotalPriceVatInc
            }]
            childElements.push(item);
          });
          event.childs = childElements;  
        }
      } else if (depth == 3) {
        if(event.isExpanded) {
          event.isExpanded = false;
          event.childs = [];
        } else {
          event.isExpanded = true;
          let childElements = [];
          event.details.forEach(element => {
            let item = new TenantDetailConsumptionReportModel();
            item.tenantName = '';
            item.shopName = '';
            item.supplyName = '';
            item.itemName = element.lineItemName;
            item.id = element.lineItemId;
            item.details = element.priceDetails;
            item.costs = [{
              totalExel: element.total,
              vat: element.totalIncVat - element.total,
              totalIncl: element.totalIncVat
            }];
            item.isLast = true;
            childElements.push(item);
          });
          event.childs = childElements;
        }
      }
      
      console.log(event);
    }
    
  }
}

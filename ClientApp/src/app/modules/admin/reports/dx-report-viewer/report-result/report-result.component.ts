import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DxReportViewerComponent } from 'devexpress-reporting-angular';
import { ActionId, PreviewElements } from 'devexpress-reporting/dx-webdocumentviewer'
import { Subscription, tap, timer } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { view } from 'devexpress-reporting/scopes/reporting-chart-internal-series';
import { DXReportService } from 'app/shared/services/dx-report-service';
import { CONFIG } from 'app/core/helpers';

@Component({
  selector: 'report-result',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './report-result.component.html',
  styleUrls: [ 
    "./report-result.component.scss",
    "../../../../../../../node_modules/devextreme/dist/css/dx.common.css",
    "../../../../../../../node_modules/devextreme/dist/css/dx.light.css",
    "../../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css",
    "../../../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.material.blue.light.css",
    "../../../../../../../node_modules/devexpress-reporting/dist/css/dx-webdocumentviewer.css"
  ]
})
export class ReportResultComponent implements OnInit, AfterViewInit, OnDestroy {
  //postLoad: Subscription = timer(100, 100).pipe(tap(t => this.removeTabPanel())).subscribe();

  reportUrl: string = '';
  hostUrl = CONFIG.devExpressUrl;
  invokeAction: string = 'DXXRDV';
  loading = true;
  obsShowIt = this.reportService.obsLoadReport.pipe(tap(rep => {
    if (rep && rep.Id != 0) {
      this.loading = false;
      this.reportUrl = rep.DXReportName;
    }
    else {
      this.loading = true;
    }
  })).subscribe();

  obsShowShopIt = this.reportService.obsShopLoadReport.pipe(tap(rep => {
    if (rep && rep.Id != 0) {
      this.loading = false;
      this.reportUrl = rep.DXReportName;
    }
    else {
      this.loading = true;
    }
  })).subscribe();

  ngOnInit(): void {
  }

  // removeTabPanel() {
  //   let tabSuccess = false;
  //   let toolSuccess = false;
  //   var els = document.getElementsByClassName('dxrd-right-tabs');
  //   if (els.length > 0) {
  //     els[0].setAttribute('style', 'display: none');
  //     tabSuccess = true;
  //     //this.postLoad.unsubscribe();
  //   }
  //   var els = document.getElementsByClassName('dxrd-toolbar-wrapper');
  //   if (els.length > 0) {
  //     els[0].setAttribute('style', 'display: none');
  //     toolSuccess = true;
  //     //this.postLoad.unsubscribe();
  //   }
  //   if (tabSuccess && toolSuccess) {
  //     //this.postLoad.unsubscribe();
  //   }
  // }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  onCustomizeElements(event) {
    // var toolbar = event.args.GetById(PreviewElements.Toolbar);
    // var index = event.args.Elements.indexOf(toolbar);
    // //event.args.Elements.splice(index, 1);

    // var panel = event.args.GetById(PreviewElements.RightPanel);
    // var index = event.args.Elements.indexOf(panel);
    // event.args.Elements.splice(index, 1);
  }
  
  CustomizeMenuActions(event) {
    //const itemsToHide = [
    //  ActionId.FirstPage,
    //  ActionId.PrevPage,
    //  ActionId.NextPage,
    //  ActionId.LastPage,
    //  ActionId.MultipageToggle,
    //  ActionId.HighlightEditingFields,
    //  ActionId.ZoomOut,
    //  ActionId.ZoomSelector,
    //  ActionId.ZoomIn,
    //  ActionId.Print,
    //  ActionId.PrintPage,
    //  ActionId.Search,
    //  ActionId.ExportTo,
    //  ActionId.FullScreen,
    //  ActionId.MultipageToggle,
    //  ActionId.Pagination
    //]
    //itemsToHide.forEach((item) => {
    //  var itemAction = e.args.GetById(item);
    //  if (itemAction) itemAction.visible = false;
    //}) 
    // Hide the "Print" and "PrintPage" actions. 
  //  var printAction = event.args.GetById(ActionId.Print);
  //  if (printAction)
  //    printAction.visible = false;
  //  var printPageAction = event.args.GetById(ActionId.PrintPage);
  //  if (printPageAction)
  //    printPageAction.visible = false;
  }

  get ShowPage(): boolean {
    return this.reportService.ShowResultsPage();
  }

  constructor(private reportService: DXReportService) { }

}

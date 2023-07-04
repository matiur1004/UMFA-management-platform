import { Component, OnInit } from '@angular/core';
import { DXReportService } from '@shared/services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'report-result-consumption-recon',
  templateUrl: './report-result-consumption-recon.component.html',
  styleUrls: ['./report-result-consumption-recon.component.scss']
})
export class ReportResultConsumptionReconComponent implements OnInit {

  electricityRecoveriesDataSource: any;
  electricityBulkMetersDataSource: any;
  electricitySummariesDataSource: any;

  otherDataSource: any;
  otherRecoveriesDataSource: any;
  otherBulkMetersDataSource: any;
  otherSummariesDataSource: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private reportService: DXReportService
  ) { }

  ngOnInit(): void {
    this.reportService.consumptionSummaryRecon$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if(data) {
          console.log(data);
          // Electricity Recoveries Report
          this.electricityRecoveriesDataSource = data['ElectricityRecoveries'].map(item => {
            let result = {
              Name: item['ReconDescription'],
              KWHUnits: item['KWHUsage'],
              KWHRC: item['KWHAmount'],
              kVAUnits: item['KVAUsage'],
              KVARC: item['KVAAmount'],
              BasicRC: item['BCAmount'],
              OtherRC: item['OtherAmount'],
              TotalRC: item['TotalAmt']
            };
            return result;
          });
          this.electricityRecoveriesDataSource.push({
            Name: 'Total Potential Recoverable',
            KWHUnits: this.getTotal('KWHUsage', data['ElectricityRecoveries']),
            KWHRC: this.getTotal('KWHAmount', data['ElectricityRecoveries']),
            kVAUnits: this.getTotal('KVAUsage', data['ElectricityRecoveries']),
            KVARC: this.getTotal('KVAAmount', data['ElectricityRecoveries']),
            BasicRC: this.getTotal('BCAmount', data['ElectricityRecoveries']),
            OtherRC: this.getTotal('OtherAmount', data['ElectricityRecoveries']),
            TotalRC: this.getTotal('TotalAmt', data['ElectricityRecoveries']),
          })
          this.electricityRecoveriesDataSource.push({
            Name: 'Total Recoverable',
            KWHUnits: this.getTotal('KWHUsageRec', data['ElectricityRecoveries']),
            KWHRC: this.getTotal('KWHAmountRec', data['ElectricityRecoveries']),
            kVAUnits: this.getTotal('KVAUsageRec', data['ElectricityRecoveries']),
            KVARC: this.getTotal('KVAAmountRec', data['ElectricityRecoveries']),
            BasicRC: this.getTotal('BCAmountRec', data['ElectricityRecoveries']),
            OtherRC: this.getTotal('OtherAmountRec', data['ElectricityRecoveries']),
            TotalRC: this.getTotal('TotalAmtRec', data['ElectricityRecoveries']),
          })
          this.electricityRecoveriesDataSource.push({
            Name: 'Total Non Recoverable',
            KWHUnits: this.getTotal('KWHUsageNonRec', data['ElectricityRecoveries']),
            KWHRC: this.getTotal('KWHAmountNonRec', data['ElectricityRecoveries']),
            kVAUnits: this.getTotal('KVAUsageNonRec', data['ElectricityRecoveries']),
            KVARC: this.getTotal('KVAAmountNonRec', data['ElectricityRecoveries']),
            BasicRC: this.getTotal('BCAmountNonRec', data['ElectricityRecoveries']),
            OtherRC: this.getTotal('OtherAmountNonRec', data['ElectricityRecoveries']),
            TotalRC: this.getTotal('TotalAmtNonRec', data['ElectricityRecoveries']),
          })

          // Electricity Bulk Meters Report
          this.electricityBulkMetersDataSource = data['ElectricityBulkMeters'].map(item => {
            let result = {
              MeterNo: item['MeterNo'],
              Description: item['DescriptionField'],
              KWHUnits: item['KWHUsage'],
              KWHRC: item['KWHAmount'],
              kVAUnits: item['KVAUsage'],
              KVARC: item['KVAAmount'],
              BasicRC: item['BCAmount'],
              OtherRC: item['OtherAmount'],
              TotalRC: item['TotalAmount']
            };
            return result;
          });

          this.electricityBulkMetersDataSource.push({
            MeterNo: '',
            Description: '',
            KWHUnits: this.getTotal('KWHUsage', data['ElectricityBulkMeters']),
            KWHRC: this.getTotal('KWHAmount', data['ElectricityBulkMeters']),
            kVAUnits: this.getTotal('KVAUsage', data['ElectricityBulkMeters']),
            KVARC: this.getTotal('KVAAmount', data['ElectricityBulkMeters']),
            BasicRC: this.getTotal('BCAmount', data['ElectricityBulkMeters']),
            OtherRC: this.getTotal('OtherAmount', data['ElectricityBulkMeters']),
            TotalRC: this.getTotal('TotalAmt', data['ElectricityBulkMeters']),
          })

          // Electricity Summaries Report
          this.electricitySummariesDataSource = [];
          this.electricitySummariesDataSource.push({
            Name: 'Electricity Actual Recovery',
            KWHUnits: this.getTotal('ActualKWHUnitsDiff', data['ElectricitySummaries']),
            KWHRC: this.getTotal('ActualKWHAmountDiff', data['ElectricitySummaries']),
            kVAUnits: this.getTotal('ActualKVAUnitsDiff', data['ElectricitySummaries']),
            KVARC: this.getTotal('ActualKVAaAmountDiff', data['ElectricitySummaries']),
            BasicRC: this.getTotal('ActualBCDiff', data['ElectricitySummaries']),
            OtherRC: this.getTotal('ActualOtherDiff', data['ElectricitySummaries']),
            TotalRC: this.getTotal('ActualTotalDiff', data['ElectricitySummaries']),
          })

          this.electricitySummariesDataSource.push({
            Name: 'Electricity Actual Recovery %',
            KWHUnits: this.getTotal('PercActKWHUnits', data['ElectricitySummaries']),
            KWHRC: this.getTotal('PercActKWHAmount', data['ElectricitySummaries']),
            kVAUnits: this.getTotal('PercActKVAUnits', data['ElectricitySummaries']),
            KVARC: this.getTotal('PercActKVAAmount', data['ElectricitySummaries']),
            BasicRC: this.getTotal('PercActBC', data['ElectricitySummaries']),
            OtherRC: this.getTotal('PercActOther', data['ElectricitySummaries']),
            TotalRC: this.getTotal('PercActTotal', data['ElectricitySummaries']),
          })

          this.electricitySummariesDataSource.push({
            Name: 'Electricity Potential Recovery',
            KWHUnits: this.getTotal('KWHUnitsDiff', data['ElectricitySummaries']),
            KWHRC: this.getTotal('KWHAmountDiff', data['ElectricitySummaries']),
            kVAUnits: this.getTotal('KVAUnitsDiff', data['ElectricitySummaries']),
            KVARC: this.getTotal('KVAaAmountDiff', data['ElectricitySummaries']),
            BasicRC: this.getTotal('BCDiff', data['ElectricitySummaries']),
            OtherRC: this.getTotal('OtherDiff', data['ElectricitySummaries']),
            TotalRC: this.getTotal('TotalDiff', data['ElectricitySummaries']),
          })

          this.electricitySummariesDataSource.push({
            Name: 'Electricity Potential Recovery %',
            KWHUnits: this.getTotal('PercKWHUnitsDiff', data['ElectricitySummaries']),
            KWHRC: this.getTotal('PercKWHAmountDiff', data['ElectricitySummaries']),
            kVAUnits: this.getTotal('PercKVAUnitsDiff', data['ElectricitySummaries']),
            KVARC: this.getTotal('PercKVAaAmountDiff', data['ElectricitySummaries']),
            BasicRC: this.getTotal('PercBCDiff', data['ElectricitySummaries']),
            OtherRC: this.getTotal('PercOtherDiff', data['ElectricitySummaries']),
            TotalRC: this.getTotal('PercTotalDiff', data['ElectricitySummaries']),
          })
          // Other Report
          let serviceTypes = [];
          data['OtherRecoveries'].forEach(item => {
            if(serviceTypes.indexOf(item['ServiceName']) == -1) serviceTypes.push(item['ServiceName']);
          });

          this.otherDataSource = [];
          serviceTypes.forEach(service => {
            let report = {ServiceName: service, otherRecoveriesDataSource: [], otherBulkMetersDataSource: [], otherSummariesDataSource: []};
            
            // Other Recoveries Report
            let otherRecoveriesByService = data['OtherRecoveries'].filter(item => item['ServiceName'] == service);
            report['otherRecoveriesDataSource'] = otherRecoveriesByService.map(item => {
              let result = {
                Name: item['ReconDescription'],
                Usage: item['Usage'],
                Amount: item['Amount'],
                BCAmount: item['BCAmount'],
                TotalRC: item['TotalAmt']
              };
              return result;
            });

            report['otherRecoveriesDataSource'].push({
              Name: 'Total Potential Recoverable',
              Usage: this.getTotal('Usage', otherRecoveriesByService),
              Amount: this.getTotal('Amount', otherRecoveriesByService),
              BCAmount: this.getTotal('BCAmount', otherRecoveriesByService),
              TotalRC: this.getTotal('TotalAmt', otherRecoveriesByService),
            })
            report['otherRecoveriesDataSource'].push({
              Name: 'Total Recoverable',
              Usage: this.getTotal('UsageRecoverable', otherRecoveriesByService),
              Amount: this.getTotal('AmountRecoverable', otherRecoveriesByService),
              BCAmount: this.getTotal('BCAmountRecoverable', otherRecoveriesByService),
              TotalRC: this.getTotal('TotalAmtRec', otherRecoveriesByService),
            })
            report['otherRecoveriesDataSource'].push({
              Name: 'Total Non Recoverable',
              Usage: this.getTotal('UsageNonRecoverable', otherRecoveriesByService),
              Amount: this.getTotal('AmountNonRecoverable', otherRecoveriesByService),
              BCAmount: this.getTotal('BCAmountNonRecoverable', otherRecoveriesByService),
              TotalRC: this.getTotal('TotalAmtNonRec', otherRecoveriesByService),
            })

            // Other Bulk Meters Report
            let otherBulkMetersByService = data['OtherBulkMeters'].filter(item => item['ServiceName'] == service);
            report.otherBulkMetersDataSource = otherBulkMetersByService.map(item => {
              let result = {
                MeterNo: item['MeterNo'],
                Description: item['DescriptionField'],
                Usage: item['Usage'],
                Amount: item['ConsAmount'],
                BCAmount: item['BCAmount'],
                TotalRC: item['TotalAmount'],
              };
              return result;
            });
            report.otherBulkMetersDataSource.push({
              MeterNo: '',
              Description: '',
              Usage: this.getTotal('Usage', otherBulkMetersByService),
              Amount: this.getTotal('ConsAmount', otherBulkMetersByService),
              BCAmount: this.getTotal('BCAmount', otherBulkMetersByService),
              TotalRC: this.getTotal('TotalAmount', otherBulkMetersByService)
            })

            // Summaries Report
            let otherSummariesByService = data['OtherSummaries'].filter(item => item['ServiceName'] == service);
            report.otherSummariesDataSource = [];
            report.otherSummariesDataSource.push({
              Name: `${service} Actual Recovery`,
              Usage: this.getTotal('ActualKLUnitsDiff', otherSummariesByService),
              Amount: this.getTotal('ActualKLAmountDiff', otherSummariesByService),
              BCAmount: this.getTotal('ActualBCDiff', otherSummariesByService),
              TotalRC: this.getTotal('ActualTotalDiff', otherSummariesByService)
            })
            
            report.otherSummariesDataSource.push({
              Name: `${service} Actual Recovery %`,
              Usage: this.getTotal('PercActKLUnits', otherSummariesByService),
              Amount: this.getTotal('PercActKLAmount', otherSummariesByService),
              BCAmount: this.getTotal('PercActBC', otherSummariesByService),
              TotalRC: this.getTotal('PercActTotal', otherSummariesByService)
            })

            report.otherSummariesDataSource.push({
              Name: `${service} Potential Recovery`,
              Usage: this.getTotal('KLUnitsDiff', otherSummariesByService),
              Amount: this.getTotal('KLAmountDiff', otherSummariesByService),
              BCAmount: this.getTotal('BCDiff', otherSummariesByService),
              TotalRC: this.getTotal('TotalDiff', otherSummariesByService)
            })

            report.otherSummariesDataSource.push({
              Name: `${service} Potential Recovery %`,
              Usage: this.getTotal('PercKLUnitsDiff', otherSummariesByService),
              Amount: this.getTotal('PercKLAmountDiff', otherSummariesByService),
              BCAmount: this.getTotal('PercBCDiff', otherSummariesByService),
              TotalRC: this.getTotal('PercTotalDiff', otherSummariesByService)
            })
            this.otherDataSource.push(report);
          })
        }
      });
  }

  getTotal(key, source) {
    let total = 0;
    source.forEach(item => {
      total += item[key];
    })
    return total;
  }

  onCellPrepared(event) {
    if (event.rowType === "data") {
      if(event.columnIndex == 0) event.cellElement.style.fontWeight = 'bold';
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

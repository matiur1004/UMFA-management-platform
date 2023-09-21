import { NgModule } from "@angular/core";
import { MeterAlarmDetailComponent } from "./meter-alarm-detail.component";
import { AlarmPeakUsageComponent } from "./alarm-peak-usage/alarm-peak-usage.component";
import { AlarmNightFlowComponent } from "./alarm-night-flow/alarm-night-flow.component";
import { AlarmLeakDetectionComponent } from "./alarm-leak-detection/alarm-leak-detection.component";
import { AlarmDailyUsageComponent } from "./alarm-daily-usage/alarm-daily-usage.component";
import { AlarmBurstPipeComponent } from "./alarm-burst-pipe/alarm-burst-pipe.component";
import { AlarmAverageUsageComponent } from "./alarm-average-usage/alarm-average-usage.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { DxChartModule, DxDateBoxModule } from "devextreme-angular";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
    declarations: [
        MeterAlarmDetailComponent,
        AlarmPeakUsageComponent,
        AlarmNightFlowComponent,
        AlarmLeakDetectionComponent,
        AlarmDailyUsageComponent,
        AlarmBurstPipeComponent,
        AlarmAverageUsageComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        DxChartModule,
        DxDateBoxModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        NgSelectModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        SharedModule
    ],
    exports: [
        MeterAlarmDetailComponent
    ]
})

export class MeterAlarmDetailModule { }
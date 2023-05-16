import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { DXReportService } from 'app/shared/services/dx-report-service';
import { tap } from 'rxjs';

@Component({
  selector: 'report-selection',
  templateUrl: './report-selection.component.html',
  styleUrls: ['./report-selection.component.scss']
})
export class ReportSelectionComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() reportList;
  selectedReportId: number;
  form: UntypedFormGroup;
  
  custReportTemplate = (arg: any) => {
    var ret = "<div class='custom-item' title='" + arg.Description + "'>" + arg.Name + "</div>";
    return ret;
  }

  constructor(private reportService: DXReportService,
    private userService: UserService,
    private _formBuilder: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      selectedReportId: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    //this.form.setValue(null);
    this.reportService.setFrmValid(1, false);
  }

  ngAfterViewInit(): void {
    this.reportService.loadBuildings(this.userService.userValue.UmfaId);
  }

  selectReport() {
    this.reportService.sendError(null);
    try {
      if (this.form.valid) {
        console.log(this.form.get('selectedReportId').value);
        this.reportService.setFrmValid(1, true);
        this.reportService.SelectedReportId = this.form.get('selectedReportId').value;
        this.reportService.loadPartners(this.userService.userValue.UmfaId);
      } else this.reportService.setFrmValid(1, false);
    }
    catch (e) {
      this.reportService.setFrmValid(1, false);
      this.reportService.sendError(e.toString());
    }
  }

  selectionChanged(e: any) {
    if (e) {
      this.reportService.ReportSelectionChanged();
      this.selectReport();
    }
  }


}

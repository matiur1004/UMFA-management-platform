import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UmfaUtils } from '@core/utils/umfa.utils';
import { AlarmConfigurationService } from '@shared/services/alarm-configuration.service';

@Component({
  selector: 'app-alarm-burst-pipe',
  templateUrl: './alarm-burst-pipe.component.html',
  styleUrls: ['./alarm-burst-pipe.component.scss']
})
export class AlarmBurstPipeComponent implements OnInit {

  constructor(
    private _alarmConfigService: AlarmConfigurationService,
    private _formBuilder: FormBuilder,
    private _ufUtils: UmfaUtils
  ) { }

  ngOnInit(): void {
  }

  onAlarmConfigBurstPipe() {

  }

  getAlarmAnalyzeBurstPipe() {
    
  }
}

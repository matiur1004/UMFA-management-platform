import {inject, TestBed} from "@angular/core/testing";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {APP_BASE_HREF} from "@angular/common";

import {BuildingService} from './building.service';
import {AuthService, NotificationService, ProgressSpinnerService} from "@services";
import { LocalStorageService } from "./local-storage.service";

describe('BuildingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        RouterModule.forRoot([
          {path: '**', redirectTo: '/'}
        ]),
        // LocalStorageModule.withConfig({
        //   prefix: 'dunamis',
        //   storageType: 'localStorage'
        // })
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        BuildingService,
        NotificationService,
        ProgressSpinnerService,
        AuthService,
        LocalStorageService
      ]
    });
  });

  it('should ...', inject([BuildingService], (service: BuildingService) => {
    expect(service).toBeTruthy();
  }));

  /*it('get all building', inject([BuildingService], (service: BuildingService) => {
    service.getAll().subscribe(res => {
      console.log('RES:', res);
    }, err => {
      console.log('ERR:', err);
    });
    expect(service).toBeTruthy();
  }));*/
});

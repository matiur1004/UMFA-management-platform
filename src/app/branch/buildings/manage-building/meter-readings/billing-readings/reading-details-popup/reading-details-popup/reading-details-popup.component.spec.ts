import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';
import {HttpClient} from '@angular/common/http';

import {AuthService, NotificationService, ProgressSpinnerService} from '@services';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {LogoComponent} from 'app/widgets/logo/logo.component';

import {ReadingDetailsPopupComponent} from './reading-details-popup.component';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'registerUnit'})
class MockRegisterUnitPipe implements PipeTransform {
  transform(value: string, tou: number = null) {
    return value;
  }
}

describe('ReadingDetailsPopupComponent', () => {
  let component: ReadingDetailsPopupComponent;
  let fixture: ComponentFixture<ReadingDetailsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        PipesModule,
        RouterModule.forRoot([]),
        DunamisInputsModule
      ],
      declarations: [
        LogoComponent,
        ReadingDetailsPopupComponent,
        MockRegisterUnitPipe
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue: '/'},
        NgbActiveModal,
        {provide: HttpClient, useValue: {}},
        {provide: NotificationService, useValue: {}},
        {provide: ProgressSpinnerService, useValue: {}},
        {provide: AuthService, useValue: {}}
      ]
    }).compileComponents();
  }));

  it('should create', () => {
    fixture = TestBed.createComponent(ReadingDetailsPopupComponent);
    component = fixture.componentInstance;
    component.readingDetails = <any>{};
    component.meter = <any>{registers: []};
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});

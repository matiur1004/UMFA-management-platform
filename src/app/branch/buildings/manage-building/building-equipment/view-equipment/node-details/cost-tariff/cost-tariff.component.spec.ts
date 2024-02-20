import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CostTariffComponent} from './cost-tariff.component';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';
import {NgrxFormsModule} from 'ngrx-forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {Store} from '@ngrx/store';
import {PipesModule} from 'app/shared/pipes/pipes.module';
import {Pipe, PipeTransform} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Pipe({name: 'registerUnit'})
class MockRegisterUnitPipe implements PipeTransform {
  transform(value: string, tou: number = null) {
    return value;
  }
}

describe('CostTariffComponent', () => {
  let component: CostTariffComponent;
  let fixture: ComponentFixture<CostTariffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        DunamisInputsModule,
        NgrxFormsModule,
        NgSelectModule,
        PipesModule
      ],
      declarations: [MockRegisterUnitPipe, CostTariffComponent],
      providers: [
        {
          provide: Store, useValue: {
            select: () => {
            }, dispatch: () => {
            }
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

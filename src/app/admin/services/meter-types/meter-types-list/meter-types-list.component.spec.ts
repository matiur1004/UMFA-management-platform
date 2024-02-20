import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {Store} from '@ngrx/store';
import {MeterTypesListComponent} from './meter-types-list.component';
import {NgrxFormsModule} from 'ngrx-forms';

import {WidgetsModule} from 'app/widgets/module/widgets.module';
import {DunamisInputsModule} from 'app/widgets/inputs/shared/dunamis-inputs.module';


describe('MeterTypesListComponent', () => {
  let component: MeterTypesListComponent;
  let fixture: ComponentFixture<MeterTypesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NgrxFormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        WidgetsModule,
        DunamisInputsModule
      ],
      declarations: [MeterTypesListComponent],
      providers: [
        {
          provide: Store, useValue: {
            select: () => {
            }, dispatch: () => {
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeterTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

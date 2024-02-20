import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';

import {PipesModule} from 'app/shared/pipes/pipes.module';
import {SimpleSearchFormComponent} from 'app/widgets/simple-search-form/simple-search-form.component';

import {DialogSelectUnitsComponent} from './dialog-select-units.component';
import {SortUnitsPipe} from '../../pipes/sort-units.pipe';
import {FilterUnitsShowingPipe} from '../../pipes/filter-units-showing.pipe';

describe('DialogSelectUnitsComponent', () => {
  let component: DialogSelectUnitsComponent;
  let fixture: ComponentFixture<DialogSelectUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        NgbModule.forRoot(),
        NgSelectModule,
        PipesModule
      ],
      declarations: [
        SimpleSearchFormComponent,
        DialogSelectUnitsComponent,
        SortUnitsPipe,
        FilterUnitsShowingPipe
      ],
      providers: [
        NgbActiveModal
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectUnitsComponent);
    component = fixture.componentInstance;
    component.units = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call onChangeOrderIndex', () => {
    component.onChangeOrderIndex(component.orderType.TenantNameAsc);
    expect(component.orderIndex).toEqual(2);
    component.onChangeOrderIndex(component.orderType.TenantNameAsc);
    expect(component.orderIndex).toEqual(-2);
    component.onChangeOrderIndex(component.orderType.TenantNameAsc);
    expect(component.orderIndex).toEqual(2);

    component.onChangeOrderIndex(component.orderType.FloorDesc);
    expect(component.orderIndex).toEqual(-5);
  });

  it('call search', () => {
    component.search('qwe');
    expect(component.searchText).toEqual('qwe');

    component.search('zxc');
    expect(component.searchText).toEqual('zxc');
  });

});

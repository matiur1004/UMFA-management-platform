import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EquipmentSettingsComponent} from './equipment-settings.component';

describe('ListObisCodesComponent', () => {
  let component: EquipmentSettingsComponent;
  let fixture: ComponentFixture<EquipmentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquipmentSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

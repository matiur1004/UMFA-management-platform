import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, Input} from '@angular/core';

import {MarketingMapComponent} from './marketing-map.component';

describe('MarketingMapComponent', () => {
  let component: MarketingMapComponent;
  let fixture: ComponentFixture<MarketingMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingsMapComponent, MarketingMapComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'buildings-map',
  template: '<div>buildings-map</div>',
})
export class BuildingsMapComponent {
  @Input() model: any[];
  @Input() center: any;
  @Input() zoom: number;
  @Input() showOnMap: boolean;
}

const google: any = {
  maps: {
    'LatLng': function (lat: number, lng: number, noWrap?: boolean) {
    }
  }
};
window['google'] = google;

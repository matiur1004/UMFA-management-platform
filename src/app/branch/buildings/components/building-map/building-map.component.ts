import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MapComponent} from 'app/widgets/map/map.component';
import {AddressPhysicalViewModel, BuildingViewModel} from '@models';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'building-map',
  templateUrl: './building-map.component.html',
  styleUrls: ['./building-map.component.less']
})
export class BuildingMapComponent extends MapComponent implements OnInit, OnDestroy {

  @Input() addressChangedSubject: Subject<boolean>;
  @Input() isNew: boolean;
  @Input() model: BuildingViewModel;
  @Output() modelChanged = new EventEmitter<BuildingViewModel>();
  subscription$: Subscription;
  private marker: google.maps.Marker;
  private geocoder = new google.maps.Geocoder();

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscription$ = this.addressChangedSubject.subscribe(event => this.refreshMarker());

    if (this.isNew) {
      this.model.address.latitude = -9;
      this.model.address.longitude = 23;
      this.map.setZoom(4);
    } else {
      this.map.setZoom(13);
    }

    this.map.setCenter({
      lat: this.model.address.latitude,
      lng: this.model.address.longitude
    });

    this.marker = new google.maps.Marker({
      position: {
        lat: this.model.address.latitude,
        lng: this.model.address.longitude
      },
      map: this.map,
      draggable: true,
      title: this.model.name,
      icon: '../../../assets/images/icons/pin.png'
    });

    this.marker.addListener('dragend', (event) => this.markerDrag(event));
  }

  transformGoogleAddressToLocalModel(address: google.maps.GeocoderResult[]) {
    const newAddress = new AddressPhysicalViewModel();
    const address_components = address[0].address_components.reverse();
    address_components.forEach(item => {
      const typeAddress = item.types[0];
      switch (typeAddress) {
        case 'establishment': {
          newAddress.country = item.long_name;
          break;
        }
        case 'country': {
          newAddress.country = item.long_name;
          break;
        }
        case 'administrative_area_level_1': {
          newAddress.province = item.long_name;
          break;
        }
        case '"administrative_area_level_2"': {
          newAddress.suburb = item.long_name;
          break;
        }
        case 'locality': {
          newAddress.city = item.long_name;
          break;
        }
        case 'postal_code': {
          newAddress.code = item.long_name;
          break;
        }
        case 'route': {
          newAddress.line1 = item.long_name;
          break;
        }
        case 'street_number': {
          newAddress.line2 = item.long_name;
          break;
        }
      }
    });

    this.model.address = newAddress;

  }

  markerDrag(event) {
    this.model.address.latitude = event.latLng.lat();
    this.model.address.longitude = event.latLng.lng();

    this.geocoder.geocode({
      location: event.latLng
    }, (results, status) => {

      if (status == google.maps.GeocoderStatus.OK) {
        this.transformGoogleAddressToLocalModel(results);
      } else {
        alert('Geocoder failed due to: ' + status);
      }

      this.modelChanged.emit(this.model);
    });
  }

  refreshMarker() {
    let address = '';
    address += this.model.address.line1 + ', ';
    address += this.model.address.line2 + ', ';
    address += this.model.address.city + ', ';
    address += this.model.address.code + ', ';
    address += this.model.address.country + ', ';
    this.geocoder.geocode({'address': address}, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        this.map.setZoom(15);
        this.map.setCenter(results[0].geometry.location);
        this.marker.setPosition(results[0].geometry.location);
        this.model.address.latitude = results[0].geometry.location.lat();
        this.model.address.longitude = results[0].geometry.location.lng();
        this.modelChanged.emit(this.model);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}

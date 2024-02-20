import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MapComponent} from 'app/widgets/map/map.component';
import {BuildingViewModel} from '@models';
import {WindowRef} from '@services';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

declare const SnazzyInfoWindow: any;

@Component({
  selector: 'buildings-map',
  templateUrl: './buildings-map.component.html',
  styleUrls: ['./buildings-map.component.less']
})
export class BuildingsMapComponent extends MapComponent implements OnChanges, OnInit, OnDestroy {
  @ViewChild('popupBlock', {read: ElementRef, static: false}) popupBlock: ElementRef;
  @Input() model: BuildingViewModel[];
  @Input() center: google.maps.LatLng;
  @Input() zoom: number;
  @Input() showOnMap: boolean;
  selectedBuilding: BuildingViewModel;
  private pathFromRoot$: Subscription;
  private branchId: string;

  constructor(private ref: ChangeDetectorRef, private windowRef: WindowRef, private router: Router, private zone: NgZone, private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.pathFromRoot$ = this.activatedRoute.pathFromRoot[2].params.subscribe(params => {
      this.branchId = params['branchid'];
    });
    this.mapInit();
  }

  mapInit() {
    super.ngOnInit();
    this.windowRef.getWindow().openBuilding = (id) => this.navigateToBuilidng(id);
    this.map.setCenter(this.center);
    this.map.setZoom(this.zoom);
    let latlngbounds = new google.maps.LatLngBounds();
    for (let building of this.model) {
      let marker = new google.maps.Marker({
        position: {
          lat: building.address.latitude,
          lng: building.address.longitude
        },
        map: this.map,
        title: building.name,
      });

      this.setMarkerInctive(marker, building);
      const window = new SnazzyInfoWindow({
        marker: marker
      });

      latlngbounds.extend(marker.getPosition());

      marker.addListener('mouseover', () => this.setMarkerActive(marker, building));
      marker.addListener('mouseout', () => this.setMarkerInctive(marker, building));
      marker.addListener('click', () => this.onMarkerClick(marker, building, window));
    }

    if (!this.showOnMap && !latlngbounds.isEmpty()) {
      this.map.fitBounds(latlngbounds);
    }
  }

  onMarkerClick(marker, building, window) {

    if (window.hasContent) {
      return;
    }
    window.hasContent = true;

    this.selectedBuilding = building;
    this.ref.detectChanges();
    window.setContent(this.popupBlock.nativeElement.innerHTML);
    this.selectedBuilding = null;
  }

  navigateToBuilidng(id) {
    this.zone.run(() => this.router.navigate([`/branch/${this.branchId}/buildings/${id}`]));
  }

  setMarkerActive(marker: google.maps.Marker, building) {
    if (building.categories.length) {
      let base = '../../assets/images/icons/build-ctg/pin_{0}_hover.svg';
      let iconName = building.categories[0].icon.toLowerCase();
      let icon = {url: base.replace('{0}', iconName), scaledSize: new google.maps.Size(40, 40)};
      marker.setIcon(icon);
    }
  }

  setMarkerInctive(marker: google.maps.Marker, building) {
    if (building.categories.length) {
      let base = '../../assets/images/icons/build-ctg/pin_{0}.svg';
      let iconName = building.categories[0].icon.toLowerCase();
      let icon = {url: base.replace('{0}', iconName), scaledSize: new google.maps.Size(30, 30)};
      marker.setIcon(icon);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.mapInit();
  }

  ngOnDestroy() {
    this.windowRef.getWindow().openBuilding = null;
    this.pathFromRoot$.unsubscribe();
  }

}

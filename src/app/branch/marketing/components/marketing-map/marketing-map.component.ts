import {Component, Input, OnInit} from '@angular/core';
import {ClientPortfolioViewModel, ClientViewModel} from '@models';

declare const google;


@Component({
  selector: 'marketing-map',
  templateUrl: './marketing-map.component.html',
  styleUrls: ['./marketing-map.component.less']
})
export class MarketingMapComponent implements OnInit {
  public mapCenter: any;
  public mapZoom: number;
  public showOnMap = false;
  public client: ClientViewModel;
  public clientPortfolio: ClientPortfolioViewModel;
  public selectedClientText: string = 'Select client';
  public selectedClientPortfolioText: string = 'Select portfolio';

  @Input() model;
  @Input() buildings;
  @Input() clients;

  constructor() {
  }

  @Input('building') set building(value) {
    if (value && value.address) {
      this.mapZoom = 13;
      this.showOnMap = true;
      this.mapCenter = new google.maps.LatLng(value.address.latitude, value.address.longitude);
    }
  }

  ngOnInit() {
    this.mapCenter = new google.maps.LatLng(-13, 23);
    this.mapZoom = 4;
    this.showOnMap = false;
  }

  clientChange(client) {
    this.client = client;
    this.clientPortfolio = new ClientPortfolioViewModel();
    this.selectedClientText = client.name;
    this.selectedClientPortfolioText = "Select portfolio";

    this.buildings = this.model.items.filter(building => building.client.id == client.id);
  }

  clientPortfolioChanged(clientPortfolio) {
    this.clientPortfolio = clientPortfolio;
    this.selectedClientPortfolioText = clientPortfolio.name;
    this.buildings = this.model.items.filter(building => building.clientPortfolio.id == this.clientPortfolio.id);
  }


}

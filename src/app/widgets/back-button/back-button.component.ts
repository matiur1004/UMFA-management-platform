import {Component, Input, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.less']
})
export class BackButtonComponent implements OnInit {

  location: Location;

  @Input() redirectPath: any[] | null;

  constructor(private router: Router, location: Location) {
    this.location = location;
  }

  ngOnInit() {
  }

  back() {
    if (!this.redirectPath) {
      this.location.back();
    } else {
      try {
        this.router.navigate(this.redirectPath, {replaceUrl: true});
      } catch (e) {
        this.location.back();
      }
    }
  }
}

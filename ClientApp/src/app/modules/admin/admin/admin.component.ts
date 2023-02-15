import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  
  selectedTab: number = 0;
  
  constructor(private router: Router, activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log(location.pathname)
    if(location.pathname.includes('amrMeter')) this.selectedTab = 1;
  }

  onChange(event) {
    if(event.index == 0) {
      this.router.navigate(['/admin/amrUser']);
    } else {
      this.router.navigate(['/admin/amrMeter']);
    }
  }
}

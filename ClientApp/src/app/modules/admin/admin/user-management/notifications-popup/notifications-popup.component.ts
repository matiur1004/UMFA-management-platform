import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications-popup',
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss']
})
export class NotificationsPopupComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<NotificationsPopupComponent>,
  ) { }

  ngOnInit(): void {
  }

}

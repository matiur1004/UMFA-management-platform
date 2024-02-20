import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotificationType} from '@models';
import {NotificationService, PermissionService} from '@services';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'app';

  notificationSubscription: Subscription;

  constructor(vcr: ViewContainerRef, private notificationService: NotificationService, private toastr: ToastrService, private permissionService: PermissionService) {

  }

  ngOnInit() {
    this.notificationSubscription = this.notificationService.getObservable().subscribe((notifi) => {

      let html = '';
      switch (notifi.messageType) {
        case NotificationType.Message:
          html = '<div class="container"><div class="row"><div class="col-3 left"><div class="success-icon"></div></div><div class="col-9 right"><div><div class="title">' + notifi.title + '</div><div class="description">' + notifi.message + '</div></div></div></div></div>';
          this.toastr.success(html, null, {enableHtml: true, timeOut: 1500});
          break;
        case NotificationType.Info:
          html = '<div class="container"><div class="row"><div class="col-3 left"><div class="info-icon"></div></div><div class="col-9 right"><div><div class="title">' + notifi.title + '</div><div class="description">' + notifi.message + '</div></div></div></div></div>';
          this.toastr.info(html, null, {enableHtml: true, timeOut: 2500});
          break;
        case NotificationType.Error:
          html = '<div class="container"><div class="row"><div class="col-3 left"><div class="error-icon"></div></div><div class="col-9 right"><div><div class="title">' + notifi.title + '</div><div class="description">' + notifi.message + '</div></div></div></div></div>';
          this.toastr.error(html, null, {enableHtml: true, timeOut: 2500});
          break;
        default:
      }
    });
  }

  ngOnDestroy() {
    this.notificationSubscription.unsubscribe();
  }

}

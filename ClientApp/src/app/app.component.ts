import { Component, OnInit } from '@angular/core';
import { NotificationType } from '@core/models/notification.model';
import { NotificationService } from '@shared/services';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    notificationSubscription: Subscription;
    /**
     * Constructor
     */
    constructor(private toastr: ToastrService, private notificationService: NotificationService,)
    {
    }

    ngOnInit(): void {
        this.notificationSubscription = this.notificationService.getObservable().subscribe((notifi) => {

            let html = '';
            switch (notifi.messageType) {
              case NotificationType.Message:
                html = '<div class="container"><div class="row"><div class="col-3 left"><div class="success-icon"></div></div><div class="col-9 right"><div><div class="title">' + notifi.title + '</div><div class="description">' + notifi.message + '</div></div></div></div></div>';
                this.toastr.success(html, null, {enableHtml: true, timeOut: 2000});
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
}

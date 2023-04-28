import {Injectable} from '@angular/core';
import { NotificationType, NotificationViewModel } from '@core/models/notification.model';
import {Subject} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class NotificationService {

  private subject = new Subject<NotificationViewModel>();

  constructor() {
  }

  public message(msg: string, title: string = 'Success!'): void {
    this.subject.next(new NotificationViewModel(title, msg, NotificationType.Message));
  }

  public error(msg: string, title: string = 'Error!'): void {
    this.subject.next(new NotificationViewModel(title, msg, NotificationType.Error));
  }

  public info(msg: string, title: string = 'Info!'): void {
    this.subject.next(new NotificationViewModel(title, msg, NotificationType.Info));
  }

  getObservable(): Subject<NotificationViewModel> {
    return this.subject;
  }
}

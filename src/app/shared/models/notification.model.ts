export class NotificationViewModel {
  public title: string;
  public message: string;
  public messageType: NotificationType;

  constructor(title: string, message: string, messageType: NotificationType) {
    this.title = title;
    this.message = message;
    this.messageType = messageType
  }
}

export enum NotificationType {
  Message,
  Info,
  Error
}

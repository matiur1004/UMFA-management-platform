import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UserNotificationsService {

    private _userNotifications: BehaviorSubject<any> = new BehaviorSubject([]);

    constructor(private http: HttpClient) { }

    get userNotifications$(): Observable<any> {
        return this._userNotifications.asObservable();
    }
}
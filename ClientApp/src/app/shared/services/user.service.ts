import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONFIG } from "app/core/helpers";
import { BehaviorSubject, lastValueFrom, Observable, of, throwError } from "rxjs";
import { catchError, delay, map, take, tap } from "rxjs/operators";
import { IAmrUser, IopUser, NotificationType, Role, UserNotification } from "../../core/models";
import { DXReportService } from "./dx-report-service";

@Injectable({ providedIn: 'root' })
export class UserService {

  private userSubject: BehaviorSubject<IopUser>;
  private _roles: BehaviorSubject<Role[]> = new BehaviorSubject([]);
  private _users: BehaviorSubject<IopUser[]> = new BehaviorSubject([]);
  private _scadaUsers: BehaviorSubject<[]> = new BehaviorSubject([]);
  private _notificationTypes: BehaviorSubject<NotificationType[]> = new BehaviorSubject([]);

  public user$: Observable<IopUser>;

  private decrSubject: BehaviorSubject<string>;
  public decr$: Observable<string>;

  constructor(
    private http: HttpClient,
    private _reportService: DXReportService
  ) {
    this.userSubject = new BehaviorSubject<IopUser>(null);
    this.user$ = this.userSubject.asObservable();
    this.decrSubject = new BehaviorSubject<string>(null);
    this.decr$ = this.decrSubject.asObservable();
  }

  public get decrValue(): string {
    return this.decrSubject.value;
  }

  public get userValue(): IopUser {
    return this.userSubject.value;
  }

  public get roles$(): Observable<Role[]> {
    return this._roles.asObservable();
  }

  public get users$(): Observable<IopUser[]> {
    return this._users.asObservable();
  }

  public get scadaUsers$(): Observable<[]> {
    return this._scadaUsers.asObservable();
  }
  
  public get notificationTypes$(): Observable<NotificationType[]> {
    return this._notificationTypes.asObservable();
  }

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${CONFIG.apiURL}${CONFIG.getUser}${id}`, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getUser', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map(u => {
          this.userSubject.next(u);
          this._reportService.loadPartners(u.UmfaId);
          this._reportService.loadBuildings(u.UmfaId);
          return u;
        }),
        take(1)
      )
  }

  getRoles(): Observable<Role[]> {
    const url = `${CONFIG.apiURL}/Roles/GetRoles`;
    return this.http.get<Role[]>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getRole', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map((u: Role[]) => {
          this._roles.next(u);
          return u;
        }),
        take(1)
      )
  }

  getAllUsers(): Observable<IopUser[]> {
    const url = `${CONFIG.apiURL}${CONFIG.getAllPortalUsers}`;
    return this.http.get<IopUser[]>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getAllPortalUsers', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map((u: IopUser[]) => {
          this._users.next(u);
          return u;
        }),
        take(1)
      )
  }

  getAllScadaUsers(): Observable<[]> {
    const url = `${CONFIG.apiURL}/AMRScadaUser/getAll`;
    console.log(url);
    return this.http.get<[]>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getAllScadaUsers', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map((u: []) => {
          this._scadaUsers.next(u);
          return u;
        }),
        take(1)
      )
  }
  getNotificationTypes(): Observable<NotificationType[]> {
    const url = `${CONFIG.apiURL}${CONFIG.getAllNotificationTypes}`;
    return this.http.get<NotificationType[]>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getAllNotificationTypes', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map((u: NotificationType[]) => {
          this._notificationTypes.next(u);
          return u;
        }),
        take(1)
      )
  }

  getAllUserNotificationsForUser(userId): Observable<UserNotification[]> {
    const url = `${CONFIG.apiURL}${CONFIG.getAllUserNotificationsForUser}/${userId}`;
    return this.http.get<UserNotification[]>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getAllUserNotificationsForUser', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map((u: UserNotification[]) => {
          return u;
        }),
        take(1)
      )
  }

  createOrUpdateUserNotifications(data): Observable<any> {
    const url = `${CONFIG.apiURL}${CONFIG.createOrUpdateUserNotifications}`;
    return this.http.post<any>(url, data, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('createOrUpdateUserNotifications', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map((u: any) => {
          return u;
        }),
        take(1)
      )
  }

  onUpdatePortalUserRole(data): Observable<any> {
    const url = `${CONFIG.apiURL}${CONFIG.updateUserRole}`;
    return this.http.post<any>(url, data, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('updatePortalUserRole', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map((u: any) => {
          return u;
        }),
        take(1)
      )
  }

  getAmrScadaUser(id: number): Observable<IAmrUser> {
    if (id === 0) {
      return of(this.initializeAmrUser());
    }
    const url = `${CONFIG.apiURL}${CONFIG.getAmrScadaUser}${id}`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getAmrScadaUser', err)),
        tap(u => {
          //console.log(`Http response from getAmrScadaUser: ${JSON.stringify(u)}`)
        })
      );
  }

  getScadaMetersForUser(scadaUserName: string, scadaUserPassword: string): Observable<any> {
    const url = `${CONFIG.apiURL}${CONFIG.getScadaMetersForUser}`;
    return this.http.post<any>(url, {scadaUserName, scadaUserPassword}, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getAmrScadaUser', err)),
        tap(u => {
          //console.log(`Http response from getAmrScadaUser: ${JSON.stringify(u)}`)
        }),
        map(pl => { return pl.xml.line })
      );
  }

  async decryptWrapper(value: string) {
    const url = `${CONFIG.apiURL}${CONFIG.decryptString}${encodeURIComponent(value)}`;
    const ret = await lastValueFrom(this.http.get(url, { responseType: 'text', withCredentials: true }));
    return ret;
  }

  async encryptWrapper(value: string) {
    const url = `${CONFIG.apiURL}${CONFIG.encryptString}${encodeURI(value)}`;
    const ret = await lastValueFrom(this.http.get(url, { responseType: 'text', withCredentials: true }));
    return ret;
  }

  changePwd(amrUser: IAmrUser): Observable<IAmrUser> {
    const url = `${CONFIG.apiURL}${CONFIG.changePwdString}`;
    return this.http.put<IAmrUser>(url, amrUser, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('changePwd', err)),
        tap(() => {
          //console.log(`Changed pwd for user: '${amrUser.Id}'`)
        }),
        // Return the product on an update
        map(() => amrUser)
      );
  }

  private initializeAmrUser(): IAmrUser {
    // Return an initialized object
    return {
      Id: 0,
      ProfileName: "",
      ScadaUserName: "",
      ScadaPassword: "",
      SgdUrl: "",
      Active: true
    };
  }

  updateAmrScadaUser(id: number, user: IAmrUser): Observable<IAmrUser> {
    const url = `${CONFIG.apiURL}${CONFIG.editAmrScadaUser}${id}`;
    return this.http.post<any>(url, user, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('updateAmrScadaUser', err)),
        //tap(data => {
        //  //console.log('createAmrScadaUser response: ' + JSON.stringify(data))
        //}),
        tap(data => this.getUser(id))
      );
  }

  deleteAmrScadaUser(id: number, user: IAmrUser): Observable<IAmrUser> {
    const url = `${CONFIG.apiURL}${CONFIG.editAmrScadaUser}${id}`;
    if (user.Active) user.Active = false;
    return this.http.post<any>(url, user, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('deleteAmrScadaUser', err)),
        //tap(data => console.log('createAmrScadaUser response: ' + JSON.stringify(data))),
        tap(data => this.getUser(id))
      );
  }

  getAppVersion(): Observable<any> {
    const url = `${CONFIG.apiURL}/home/getAppVersion`;
    return this.http.get<any>(url, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('app version', err)),
        //tap(data => console.log('createAmrScadaUser response: ' + JSON.stringify(data))),
        tap(data => {})
      );
  }
  /*
  updateProduct(product: Product): Observable<Product> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${this.productsUrl}/${product.id}`;
    return this.http.put<Product>(url, product, { headers })
      .pipe(
        tap(() => console.log('updateProduct: ' + product.id)),
        // Return the product on an update
        map(() => product),
        catchError(this.handleError)
      );
  }
   */

  //catches errors
  private catchErrors(obj: string, error: { error: { message: any; }; message: any; }): Observable<Response> {
    if (error && error.error && error.error.message) { //clientside error
      console.log(`Error from ${obj} Client side error: ${error.error.message}`);
    } else if (error && error.message) { //server side error
      console.log(`Error from ${obj} Server side error: ${error.message}`);
    } else {
      console.log(`Error from ${obj} Error occurred: ${JSON.stringify(error)}`);
    }
    return throwError(error);
  }

}

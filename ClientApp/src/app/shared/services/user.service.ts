import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CONFIG } from "app/core/helpers";
import { BehaviorSubject, lastValueFrom, Observable, of, throwError } from "rxjs";
import { catchError, delay, map, take, tap } from "rxjs/operators";
import { IAmrUser, IopUser } from "../../core/models";

@Injectable({ providedIn: 'root' })
export class UserService {

  private userSubject: BehaviorSubject<IopUser>;
  public user$: Observable<IopUser>;

  private decrSubject: BehaviorSubject<string>;
  public decr$: Observable<string>;

  constructor(private http: HttpClient) {
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

  getUser(id: number): Observable<any> {
    return this.http.get<any>(`${CONFIG.apiURL}${CONFIG.getUser}${id}`, { withCredentials: true })
      .pipe(
        catchError(err => this.catchErrors('getUser', err)),
        //tap(u => console.log(`Http response from getUser: ${JSON.stringify(u)}`)),
        map(u => {
          this.userSubject.next(u);
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

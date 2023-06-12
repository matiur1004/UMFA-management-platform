/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { CONFIG } from 'app/core/helpers';
import { IUser } from '../models';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    private userSubject: BehaviorSubject<IUser>;
    
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
        this.userSubject = new BehaviorSubject<IUser>(null);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }
    
    public get userValue(): IUser {
        return this.userSubject.value;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post<any>(`${CONFIG.apiURL}${CONFIG.authPath}`, { username: credentials.email, password: credentials.password }, { withCredentials: true })
        .pipe(
            //tap(u => console.log(`Http response from login: ${JSON.stringify(u)}`)),
            catchError(err => this.catchAuthErrors('login', err)),
            map((response) => {
                this.accessToken = response.JwtToken;
                this._authenticated = true;
                this._userService.user = {email: response['UserName'], name: `${response['FirstName']} ${response['LastName']}`, id: response['Id']};
                localStorage.setItem('user', JSON.stringify(response));
                this.userSubject.next(response);
                this.startRefreshTokenTimer();
                return response;
            })
        );
    }

    refreshToken() {
        return this._httpClient.post<any>(`${CONFIG.apiURL}${CONFIG.refreshPath}`, {}, { withCredentials: true })
          .pipe(
            catchError(err => {
              console.log("Error while authenticating");
              return throwError(err);
              //this.catchAuthErrors('refreshToken', err);
            }),
            tap(u => {
              //console.log(`Http response from refreshToken: ${JSON.stringify(u)}`)
            }),
            map(user => {
              //console.log(`refreshtoken: ${user}`);
              this.accessToken = user.JwtToken;
              this.userSubject.next(user);
              localStorage.setItem('user', JSON.stringify(user));
              this.startRefreshTokenTimer();
              return user;
            }));
      }

    
    //section for helper methods

    private refreshTokenTimeOut: any;

    private startRefreshTokenTimer() {
        //get the token time out by parsing the json object from base64 (atob)
        const jwtToken = JSON.parse(atob(this.userValue.JwtToken.split('.')[1]));

        //set a refreshtime 1 minute before token expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        this.refreshTokenTimeOut = setTimeout(() => this.refreshToken().subscribe(), timeout);
    }
    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if ( response.accessToken )
                {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    //catches auth errors
    catchAuthErrors(obj: string, error: { error: { Message: any; }; Message: any; }): Observable<Response> {
        if (error && error.error && error.error.Message) { //clientside error
            console.log(`Error from ${obj}: Client side error: ${error.error.Message}`);
            return throwError(error);
        } else if (error && error.Message) { //server side error
            console.log(`Error from ${obj}: Server side error: ${error.Message}`);
            return throwError(error);
        } else if (error) { //server side error
            console.log(`Error from ${obj}: Server side error: ${error}`);
            return throwError(error);
        } else {
            console.log(`Error from ${obj}: Error occurred: ${JSON.stringify(HttpErrorResponse.toString())}`);
            return throwError('Error from {obj}: User can not be validated, check username and password');
        }
    }
}

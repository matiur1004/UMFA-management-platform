import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable, Injector} from '@angular/core';
import {Router} from '@angular/router';

import {NewFileViewModel, ResponseModel, UploadResponseViewModel} from '@models';
import * as FileSaver from 'file-saver';
import {Observable, Subject} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import {NotificationService} from './notification.service';
import {ProgressSpinnerService} from './progress-spinner.service';

@Injectable({
  providedIn: 'root'
})
export class HttpHelperService {

  router: Router;
  private reciveErrorSubject = new Subject<number>();

  constructor(private http: HttpClient, private notificationService: NotificationService,
              private progressSpinner: ProgressSpinnerService, private authService: AuthService, private inject: Injector) {
    this.router = inject.get(Router);
  }

  public jsonGet<T>(url, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.jsonHeaders();
    return this.request<T>(HtttpMethodType.get, url, headers, null, params, shouldDisplayProgresse);
  }

  public jsonPost<T>(url: string, data: any, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.jsonHeaders();
    return this.request(HtttpMethodType.post, url, headers, data, params, shouldDisplayProgresse);
  }

  public authJsonGet<T>(url: string, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.authJsonHeaders();
    return this.request<T>(HtttpMethodType.get, url, headers, null, params, shouldDisplayProgresse);
  }

  public authJsonGetWithData<T>(url: string, data: any, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.authJsonHeaders();
    return this.request<T>(HtttpMethodType.get, url, headers, data, params, shouldDisplayProgresse);
  }

  public authJsonPost<T>(url: string, data: any, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.authJsonHeaders();
    return this.request(HtttpMethodType.post, url, headers, data, params, shouldDisplayProgresse);
  }

  public authJsonPut<T>(url: string, data: any, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.authJsonHeaders();
    return this.request<T>(HtttpMethodType.put, url, headers, data, params, shouldDisplayProgresse);
  }

  public authJsonPatch<T>(url: string, data: any, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.authJsonHeaders();
    return this.request<T>(HtttpMethodType.patch, url, headers, data, params, shouldDisplayProgresse);
  }

  public authJsonDelete<T>(url: string, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.authJsonHeaders();
    return this.request<T>(HtttpMethodType.delete, url, headers, null, params, shouldDisplayProgresse);
  }

  public authMultipartFormDataPost<T>(url: string, data: any, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.authMultipartFormData();
    const formData: FormData = new FormData();
    this.objectToFormData(data, formData, null);
    return this.request<T>(HtttpMethodType.post, url, headers, formData, params, shouldDisplayProgresse);
  }

  public authMultipartFormDataPut<T>(url: string, data: any, params: HttpParams = null, shouldDisplayProgresse: boolean = true): Observable<T> {
    const headers = this.authService.authMultipartFormData();
    const formData: FormData = new FormData();
    this.objectToFormData(data, formData, null);
    return this.request<T>(HtttpMethodType.put, url, headers, formData, params, shouldDisplayProgresse);
  }

  public authMultipartFormDataPatch<T>(url: string, data: any, params: HttpParams = null, shouldDisplayProgress: boolean = true): Observable<T> {
    const headers = this.authService.authMultipartFormData();
    const formData: FormData = new FormData();
    this.objectToFormData(data, formData, null);
    return this.request<T>(HtttpMethodType.patch, url, headers, formData, params, shouldDisplayProgress);
  }

  public authDownloadFile(url: string, data: any, fileName: string, params: HttpParams = null, shouldDisplayProgresse: boolean = true): void {
    const headers = this.authService.authJsonHeaders();

    this.http.request(HtttpMethodType.post, url, {
      headers: headers,
      body: data,
      params: params,
      responseType: 'blob'
    }).subscribe((res: any) => {
      this.saveFile(res, fileName);
    });
  }

  public getReciveErrorSubject(): Observable<any> {
    return this.reciveErrorSubject.asObservable();
  }

  public authUploadFileAsync(url: string, data: NewFileViewModel, params: HttpParams = null, shouldDisplayProgresse: boolean = true) {

    const formData: FormData = new FormData();
    this.objectToFormData(data, formData, null);

    const headers = this.authService.authMultipartFormData();

    if (shouldDisplayProgresse) {
      this.progressSpinner.displayProgressBar();
    }

    const promise = this.http.request<HttpEvent<ResponseModel<string>>>(HtttpMethodType.post, url, {
      headers: headers, body: formData,
      params: params,
      reportProgress: true, observe: 'events'
    }).pipe(finalize(() => {
        if (shouldDisplayProgresse) {
          this.progressSpinner.hideProgressBar();
        }
      }),
      map((event: HttpEvent<any>) => {
        const response = new UploadResponseViewModel();
        switch (event.type) {
          case HttpEventType.Sent:
            response.progressDone = 1;
            return response;

          case HttpEventType.UploadProgress:
            const percentDone = Math.round(100 * event.loaded / event.total);
            response.progressDone = percentDone;
            return response;

          case HttpEventType.Response:
            this.displayMessage(event.body.message);
            response.data = event.body.data;
            response.isCompleted = true;
            return response;

          default:
            console.log(event.type, event);
            return null;
        }
      }),
      catchError(error => this.handleError(error))
    );

    return promise;
  }

  protected saveFile = (blobContent: Blob, fileName: string) => {
    const blob = new Blob([blobContent], {type: 'application/octet-stream'});
    FileSaver.saveAs(blob, fileName);
  }

  protected request<T>(httpMethod: string, url: string, headers: HttpHeaders, data: any, params: HttpParams, shouldDisplayProgresse: boolean): Observable<T> {

    if (shouldDisplayProgresse) {
      this.progressSpinner.displayProgressBar();
    }

    const promise = this.http.request<ResponseModel<T>>(httpMethod, url, {
      headers: headers,
      body: data,
      params: params
    }).pipe(finalize(() => {
        if (shouldDisplayProgresse) {
          this.progressSpinner.hideProgressBar();
        }
      }),
      map(resp => {
        this.displayMessage(resp.message);
        return resp.data;
      }),
      catchError(error => this.handleError(error)));

    return promise;
  }

  protected displayMessage(message: string) {
    if (message) {
      this.notificationService.message(message);
    }
  }

  protected handleError(response: Response | any) {
    let errMsg: string;

    this.reciveErrorSubject.next(response.status);

    if (response.status === 401) {
      this.authService.reset();
      this.router.navigate(['/login']);

      return Promise.reject({status: 401, statusText: 'Unauthorized'});
    }

    if (response.status === 403) {
      this.notificationService.info('You do not have permission', 'Forbidden access');
      this.router.navigate(['/']);
      return Promise.reject({status: 403, statusText: 'Forbidden access'});
    }

    if (response.status === 404) {
      this.notificationService.error('Page Not Found');
      this.router.navigate(['/page404']);
      return Promise.reject({status: 404, statusText: 'Page Not Found'});
    }

    if (response.status === 409) {
      this.notificationService.info(response.error ? response.error.message : 'Something conflicts', 'Conflict');
      return Promise.reject({status: 409, statusText: 'Conflict'});
    }

    if (response.status === 500) {
      this.notificationService.error('Something went wrong', 'Internal server error');
      return Promise.reject({status: 500, statusText: 'Internal server error'});
    }

    if (response._body) {
      errMsg = response._body;
      const errorMessages: any = JSON.parse(errMsg);
      if (errorMessages instanceof Array) {
        errorMessages.forEach(function (errorMessage) {
          this.notificationService.error(errorMessage);
        }, this);
      } else {
        this.notificationService.error(errMsg);
      }

    } else {
      errMsg = response.message ? response.message : response.toString();

      if (response.error instanceof Array) {
        response.error.slice(0, 5).forEach(function (errorMessage) {
          this.notificationService.error(errorMessage);
        }, this);

      } else {
        this.notificationService.error(response.error);
      }
    }

    return Promise.reject(errMsg);
  }

  protected objectToFormData(object: Object, form?: FormData, namespace?: string) {
    const formData = form || new FormData();
    for (const property in object) {
      if (!object.hasOwnProperty(property) || (!object[property] && object[property] !== 0) || property.startsWith('_', 0)) {
        continue;
      }
      const formKey = namespace ? `${namespace}[${property}]` : property;
      if (object[property] instanceof Date) {
        const dateWithoutLocalTime: Date =
          new Date(Date.UTC(object[property].getFullYear(), object[property].getMonth(), object[property].getDate()));
        formData.append(formKey, dateWithoutLocalTime.toUTCString());
      } else if (typeof object[property] === 'object' && !(object[property] instanceof File)) {
        this.objectToFormData(object[property], formData, formKey);
      } else {
        if (object instanceof Array && object[property] instanceof File) {
          formData.append(namespace, object[property]);
        } else {
          formData.append(formKey, object[property]);
        }
      }
    }

    return formData;
  }
}

const HtttpMethodType = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE'
};

import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { LocalStorageService } from '@app/shared/services/local-storage.service';
import {NgModel} from '@angular/forms';

@Directive({
  selector: '[ngModel][storeField]',
  providers: [NgModel]
})

export class StoreFieldDirective implements OnInit {
  @Input() ngModel;
  @Input('storeField') lastActiveRouteSegment: string;
  private inputAttrName: string;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private el: ElementRef,
    private model: NgModel
  ) {
  }

  get getStoreKey(): any {
    const url = this.getActiveRouteUrl;
    return this.localStorage.get(url);
  }

  get getStoreData() {
    return this.getStoreKey ? JSON.parse(this.getStoreKey) : {};
  }

  get getActiveRouteUrl(): string {
    const searchStrUrl = this.router.url.indexOf(this.lastActiveRouteSegment);
    return this.router.url.slice(0, searchStrUrl);
  }

  @HostListener('ngModelChange', ['$event'])
  onInputChange(value: any) {
    this.updateModel(value);
  }

  ngOnInit() {
    this.inputAttrName = this.el.nativeElement.attributes['name']?.value || '';
    const data = this.getStoreData;
    const url = this.getActiveRouteUrl;

    if (!this.checkIfFieldExist(data)) {
      data[this.inputAttrName] = this.ngModel;
    }

    setTimeout(() => {
      // Set Value to model
      this.model.viewToModelUpdate(data[this.inputAttrName]);
      this.model.valueAccessor.writeValue(data[this.inputAttrName]);
    }, 0);

    this.localStorage.set(url, JSON.stringify(data));
  }

  checkIfFieldExist(store) {
    return store.hasOwnProperty(this.inputAttrName);
  }

  isIssetStorageInRoute(url: string) {
    return this.localStorage.get(url);
  }

  private updateModel(value: any) {
    // Set Value to model
    this.model.viewToModelUpdate(value);
    this.model.valueAccessor.writeValue(value);
    const data = this.getStoreData;
    data[this.inputAttrName] = value;

    this.localStorage.set(this.getActiveRouteUrl, JSON.stringify(data));
  }
}

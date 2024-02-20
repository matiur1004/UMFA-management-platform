import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';
import {ReadingsValidationViewModel} from '../shared/models';
import { LocalStorageService } from '@app/shared/services/local-storage.service';

@Directive({
  selector: '[enterReadingPopup]'
})
export class EnterReadingPopupDirective implements OnChanges, AfterViewInit {

  @Input()
  readingsForDate: ReadingsValidationViewModel[];

  @Input()
  meterId: string;

  @Input()
  registerId: string;

  @Input()
  inputVal: string;

  private previousValue: any = '';
  constructor(private el: ElementRef, private renderer: Renderer2, private _localStorageService: LocalStorageService) {

  }

  ngAfterViewInit(): void {
    this.disableInputs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.inputVal) {
      this.previousValue = this._localStorageService.get(`register_${this.registerId}`);
      if(this.previousValue != changes.inputVal.currentValue) {
        this.el.nativeElement.focus();
      }
      this._localStorageService.set(`register_${this.registerId}`, changes.inputVal.currentValue)
    }
    this.disableInputs();
  }

  private disableInputs(): void {
    if (!this.readingsForDate || !this.readingsForDate.map(r => r.meterId).includes(this.meterId)) {
      this.el.nativeElement.disabled = false;
      return;
    }
    const registersIds = this.readingsForDate.find(r => r.meterId === this.meterId).registersIds;

    if (registersIds.includes(this.registerId)) {
      this.el.nativeElement.disabled = true;
    } else {
      this.el.nativeElement.disabled = false;
    }
  }
}

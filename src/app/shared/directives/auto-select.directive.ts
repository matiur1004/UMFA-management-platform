import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[autoSelect]'
})
export class AutoSelectDirective {

  @Input() autoSelect = true;

  constructor(private el: ElementRef) {
  }

  @HostListener('focus', ['$event'])
  public onFocus($event) {
    if (this.autoSelect) {
      this.el.nativeElement.select();
    }
  }
}

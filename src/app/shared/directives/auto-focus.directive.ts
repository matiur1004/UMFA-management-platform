import {AfterContentInit, Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[autoFocus]'
})
export class AutoFocusDirective implements AfterContentInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 500);
  }
}

import {Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[showPassword]'
})
export class ShowPasswordDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    this.renderer.listen(this.el.nativeElement, 'click', this.onClick.bind(this));
  }

  onClick(ev: MouseEvent) {
    const inputNode = this.el.nativeElement.previousSibling;
    const inputType = inputNode.getAttribute('type');
    const newType = inputType === 'password' ? 'text' : 'password';
    this.renderer.setAttribute(inputNode, 'type', newType);
    ev.stopPropagation();
    ev.preventDefault();
  }
}

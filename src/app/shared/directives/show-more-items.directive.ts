import {Directive, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[showMoreItems]'
})
export class ShowMoreItemsDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.getListContainer().querySelectorAll('.ng-option .marked-as-hidden').forEach((el: any) => {
      this.renderer.addClass(el.parentElement, 'item-hidden');
    });
  }

  @HostListener('click', ['$event'])
  public onClick() {
    this.renderer.addClass(this.getListContainer(), 'show-hidden-items');
  }

  getListContainer() {
    const parentEl = this.el.nativeElement.parentElement.parentElement.parentElement;
    return parentEl;
  }

}

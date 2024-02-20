import {Directive, ElementRef, forwardRef, Inject, OnDestroy} from '@angular/core';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';
import {Subscription} from 'rxjs';
import {positionElements} from '../helper/positioning';

@Directive({
  selector: '[ngbDropdown][appDropdownAppendToBody]'
})
export class DropdownAppendToBodyDirective implements OnDestroy {

  private onChangeSubscription: Subscription;
  private ignoreClasses: string[] = ['dropdown', 'show'];

  constructor(
    @Inject(forwardRef(() => NgbDropdown)) private dropdown: NgbDropdown,
    private el: ElementRef
  ) {

    this.onChangeSubscription = this.dropdown.openChange.subscribe((open: boolean) => {
      this.dropdown['_menu'].position = (triggerEl: HTMLElement, placement: string) => {
        if (!this.isInBody()) {
          this.appendMenuToBody();
        }
        positionElements(triggerEl, this.dropdown['_menu']['_elementRef'].nativeElement, placement, true);
      };

      if (open) {
        if (!this.isInBody()) {
          this.appendMenuToBody();
        }
      } else {
        setTimeout(() => this.removeMenuFromBody());
      }
    });
  }

  ngOnDestroy() {
    this.removeMenuFromBody();
    if (this.onChangeSubscription) {
      this.onChangeSubscription.unsubscribe();
    }
  }

  private isInBody() {
    return this.dropdown['_menu']['_elementRef'].nativeElement.parentNode.parentNode === document.body;
  }

  private removeMenuFromBody() {
    if (this.isInBody()) {
      window.document.body.removeChild(this.dropdown['_menu']['_elementRef'].nativeElement.parentElement);
    }
  }

  private appendMenuToBody() {
    const menuWrapper = window.document.createElement('div');
    let classNames = this.el.nativeElement.className;
    this.ignoreClasses.forEach(item => classNames = classNames.replace(item, ''));
    menuWrapper.className = classNames;
    menuWrapper.appendChild(this.dropdown['_menu']['_elementRef'].nativeElement);
    window.document.body.appendChild(menuWrapper);
  }
}

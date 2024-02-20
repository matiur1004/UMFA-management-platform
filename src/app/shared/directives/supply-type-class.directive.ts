import {Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges} from '@angular/core';
import {SupplyType, SupplyTypeClassNames} from '@models';

@Directive({
  selector: '[supplyTypeClass]'
})

export class SupplyTypeClassDirective implements OnChanges {

  @Input('supplyTypeClass') supplyType: SupplyType;
  @Input('supplyTypeClassSufix') sufix: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnChanges(changes: SimpleChanges) {
    let classes = this.getClasses(changes.sufix ? changes.sufix.previousValue : this.sufix);

    classes.forEach(k => this.renderer.removeClass(this.el.nativeElement, k.label));

    if (changes.sufix)
      classes = this.getClasses(this.sufix);

    classes.filter(k => k.value === this.supplyType).forEach(k => this.renderer.addClass(this.el.nativeElement, k.label));
  }

  private getClasses(sufix: string) {
    let sufixStr = sufix || '';

    return SupplyTypeClassNames.map(s => ({label: s.label + sufixStr, value: s.value}));
  }

}

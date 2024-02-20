import {
  Attribute,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberInputComponent),
      multi: true
    }
  ]
})
export class NumberInputComponent implements ControlValueAccessor {

  @Input() placeholder = 'Type here';
  @Input() min: number;
  @Input() max: number;
  @Input() step = 1;
  @Input() integerValue = false;
  @Input() styleClass: string;
  @Input() suffixLabel = '';
  @Input() isReadonly = false;
  @Output() change = new EventEmitter<number>();
  @Output() onBlur = new EventEmitter<number>();
  @Output() input = new EventEmitter<number>();

  @ViewChild('dnmNumberInput', {static: true}) _elementRef: ElementRef;

  isDisabled = false;

  constructor(
    @Attribute('input-class') public classes: string,
    private _renderer: Renderer2
  ) {
  }

  onSetActiveInput(): void {
    this._elementRef.nativeElement.focus();
  }

  onChange = (v) => {
    this.change.emit(v);
  };

  onTouched = (v: any) => {
    this.onBlur.emit(v);
    this.change.emit(v);
  };

  writeValue(value: number): void {
    const normalizedValue = value == null ? 0 : value;
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', normalizedValue);
  }

  registerOnChange(fn: (_: number | null) => void): void {
    this.onChange = (value) => {
      value = value * 1;
      if (this.integerValue) {
        value = parseInt(value);
      }
      this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
      const val = this.onChangeVal(value);
      fn(val);
      this.change.emit(val);
    };
  }

  registerOnTouched(fn: (_: number | null) => void): void {
    this.onTouched = (value) => {
      const val = this.onChangeVal(value);
      fn(val);
      this.change.emit(val);
    };
  }

  setDisabledState(isDisabled: boolean): void {
    (isDisabled) ? this.isDisabled = true : this.isDisabled = false;
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }

  onInput(event) {
    this.input.emit(event);
  }

  onIncreaseVal() {
    if (!this.isDisabled) {
      this.onSetActiveInput();
      let val = +this._elementRef.nativeElement.value;
      val = val + this.step;
      this.writeValue(+val.toFixed(5));
      this.onChange(+val.toFixed(5));
    }
  }

  onDecreaseVal() {
    if (!this.isDisabled) {
      this.onSetActiveInput();
      let val = +this._elementRef.nativeElement.value;
      val = val - this.step;
      this.writeValue(+val.toFixed(5));
      this.onChange(+val.toFixed(5));
    }
  }

  private onChangeVal(value: number) {
    if (isNaN(value)) {
      value = 0;
      this.writeValue(value);
    }
    value = value * 1;
    if (this.integerValue) {
      value = parseInt(<any>value);
    }
    if (value <= this.min) {
      value = this.min;
      this.writeValue(value);
    }
    if (value >= this.max) {
      value = this.max;
      this.writeValue(value);
    }
    return value;
  }

}

import {Attribute, Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.less'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextInputComponent),
    multi: true
  }]
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() autoSelect = false;
  @Input() model: string;
  @Input() placeholder: string = 'Type here';
  @Input() type: string = 'text';
  @Input() isRequired: boolean = false;
  @Output() modelChange = new EventEmitter<String>();
  @Output() onFocusOut = new EventEmitter<Event>();

  @Input() disabled = false;
  modelSnapshot: string;

  constructor(@Attribute('input-class') public classes: string) {
   
  }

  ngOnInit() {
    if (this.isRequired) {
      this.classes += " req-frm-hover";
    }
  }

  onChange = (value: string) => {
  };

  onTouched = () => {
  };

  onModelChange($event: string) {
    this.modelChange.emit($event);
    this.onChange($event);
  }

  focusin($event: Event) {
    this.modelSnapshot = this.model;
  }

  focusout($event: Event) {
    if (this.model !== this.modelSnapshot) {
      this.onFocusOut.emit($event);
    }
  }

  writeValue(value: string): void {
    this.model = value;
    this.modelChange.emit(value);
    this.onChange(this.model);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

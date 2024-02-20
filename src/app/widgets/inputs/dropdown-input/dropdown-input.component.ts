import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'dropdown-input',
  templateUrl: './dropdown-input.component.html',
  styleUrls: ['./dropdown-input.component.less'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownInputComponent),
    multi: true
  }]
})
export class DropdownInputComponent implements ControlValueAccessor {

  @Input() values: string[];
  @Input() model: string;
  @Input() text: any;
  @Output() modelChange = new EventEmitter<String>();
  @Output() onFocusOut = new EventEmitter<Event>();

  @Input() disabled = false;

  constructor() {
  }

  onChange = (value: string) => {
  };

  onTouched = () => {
  };

  ngOnInit() {
  }

  setModel(event: Event, value: string) {
    this.model = value;
    this.modelChange.emit(value);
    this.onFocusOut.emit(event);
    this.onChange(this.model);
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

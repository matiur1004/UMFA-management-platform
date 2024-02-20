import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'dropdown-enum-input',
  templateUrl: './dropdown-enum-input.component.html',
  styleUrls: ['./dropdown-enum-input.component.less'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownEnumInputComponent),
    multi: true
  }]
})
export class DropdownEnumInputComponent implements ControlValueAccessor {

  @Input() values: any;

  @Input() model: string;
  @Output() modelChange = new EventEmitter<any>();
  @Output() onFocusOut = new EventEmitter<Event>();

  @Input() disabled = false;
  keys: Array<any>;
  selectedKey: any;

  constructor() {
  }

  onChange = (value: any) => {
  };

  onTouched = () => {
  };

  ngOnInit() {
  }

  setModel(event: Event, item: any) {
    let elem = this.keys.find(k => k.key == item.key);
    this.model = elem.value;
    this.modelChange.emit(item.key);
    this.onFocusOut.emit(event);
    this.onChange(item.key);
  }


  writeValue(value: any): void {
    this.keys = [];
    for (var enumMember in this.values) {
      if (!isNaN(parseInt(enumMember, 10))) {
        this.keys.push({key: enumMember, value: this.values[enumMember]});
      }
    }
    let selectedKey = this.keys.find(k => k.key === value);
    this.model = selectedKey.value;

    this.modelChange.emit(value);
    this.onChange(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}

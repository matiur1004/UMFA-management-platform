import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'package-colors',
  templateUrl: './package-colors.component.html',
  styleUrls: ['./package-colors.component.less']
})
export class PackageColorsComponent implements OnInit {

  @Input() currentColor: string;


  @Output() changeColor = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onChange(color) {
    this.currentColor = color;
    this.changeColor.emit(color);
    this.onClose();
  }

  onClose() {
    this.close.emit();
  }
}

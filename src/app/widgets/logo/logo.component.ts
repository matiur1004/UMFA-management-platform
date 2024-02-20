import {
  Attribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'logo-container',
  templateUrl: './logo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./logo.component.less']
})
export class LogoComponent implements OnInit, OnChanges {

  @Output()
  public loadImageFailed = new EventEmitter<any>();

  @Input()
  public url: string;

  @Input() file: File;
  showDefault: boolean = false;

  constructor(@Attribute('logo-class') public classes: string) {
  }

  ngOnInit() {
    if (this.file) {
      var fr = new FileReader();
      fr.onload = (data) => {
        this.url = fr.result as string;
      };
      fr.readAsDataURL(this.file);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.showDefault = false;
  }

  onError(event) {
    this.showDefault = true;

    this.loadImageFailed.emit('');
  }

}

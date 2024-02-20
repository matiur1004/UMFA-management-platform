import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AuthService} from '@services';
import {OptionViewModel} from '@app/shared/models/option-view.model';

@Component({
  selector: 'note-popup',
  templateUrl: './note-popup.component.html',
  styleUrls: ['./note-popup.component.less']
})
export class NotePopupComponent implements OnChanges {
  public currentComment = '';
  public newComment = '';
  public currentUser = '';
  public newUser = '';
  @Input() noteDate;
  @Input() editableNote = false;
  @Input() reasonId = '';
  @Input() anchorSide = 'left';
  @Input() attachFile = false;
  @Input() fileUrl = '';
  @Input() file: File = null;
  @Input() hideCloseButton = false;
  @Input() reasons: OptionViewModel[] = new Array<OptionViewModel>();
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() close = new EventEmitter();
  public isEditState = true;
  public uploadedFile = '';
  private _maxContentLength = 500;

  constructor(private authService: AuthService) {
  }

  private _maxTextLength;

  get maxTextLength(): number {
    return this._maxTextLength;
  }

  @Input()
  set maxTextLength(value: number) {
    this._maxTextLength = value || this._maxContentLength;
  }

  @Input() set userData(value: string) {
    this.currentUser = value;
    if (!value) {
      value = this.authService.getFullName();
    }
    this.newUser = value;
  }

  @Input() set comment(commentValue) {
    let commentVal = '';
    if (typeof (commentValue) === 'string') {
      commentVal = commentValue;
    } else {
      commentVal = (commentValue && commentValue.value && commentValue.value.currentReadingNotes)
        ? commentValue.value.currentReadingNotes : commentVal;
    }
    this.currentComment = commentVal;
    this.newComment = commentVal;
    if (commentVal.length) {
      this.isEditState = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['comment']) {
      this.comment = changes['comment'].currentValue;
    }
  }

  onFileSelected(event: Event) {
    if (event.target['files'].length) {
      this.file = event.target['files'][0];
    }
  }

  onDeleteFile() {
    this.file = null;
    this.uploadedFile = null;
  }

  onDownloadLocalFile(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    const element = document.createElement('a');
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      element.setAttribute('href', reader.result + '');
      element.setAttribute('download', this.file.name);
      element.click();
    };
  }

  onEditNote(ev) {
    this.isEditState = true;
    this.newUser = this.authService.getFullName();
    ev.stopPropagation();
    ev.preventDefault();
  }

  onClose(ev) {
    this.close.emit();
  }

  onEdit(ev) {
    const editResult = {
      currentReadingNotes: this.newComment,
      currentReadingCreatedByUserName: this.newUser
    };

    if (this.attachFile) {
      editResult['file'] = this.file;
    }

    this.edit.emit(editResult);
    this.isEditState = !this.newComment.length;

    this.onClose(ev);
  }

  onCancel(ev) {
    this.isEditState = false;
    this.newComment = this.currentComment;
    this.file = null;
    this.close.emit();
  }
}

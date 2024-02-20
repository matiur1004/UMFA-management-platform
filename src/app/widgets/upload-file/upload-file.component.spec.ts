import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';

import {UploadFileComponent} from './upload-file.component';

declare var $: any;

describe('UploadFileComponent', () => {
  let component: UploadFileComponent;
  let fixture: ComponentFixture<UploadFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [UploadFileComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call onDragover function', () => {
    component.onDragover(new Event('dragover'));
    expect($(component.uploadForm.nativeElement).hasClass('file-drag')).toBeTruthy();
  });

  it('call onDragend function', () => {
    component.onDragend(new Event('dragend'));
    expect($(component.uploadForm.nativeElement).hasClass('file-drag')).toBeFalsy();
  });

  it('call onDragenter function', () => {
    component.onDragenter(new Event('dragenter'));
    expect($(component.uploadForm.nativeElement).hasClass('file-drag')).toBeTruthy();
  });

  it('call onDragleave function', () => {
    component.onDragleave(new Event('dragleave'));
    expect($(component.uploadForm.nativeElement).hasClass('file-drag')).toBeFalsy();
  });

  it('call onDrop function on disabled panel', () => {
    $(component.fileInput.nativeElement).attr('disabled', true);
    component.onDrop({
      preventDefault: () => {
      },
      stopPropagation: () => {
      },
      originalEvent: {
        dataTransfer: {
          files: [{
            name: 'file.txt'
          }]
        }
      }
    });
    expect($(component.uploadForm.nativeElement).hasClass('file-drag')).toBeFalsy();
  });

  it('call onDrop function without  files', () => {
    component.onDrop({
      preventDefault: () => {
      },
      stopPropagation: () => {
      },
      originalEvent: {
        dataTransfer: {
          files: []
        }
      }
    });
    expect($(component.uploadForm.nativeElement).hasClass('file-drag')).toBeFalsy();
  });

  it('call onDrop function with invalid extend of file', () => {
    component.fileExtend = 'yaml';
    component.onDrop({
      preventDefault: () => {
      },
      stopPropagation: () => {
      },
      originalEvent: {
        dataTransfer: {
          files: [{
            name: 'file.txt'
          }]
        }
      }
    });
    expect($(component.uploadForm.nativeElement).hasClass('file-drag')).toBeFalsy();
  });

  it('call onDrop function with valid extend of file', () => {
    component.fileExtend = 'yaml';

    component.selectedFile.subscribe(res => {
      expect(res).toEqual({
        name: 'file1.yaml'
      });
    });
    component.onDrop({
      preventDefault: () => {
      },
      stopPropagation: () => {
      },
      originalEvent: {
        dataTransfer: {
          files: [{
            name: 'file1.yaml'
          }]
        }
      }
    });
  });

  it('call onDrop function with many files', () => {
    component.multyFiles = true;
    component.fileExtend = 'yaml';

    component.selectedFile.subscribe(res => {
      expect(res).toEqual([{
        name: 'file1.yaml'
      }, {
        name: 'file2.yaml'
      }]);
    });

    component.onDrop({
      preventDefault: () => {
      },
      stopPropagation: () => {
      },
      originalEvent: {
        dataTransfer: {
          files: [{
            name: 'file1.yaml'
          }, {
            name: 'file2.yaml'
          }]
        }
      }
    });

  });

  it('call onClickSelectFile function', () => {
    component.onClickSelectFile();
    expect(component).toBeTruthy();
  });

  it('call onChange function with invalid data', () => {
    component.onChange({target: {files: null}});
    expect(component.selectedFileName).toBe('');
  });

  it('call onChange function', () => {
    component.onChange({target: {files: [{name: 'file 1'}]}});
    expect(component.selectedFileName).toBe('file 1');
    component.multyFiles = true;
    component.onChange({target: {files: [{name: 'file 2'}]}});
    expect(component.selectedFileName).toBe('file 2');
  });
});

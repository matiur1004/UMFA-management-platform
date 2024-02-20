import {AutoSelectDirective} from './auto-select.directive';
import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

@Component({
  selector: 'auto-select-input',
  template: '<input type="number" value="12345" [autoSelect] >'
})
class AutoSelectComponent {
  constructor() {
  }
}

describe('AutoSelectDirective', () => {
  let component: AutoSelectComponent;
  let fixture: ComponentFixture<AutoSelectComponent>;
  let inputEl: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoSelectDirective, AutoSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AutoSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputEl = fixture.debugElement.query(By.css('input'));

  });

  it('should create an instance', () => {
    const directive = new AutoSelectDirective(inputEl);
    expect(directive).toBeTruthy();
  });

  it('should select an input value', () => {
    inputEl.triggerEventHandler('focus', null);
    expect(window.getSelection().toString()).toBe('12345');

  });
});

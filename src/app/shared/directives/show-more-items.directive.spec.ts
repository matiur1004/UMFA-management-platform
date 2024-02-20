import {async, inject, TestBed} from '@angular/core/testing';
import {ElementRef, Renderer2} from '@angular/core';

import {ShowMoreItemsDirective} from './show-more-items.directive';

const rendererMock = jasmine.createSpyObj('rendererMock', ['setElementStyle', 'addClass', 'setAttribute', 'removeClass']);

describe('ShowMoreItemsDirective', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ShowMoreItemsDirective],
      providers: [
        {provide: Renderer2, useValue: rendererMock}
      ]
    })
      .compileComponents();
  }));

  it('should create an instance', inject([Renderer2], (render: Renderer2) => {
    const directive = new ShowMoreItemsDirective(new ElementRef(document.createElement('div')), render);
    expect(directive).toBeTruthy();
  }));
});

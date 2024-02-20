import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {ReadingSource} from '@app/shared/models/reading-source.model';
import {CONSECUTIVE_ESTIMATED_LIMIT} from '../billing-reading-constants';

@Directive({
  selector: '[reading-status]'
})

export class ReadingStatusDirective implements OnInit {

  @Input() isReadingConfirmed: boolean;
  @Input() readingSource: number;
  @Input() estimatedReadingsCounter: number;

  constructor(private elr: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.renderer.addClass(this.elr.nativeElement, this.getClass(this.isReadingConfirmed, this.readingSource, this.estimatedReadingsCounter));
  }

  getClass(isReadingConfirmed: boolean, readingSource: number, estimatedReadingsCounter: number) {
    let className = '';

    if (isReadingConfirmed && (readingSource != ReadingSource['Estimate'])) {
      className = 'status-confirmed';
    }

    if (!isReadingConfirmed && (readingSource != ReadingSource['Estimate'])) {
      className = 'status-unconfirmed';
    }

    if (readingSource == ReadingSource['Estimate']) {
      className = 'status-estimated';
    }

    if (estimatedReadingsCounter >= CONSECUTIVE_ESTIMATED_LIMIT) {
      className = 'status-consecutive-estimated';
    }

    return className;
  }
}

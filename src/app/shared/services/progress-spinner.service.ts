import {Injectable} from '@angular/core';
import {Subject} from "rxjs";


@Injectable()
export class ProgressSpinnerService {

  counter: number = 0;
  private subject = new Subject<boolean>();

  constructor() {
  }

  displayProgressBar(): void {
    if (this.counter < 1)
      this.subject.next(false);
    this.counter++;
  }

  hideProgressBar(): void {
    this.counter--;
    if (this.counter === 0)
      this.subject.next(true);
  }

  getObservable(): Subject<boolean> {
    return this.subject;
  }

}

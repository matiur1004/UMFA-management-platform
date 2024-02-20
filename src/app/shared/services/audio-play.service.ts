import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class AudioPlayService {

  private audioPlayerSubject = new Subject();

  constructor() {
  }

  getAudioPlayerObservable(): Observable<any> {
    return this.audioPlayerSubject.asObservable();
  }

  sendAudioRecord(recordId: string): void {
    this.audioPlayerSubject.next(recordId);
  }

}

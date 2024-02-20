import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import {AudioPlayService} from 'app/shared/services/audio-play.service';

const subject = new Subject<any>();

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.less']
})

export class AudioPlayerComponent implements OnInit, OnDestroy {

  @Input() url = '';

  audio: any;
  audioLength = 0;
  audioDuration = '';
  public timeElapsed: BehaviorSubject<string> = new BehaviorSubject('00:00');
  audioPlayerObserver$: Subscription;
  private recordId: string;

  constructor(private elRef: ElementRef, private audioPlayService: AudioPlayService) {
    this.audio = new Audio();
    this.audio.addEventListener('timeupdate', this.calculateTime, false);
  }

  ngOnInit() {
    this.setAudio(this.url);
    this.recordId = (Math.floor(Math.random() * +new Date)).toString();
    this.audioPlayerObserver$ = this.audioPlayService.getAudioPlayerObservable().subscribe(recId => {
      if (recId !== this.recordId) {
        this.audio.pause();
      }
    });
  }

  ngOnDestroy() {
    this.audioPlayerObserver$.unsubscribe();
  }

  public setAudio(src: string): void {
    if (src) {
      this.audio.src = src;
      this.audio.addEventListener('loadeddata', () => {
        if (this.audio.duration) {
          this.audioLength = this.audio.duration;
          this.audioDuration = this.setTime(this.audio.duration);
        } else {
          this.audioDuration = '00:00';
        }
      });
    }
  }

  toggleAudio(): void {
    this.audioPlayService.sendAudioRecord(this.recordId);
    (this.audio.paused) ? this.audio.play() : this.audio.pause();
  }

  setCurrentPosition(event) {
    const elWidth = this.elRef.nativeElement.querySelector('.audio-progress').offsetWidth;
    this.audio.currentTime = (event.offsetX * this.audio.duration) / elWidth;
  }

  public getTimeElapsed(): Observable<string> {
    return this.timeElapsed.asObservable();
  }

  private calculateTime = () => {
    const ct = this.audio.currentTime;
    this.setTimeElapsed(ct);
  }

  private setTimeElapsed(currTime: number): void {
    const timeElapsed = this.setTime(currTime);
    this.timeElapsed.next(timeElapsed);
  }

  private setTime(timeVal: number) {
    const seconds = Math.floor(timeVal % 60),
      displaySecs = (seconds < 10) ? '0' + seconds : seconds,
      minutes = Math.floor((timeVal / 60) % 60),
      displayMins = (minutes < 10) ? '0' + minutes : minutes;

    return displayMins + ':' + displaySecs;
  }

}

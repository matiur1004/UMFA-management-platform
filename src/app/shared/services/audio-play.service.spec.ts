import {TestBed} from '@angular/core/testing';

import {AudioPlayService} from './audio-play.service';

describe('AudioPlayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AudioPlayService = TestBed.get(AudioPlayService);
    expect(service).toBeTruthy();
  });
});

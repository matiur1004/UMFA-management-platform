import {inject, TestBed,} from '@angular/core/testing';
import {Injectable} from '@angular/core';

import {UserLogoSrcPipe} from './user-logo-src.pipe';
import {UserService} from 'app/admin/users/shared/user.service';


@Injectable()
class UserMockService {
  getUserLogo(): string {
    return '#';
  }

}

describe('UserLogoSrcPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserLogoSrcPipe],
      providers: [
        {provide: UserService, useClass: UserMockService},
      ],
    }).compileComponents();
  });

  it('create an instance', inject([UserService], (userService: UserService) => {
    const pipe = new UserLogoSrcPipe(userService);
    expect(pipe).toBeTruthy();
  }));
});

import {inject, TestBed} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {APP_BASE_HREF} from '@angular/common';

import {BranchesGuard} from './branches.guard';
import {BranchManagerService} from '@services';

describe('BranchesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      providers: [
        BranchesGuard,
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: BranchManagerService, useValue: {}}
      ]
    });
  });

  it('should ...', inject([BranchesGuard], (guard: BranchesGuard) => {
    expect(guard).toBeTruthy();
  }));
});

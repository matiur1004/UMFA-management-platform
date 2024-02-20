import {TimeOfUse, TimeOfUseName} from '@models';
import {async, inject, TestBed} from '@angular/core/testing';
import {Store} from '@ngrx/store';
import {RegisterUnitPipe} from './register-unit.pipe';
import {BehaviorSubject, Observable} from 'rxjs';
import {ChangeDetectorRef} from '@angular/core';

class TestStore {
  mockData: any[] = [
    {name: 'test1', id: 'test1_id', unit: 'test1_unit', timeOfUse: TimeOfUse.None},
    {name: 'test2', id: 'test2_id', unit: 'test2_unit', timeOfUse: TimeOfUse['Off Peak']},
    {name: 'test3', id: 'test3_id', unit: 'test3_unit', timeOfUse: TimeOfUse.Peak},
    {name: 'test4', id: 'test4_id', unit: 'test4_unit', timeOfUses: 'invalid value'},
    {name: 'test5', id: 'test5_id', unit: 'test5_unit', timeOfUse: null},
    {name: 'test6', id: 'test6_id', unit: 'test6_unit', timeOfUses: 6},
    {name: 'test7', id: 'test7_id', unit: 'test7_unit', timeOfUses: -6}
  ];

  private state: BehaviorSubject<any[]> = new BehaviorSubject(this.mockData);

  pipe(op1: any, op2: any): Observable<any[]> {
    return op2(this.state);
  }
}

describe('RegisterUnitPipe', () => {
  let pipe: RegisterUnitPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegisterUnitPipe,
        ChangeDetectorRef,
        {provide: Store, useClass: TestStore}
      ]
    });
    pipe = TestBed.get(RegisterUnitPipe);
  });

  beforeEach(inject([Store], (testStore: TestStore) => testStore));

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('transforms register id to register unit name', async(() => {
    pipe.transform('test1_id').subscribe(res => expect(res).toBe('test1_unit'));
  }));
  it('transforms register name to register unit name', async(() => {
    pipe.transform('test1').subscribe(res => expect(res).toBe('test1_unit'));
  }));
  it('transforms null id to register unit name', async(() => {
    pipe.transform(null).subscribe(res => expect(res).toBe(''));
  }));
  it('transforms invalid id to register unit name', async(() => {
    pipe.transform('invalid').subscribe(res => expect(res).toBe(''));
  }));
  it('transforms register id with tou to register unit name', async(() => {
    pipe.transform('test3_id').subscribe(res => expect(res).toBe('test3_unit-' + TimeOfUseName[TimeOfUse.Peak].substr(0, 1)));
  }));
  it('transforms register id with invalid tou to register unit name', async(() => {
    pipe.transform('test4_id').subscribe(res => expect(res).toBe(''));
  }));
  it('transforms register id with tou null to register unit name', async(() => {
    pipe.transform('test5_id').subscribe(res => expect(res).toBe(''));
  }));
  it('transforms register id with tou out of range to register unit name', async(() => {
    pipe.transform('test6_id').subscribe(res => expect(res).toBe(''));
  }));
  it('transforms register id with tou less of 0 to register unit name', async(() => {
    pipe.transform('test7_id').subscribe(res => expect(res).toBe(''));
  }));
});

import {TariffDetailsPipe} from './tariff-details.pipe';
import {async, inject, TestBed} from '@angular/core/testing';
import {DatePipe} from '@angular/common';

describe('TariffDetailsPipe', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TariffDetailsPipe],
      providers: [DatePipe]
    }).compileComponents();
  }));

  it('create an instance', inject([DatePipe], (datePipe: DatePipe) => {
    const pipe = new TariffDetailsPipe(datePipe);
    expect(pipe).toBeTruthy();
  }));
  it('input invalid data', inject([DatePipe], (datePipe: DatePipe) => {
    const pipe = new TariffDetailsPipe(datePipe);
    expect(pipe.transform('', null)).toEqual('');
    expect(pipe.transform('QWE', null)).toEqual('');
    expect(pipe.transform(null, null)).toEqual('');
    expect(pipe.transform('qwert', [])).toEqual('');
  }));
  it('input valid data', inject([DatePipe], (datePipe: DatePipe) => {
    const pipe = new TariffDetailsPipe(datePipe);
    const tariffs: any[] = [{
      id: 'qwert',
      versionDate: '2019-09-05T12:00:00.000Z',
      majorVersion: 1,
      entity: {
        name: 'MyTariff'
      }
    }];
    expect(pipe.transform('qwert', tariffs)).toEqual('<span class="tariff-name" title="MyTariff 1-05/09/2019">MyTariff 1-05/09/2019</span>');
  }));
});

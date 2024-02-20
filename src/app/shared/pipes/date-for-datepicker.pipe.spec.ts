import {DateForDatepickerPipe} from './date-for-datepicker.pipe';

describe('DateForDatepickerPipe', () => {
  it('create an instance', () => {
    const pipe = new DateForDatepickerPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new DateForDatepickerPipe();
    expect(pipe.transform(undefined)).not.toBeNull();
  });

  it('input valid data', () => {
    const pipe = new DateForDatepickerPipe();
    expect(pipe.transform(new Date('11/05/2019'))).toEqual({
      year: 2019,
      month: 11,
      day: 5
    });
  });
});

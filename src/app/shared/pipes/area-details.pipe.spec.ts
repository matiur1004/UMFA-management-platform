import {AreaDetailsPipe} from './area-details.pipe';

describe('AreaDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new AreaDetailsPipe();
    expect(pipe).toBeTruthy();
  });
  it('input invalid data', () => {
    const pipe = new AreaDetailsPipe();
    expect(pipe.transform(null, null)).toEqual('');
  });
  it('input valid data', () => {
    const pipe = new AreaDetailsPipe();

    expect(pipe.transform('qwerty', [])).toEqual('');
    expect(pipe.transform('qwerty', [{
      id: 'qwerty',
      name: 'MyArea'
    }])).toEqual('<div class="area-name" title="MyArea">MyArea</div>');

  });
});

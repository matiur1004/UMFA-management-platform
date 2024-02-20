import {LineItemDetailsPipe} from './line-item-details.pipe';

describe('LineItemDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new LineItemDetailsPipe();
    expect(pipe).toBeTruthy();
  });
  it('input invalid data', () => {
    const pipe = new LineItemDetailsPipe();
    expect(pipe.transform('', null)).toEqual('&nbsp;');
    expect(pipe.transform('QWE', null)).toEqual('&nbsp;');
    expect(pipe.transform(null, null)).toEqual('&nbsp;');
    expect(pipe.transform('qwert', [])).toEqual('&nbsp;');
  });
  it('input valid data', () => {
    const pipe = new LineItemDetailsPipe();
    const tariffs: any = [{
      entity: {
        lineItems: [
          {id: 'qwerty', name: 'MyLineItem1'},
          {id: 'qwert', name: 'MyLineItem2'}
        ]
      }
    }];
    expect(pipe.transform('qwert', tariffs)).toEqual('<span class="line-item-name" title="MyLineItem2">MyLineItem2</div>');
  });
});

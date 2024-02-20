import {AttributeDetailsPipe} from './attribute-details.pipe';

describe('AttributeDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new AttributeDetailsPipe();
    expect(pipe).toBeTruthy();
  });
  it('input invalid data', () => {
    const pipe = new AttributeDetailsPipe();
    expect(pipe.transform(null, null)).toEqual('');
  });
  it('input valid data', () => {
    const pipe = new AttributeDetailsPipe();
    const data1: any = {
      attributeId: 'qwerty',
      recommendedValue: '10',
      billingValue: '12',
      value: '11',
      comment: 'some comment',
      fileUrl: 'my url'
    };
    const data2: any = {
      attributeId: 'wertyu',
      recommendedValue: '19',
      billingValue: '17',
      value: null,
      comment: 'some comment',
      fileUrl: 'my url'
    };
    const listAttributes: any = [{
      id: 'qwerty',
      name: 'MyAttribute',
    }, {
      id: 'wertyu',
      name: 'Notified Maximum Demand',
    }];
    expect(pipe.transform(data1, [])).toEqual('');
    expect(pipe.transform(data1, listAttributes)).toEqual('<div class="attribute-item" title="MyAttribute"><label class="attribute-name">MyAttribute:</label><span class="attribute-value">11</span></div>');
    expect(pipe.transform(data2, listAttributes)).toEqual('<div class="attribute-item" title="Notified Maximum Demand"><label class="attribute-name">Maximum Demand:</label><span class="attribute-value">19</span></div>');

  });
});

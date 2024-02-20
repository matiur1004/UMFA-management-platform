import {ShopDetailsPipe} from './shop-details.pipe';

describe('ShopDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new ShopDetailsPipe();
    expect(pipe).toBeTruthy();
  });
  it('input invalid data', () => {
    const pipe = new ShopDetailsPipe();
    expect(pipe.transform(null, null)).toEqual('');
  });
  it('input valid data', () => {
    const pipe = new ShopDetailsPipe();
    const shops: any[] = [{id: 'qwerty', name: 'MyShop'}];
    expect(pipe.transform('qwerty', [])).toEqual('');
    expect(pipe.transform('qwerty', shops)).toEqual('<div class="shop-name" title="MyShop">MyShop</div>');

  });
});

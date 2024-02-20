import {MarkRecommendedCategoryPipe} from './mark-recommended-category.pipe';

describe('MarkRecommendedCategoryPipe', () => {
  it('create an instance', () => {
    const pipe = new MarkRecommendedCategoryPipe();
    expect(pipe).toBeTruthy();
  });
  it('input invalid data', () => {
    const pipe = new MarkRecommendedCategoryPipe();
    expect(pipe.transform(null, null, null)).toEqual([]);
    expect(pipe.transform(null, [], null)).toEqual([]);
    expect(pipe.transform(null, null, '')).toEqual([]);
  });
  it('input valid data', () => {
    const pipe = new MarkRecommendedCategoryPipe();

    expect(pipe.transform([], [], '')).toEqual([]);
    expect(pipe.transform([], [], 'qwerty')).toEqual([]);
  });
});

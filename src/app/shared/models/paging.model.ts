export class PagingViewModel<T> {
  items: Array<T> = new Array<T>();
  total = 0;
}

export const UNITS_PER_PAGE = [10, 30, 50, 100];

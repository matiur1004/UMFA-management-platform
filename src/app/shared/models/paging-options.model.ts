export interface PagingOptions<T> {
  requestParameters: T;
  skip: number;
  take: number;
}

export interface ResponseModel<T> {
  message: string;
  data: T;
  error: ErrorInfo[];
}

export interface ErrorInfo {
  key: string;
  value: string;
}

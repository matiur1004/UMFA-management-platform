interface Header {
  'transfer-encoding': string;
  'content-type': string;
  'content-encoding': string;
  vary: string;
  server: string;
  'request-context': string;
  'x-powered-by': string;
  date: string;
  connection: string;
}

export interface Response {
  domain: any;
  _events: any;
  _eventsCount: number;
  _maxListeners: any;
  res: any;
  request: any;
  req: any;
  text: string;
  body: any;
  files: any;
  buffered: boolean;
  headers: Header;
  header: Header;
  statusCode: number;
  status: number;
  statusType: number;
  info: boolean;
  ok: boolean;
  redirect: boolean;
  clientError: boolean;
  serverError: boolean;
  error: boolean;
  created: boolean;
  accepted: boolean;
  noContent: boolean;
  badRequest: boolean;
  unauthorized: boolean;
  notAcceptable: boolean;
  forbidden: boolean;
  notFound: boolean;
  unprocessableEntity: boolean;
  type: string;
  charset: string;
  links: any;
  setEncoding: Function;
  redirects: any[];
}
import {HttpProtocolPipe} from './http-protocol.pipe';

describe('HttpProtocolPipe', () => {
  it('input valid data', () => {
    const pipe = new HttpProtocolPipe();
    expect(pipe.transform("http://www.google.com")).toEqual("http://www.google.com");
    expect(pipe.transform("https://www.google.com")).toEqual("https://www.google.com");
    expect(pipe.transform("www.google.com", "https://")).toEqual("https://www.google.com");
    expect(pipe.transform("www.google.com", "http://")).toEqual("http://www.google.com");
  });
});

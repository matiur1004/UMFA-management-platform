import {NodeTypeLabelPipe} from './node-type-label.pipe';

describe('NodeTypeLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new NodeTypeLabelPipe();
    expect(pipe).toBeTruthy();
  });

  it('input empty data', () => {
    const pipe = new NodeTypeLabelPipe();
    expect(pipe.transform(null, null)).toEqual('');
  });

  it('input valid data', () => {
    const pipe = new NodeTypeLabelPipe();
    expect(pipe.transform(0)).toEqual('Single meter node');
    expect(pipe.transform(1)).toEqual('Multi meter node');

    expect(pipe.transform(0, 'short')).toEqual('Single');
    expect(pipe.transform(1, 'short')).toEqual('Multi');
  });
});

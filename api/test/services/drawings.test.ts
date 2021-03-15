import app from '../../src/app';

describe('\'drawings\' service', () => {
  it('registered the service', () => {
    const service = app.service('drawings');
    expect(service).toBeTruthy();
  });
});

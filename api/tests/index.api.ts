import {Config} from '../config';

describe('Auth', () => {
  it('should login user', (done) => {
    const server = Config.getServer();
    server.post('/api/v1/account/signin')
      .send({email: Config.login, password: Config.password, rememberMe: false})
      .expect("Content-type", /json/)
      .expect(200)
      .end((err, res) => {
        expect(res.status).toBe(200);
        Config.token = res.body.data.token;
        done();
      });
  });
});

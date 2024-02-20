var supertest = require("supertest");

export class Config {
  static readonly host = 'https://umfadunamis-webmanagementportal-test.azurewebsites.net';
  static readonly login = 'dev@byteant.com';
  static readonly password = 'Instance@1';
  static token: string = '';

  static building = {
    id: 'a1ce3a12-1d89-4017-8db6-3fcda19e20f0',
    name: '_MyHouse'
  }
  static category = {
    id: '6e6ced0e-ed7b-4b71-a21a-343cdcdc8fb5',
    name: 'Retail'
  };
  private static server: any;

  constructor() {
  }

  static getServer() {
    if (!this.server) {
      this.server = supertest.agent(Config.host);
    }
    return this.server;
  }
}

export class Request {
  static get(url: string) {
    const server = Config.getServer();
    const token = Config.token;
    return server.get(url)
      .set("Authorization", 'Bearer ' + token)
      .expect("Content-type", /json/)
      .expect(200);
  }
}

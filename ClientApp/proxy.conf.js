const { env } = require('process');

// const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
//   env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:16721';

//const target = 'https://localhost:7072';
const target = 'https://umfaclientportal.azurewebsites.net';

const PROXY_CONFIG = [
  {
    context: [
      "/user",
      "/home",
      "/AMRScadaUser",
      "/Building",
      "/AMRMeter",
      "/AMRData",
      "/dashboard",
      "/DXXRDV"
   ],
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;

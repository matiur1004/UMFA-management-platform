import { environment } from 'environments/environment';


export interface ApplicationConfiguration {
  apiURL: string;
  devExpressUrl: string;
  authPath: string;
  refreshPath: string;
  revokePath: string;
  getHomeStats: string;
  getUser: string;
  // paths for amr scada users
  getAmrScadaUser: string;
  getAmrScadaUsersForUser: string;
  editAmrScadaUsersForUser: string;
  editAmrScadaUser: string;
  deleteAmrScadaUser: string;
  decryptString: string;
  encryptString: string;
  changePwdString: string;
  // paths for Buildings
  buildingsForUser: string;
  // paths for Meters
  metersForUser: string;
  metersForUserChart: string;
  addMeter: string;
  getMeter: string;
  updateMeter: string;
  getUtilities: string;
  // paths for AMR Data
  getTouHeaders: string;
  getDemandProfile: string;
  getWaterProfile: string;
  getPartners: string;
  getPeriods: string;
}

export const CONFIG: ApplicationConfiguration = {
  apiURL: (environment.production) ? 'https://umfaportal.azurewebsites.net' : 'https://localhost:7054',
  devExpressUrl: (environment.production) ? 'https://umfaportal.azurewebsites.net/' : 'https://localhost:7054/',
  authPath: '/user/authenticate',
  refreshPath: '/user/refresh-token',
  revokePath: '/user/revoke-token',
  getHomeStats: '/home/get-stats',
  getUser: '/user/',
  // paths for amr scada users
  getAmrScadaUser: '/AMRScadaUser/',
  getAmrScadaUsersForUser: '/AMRScadaUser/user/',
  editAmrScadaUsersForUser: '/AMRScadaUser/edit',
  editAmrScadaUser: '/AMRScadaUser/edit/',
  deleteAmrScadaUser: '/AMRScadaUser/delete/',
  decryptString: '/AMRScadaUser/decrypt/',
  encryptString: '/AMRScadaUser/encrypt/',
  changePwdString: '/AMRScadaUser/edit/changePwd',
  // paths for Buildings
  buildingsForUser: '/Building/umfabuildings/',
  getPartners: '/Building/Partners/',
  getPeriods: '/Building/Periods/',
  // paths for Meters
  metersForUser: '/AMRMeter/usermeters/',
  metersForUserChart: '/AMRMeter/usermeterschart/',
  addMeter: '/AMRMeter/addmeter',
  getMeter: '/AMRMeter/meter/',
  updateMeter: '/AMRMeter/updatemeter',
  getUtilities: '/AMRMeter/getmakemodels',
  // paths for AMR Data
  getTouHeaders: '/AMRData/getTOUHeaders',
  getDemandProfile: '/AMRData/getDemandProfile',
  getWaterProfile: '/AMRData/getWaterProfile',
};

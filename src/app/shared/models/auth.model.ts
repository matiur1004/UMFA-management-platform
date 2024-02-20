export class AuthResponseModel {

  fullName: string;
  role: string;
  token: string;
  isMCAdmin: boolean;
  isBranchUser: boolean;
  isTenantUser: boolean;
  isClientUser: boolean;
  logoUrl: string;
  userId: string;
  
  constructor(fullName: string, role: string, token: string, isMCAdmin: boolean, isBranchUser: boolean, isTenantUser: boolean, isClientUser: boolean, logoUrl: string, userId: string) {
    this.fullName = fullName;
    this.role = role;
    this.token = token;
    this.isMCAdmin = isMCAdmin;
    this.isBranchUser = isBranchUser;
    this.isTenantUser = isTenantUser;
    this.isClientUser = isClientUser;
    this.logoUrl = logoUrl;
    this.userId = userId;
  }
}

export enum Roles {
  SuperAdmin
}

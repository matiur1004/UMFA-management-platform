export interface LoginResponseModel {
  fullName: string;
  role: string;
  token: string;
  lastUrl: string;
  isMCAdmin: boolean;
  isBranchUser: boolean;
  isTenantUser: boolean;
  isClientUser: boolean;
  lastBranchId: string;
  userId: string;
}

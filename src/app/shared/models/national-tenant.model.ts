export interface NationalTenantViewModel {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  relatedTenantsCount: number;
}

export interface CreateNationalTenantViewModel {
  name: string;
  logo: File;
  description: string;
}

export interface CreateNationalTenantResult {
  id: string;
  logoUrl: string;
}

export type ApiError = {
  error: string;
};

export type DashboardSummary = {
  propertiesCount: number;
  tenantsCount: number;
  pendingPayments: number;
  totalCollected: number;
};

export type TenantDto = {
  id: string;
  fullName: string;
  phone: string;
  unitNumber: string;
  rentAmount: number;
};

export type PropertyDto = {
  id: string;
  name: string;
  location: string;
  unitCount: number;
  _count?: {
    tenants: number;
  };
};

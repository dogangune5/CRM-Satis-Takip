export type ProposalStatus =
  | 'Taslak'
  | 'Gönderildi'
  | 'Görüşülüyor'
  | 'Revize Edildi'
  | 'Onaylandı'
  | 'Reddedildi';

export type ProposalItemType = 'Ürün' | 'Hizmet' | 'Proje';

export interface ProposalItem {
  id?: number;
  proposalId?: number;
  type: ProposalItemType;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount?: number;
  total: number;
}

export interface Proposal {
  id?: number;
  proposalNumber: string;
  customerId: number;
  opportunityId?: number;
  title: string;
  description?: string;
  status: ProposalStatus;
  validUntil: Date;
  items: ProposalItem[];
  subTotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  terms?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
}

export interface ProposalFilter {
  searchTerm?: string;
  status?: ProposalStatus;
  customerId?: number;
  opportunityId?: number;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: keyof Proposal;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ProposalPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

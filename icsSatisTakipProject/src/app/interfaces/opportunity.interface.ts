export type OpportunityStatus =
  | 'Yeni'
  | 'Görüşülüyor'
  | 'Teklif Aşamasında'
  | 'Kazanıldı'
  | 'Kaybedildi';

export interface Opportunity {
  id: number;
  customerId: number;
  title: string;
  description: string;
  value: number;
  probability: number;
  status: OpportunityStatus;
  expectedCloseDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OpportunityFilter {
  searchTerm?: string;
  status?: OpportunityStatus;
  customerId?: number;
  startDate?: Date;
  endDate?: Date;
  minValue?: number;
  maxValue?: number;
  minProbability?: number;
  maxProbability?: number;
  sortBy?: keyof Opportunity;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface OpportunityPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

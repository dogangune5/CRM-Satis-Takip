// Temel tipler
export type CustomerStatus = 'Aktif' | 'Pasif' | 'Potansiyel';
export type LeadType = 'Bireysel' | 'Kurumsal';
export type ContactType = 'Telefon' | 'Email' | 'Yüz Yüze';

// Müşteri iletişim bilgileri
export interface CustomerContact {
  id: number;
  type: ContactType;
  value: string;
  description?: string;
  isPrimary: boolean;
}

// Müşteri adresi
export interface CustomerAddress {
  id: number;
  type: string;
  country: string;
  city: string;
  district?: string;
  address: string;
  postalCode?: string;
  isPrimary: boolean;
}

// Ana müşteri interface'i
export interface Customer {
  id: number;
  customerNumber: string;
  leadType: LeadType;
  name: string;
  company?: string;
  taxNumber?: string;
  taxOffice?: string;
  status: CustomerStatus;
  contacts: CustomerContact[];
  addresses: CustomerAddress[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Filtreleme ve sayfalama için yardımcı interface'ler
export interface CustomerFilter {
  searchTerm?: string;
  status?: CustomerStatus;
  leadType?: LeadType;
  sortBy?: keyof Customer;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface CustomerPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

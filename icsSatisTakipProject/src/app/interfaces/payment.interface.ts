export type PaymentStatus =
  | 'Bekliyor'
  | 'Onaylandı'
  | 'İptal Edildi'
  | 'İade Edildi'
  | 'Kısmi Ödeme';

export type PaymentType =
  | 'Nakit'
  | 'Kredi Kartı'
  | 'Havale/EFT'
  | 'Çek'
  | 'Senet';

export interface Payment {
  id?: number;
  paymentNumber: string;
  customerId: number;
  orderId?: number;
  type: PaymentType;
  amount: number;
  status: PaymentStatus;
  paymentDate: Date;
  dueDate?: Date;
  description?: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
}

export interface PaymentFilter {
  searchTerm?: string;
  status?: PaymentStatus;
  type?: PaymentType;
  customerId?: number;
  orderId?: number;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: keyof Payment;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaymentPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

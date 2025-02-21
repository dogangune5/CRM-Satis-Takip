export type OrderStatus =
  | 'Yeni'
  | 'Onay Bekliyor'
  | 'Onaylandı'
  | 'Hazırlanıyor'
  | 'Kargoya Verildi'
  | 'Tamamlandı'
  | 'İptal Edildi';

export type OrderItemType = 'Ürün' | 'Hizmet' | 'Proje';

export interface OrderItem {
  id?: number;
  orderId?: number;
  type: OrderItemType;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount?: number;
  total: number;
}

export interface Order {
  id?: number;
  orderNumber: string;
  customerId: number;
  proposalId?: number;
  title: string;
  description?: string;
  status: OrderStatus;
  orderDate: Date;
  deliveryDate?: Date;
  items: OrderItem[];
  subTotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  shippingAddress?: string;
  billingAddress?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
}

export interface OrderFilter {
  searchTerm?: string;
  status?: OrderStatus;
  customerId?: number;
  proposalId?: number;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: keyof Order;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface OrderPagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

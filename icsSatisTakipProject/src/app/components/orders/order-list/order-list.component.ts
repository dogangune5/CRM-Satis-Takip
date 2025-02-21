import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Order,
  OrderStatus,
  OrderFilter,
  OrderPagination,
} from '../../../interfaces/order.interface';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  // Filtreler
  filter: OrderFilter = {
    searchTerm: '',
    status: undefined,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    page: 1,
    pageSize: 10,
  };

  // Sayfalama
  pagination: OrderPagination = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };

  statuses: OrderStatus[] = [
    'Yeni',
    'Onay Bekliyor',
    'Onaylandı',
    'Hazırlanıyor',
    'Kargoya Verildi',
    'Tamamlandı',
    'İptal Edildi',
  ];

  constructor() {
    // Örnek veri
    this.orders = [
      {
        id: 1,
        orderNumber: 'SIP-2024-001',
        customerId: 1,
        proposalId: 1,
        title: 'E-ticaret Sistemi Siparişi',
        description: 'B2B E-ticaret platformu geliştirme projesi siparişi',
        status: 'Onaylandı',
        orderDate: new Date(),
        deliveryDate: new Date('2024-07-30'),
        items: [
          {
            id: 1,
            orderId: 1,
            type: 'Proje',
            name: 'E-ticaret Yazılımı',
            description: 'B2B E-ticaret platformu geliştirme',
            quantity: 1,
            unitPrice: 150000,
            tax: 18,
            total: 150000,
          },
        ],
        subTotal: 150000,
        taxTotal: 27000,
        discountTotal: 0,
        grandTotal: 177000,
        shippingAddress: 'Teslimat adresi...',
        billingAddress: 'Fatura adresi...',
        notes: 'Sipariş notları...',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1,
      },
    ];
    this.filteredOrders = [...this.orders];
  }

  ngOnInit(): void {
    this.calculatePagination();
  }

  // Arama
  onSearch(): void {
    this.filter.page = 1;
    this.filterOrders();
  }

  // Filtreleme
  onFilterChange(): void {
    this.filter.page = 1;
    this.filterOrders();
  }

  // Sıralama
  onSort(column: keyof Order): void {
    if (this.filter.sortBy === column) {
      this.filter.sortDirection =
        this.filter.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.filter.sortBy = column;
      this.filter.sortDirection = 'asc';
    }
    this.filterOrders();
  }

  // Sıralama ikonu
  getSortIcon(column: string): string {
    if (this.filter.sortBy !== column) return 'bi-arrow-down-up';
    return this.filter.sortDirection === 'asc'
      ? 'bi-arrow-up'
      : 'bi-arrow-down';
  }

  // Durum badge sınıfı
  getStatusBadgeClass(status: OrderStatus): string {
    switch (status) {
      case 'Yeni':
        return 'bg-info';
      case 'Onay Bekliyor':
        return 'bg-warning';
      case 'Onaylandı':
        return 'bg-primary';
      case 'Hazırlanıyor':
        return 'bg-secondary';
      case 'Kargoya Verildi':
        return 'bg-info';
      case 'Tamamlandı':
        return 'bg-success';
      case 'İptal Edildi':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  // Sayfalama
  onPageChange(page: number): void {
    this.filter.page = page;
    this.filterOrders();
  }

  private calculatePagination(): void {
    const totalItems = this.filteredOrders.length;
    const pageSize = this.filter.pageSize || 10;
    this.pagination = {
      currentPage: this.filter.page || 1,
      pageSize: pageSize,
      totalItems: totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  get startItem(): number {
    return (this.pagination.currentPage - 1) * this.pagination.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(
      this.pagination.currentPage * this.pagination.pageSize,
      this.pagination.totalItems
    );
  }

  // Sipariş işlemleri
  addOrder(): void {
    // Yeni sipariş ekleme sayfasına yönlendir
  }

  viewOrder(order: Order): void {
    // Sipariş detay sayfasına yönlendir
  }

  editOrder(order: Order): void {
    // Sipariş düzenleme sayfasına yönlendir
  }

  deleteOrder(order: Order): void {
    // Silme modalını göster
  }

  private filterOrders(): void {
    let filtered = [...this.orders];

    // Arama filtresi
    if (this.filter.searchTerm) {
      const searchLower = this.filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.title.toLowerCase().includes(searchLower)
      );
    }

    // Durum filtresi
    if (this.filter.status) {
      filtered = filtered.filter(
        (order) => order.status === this.filter.status
      );
    }

    // Sıralama
    if (this.filter.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[this.filter.sortBy!];
        const bValue = b[this.filter.sortBy!];
        const direction = this.filter.sortDirection === 'asc' ? 1 : -1;

        if (aValue instanceof Date && bValue instanceof Date) {
          return direction * (aValue.getTime() - bValue.getTime());
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction * aValue.localeCompare(bValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction * (aValue - bValue);
        }

        return 0;
      });
    }

    this.filteredOrders = filtered;
    this.calculatePagination();
  }
}

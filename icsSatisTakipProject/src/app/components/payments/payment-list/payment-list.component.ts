import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  Payment,
  PaymentStatus,
  PaymentType,
  PaymentFilter,
  PaymentPagination,
} from '../../../interfaces/payment.interface';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'payment-list.component.html',
  styleUrls: ['payment-list.component.css'],
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  filteredPayments: Payment[] = [];

  // Filtre ve sayfalama
  filter: PaymentFilter = {
    searchTerm: '',
    status: undefined,
    type: undefined,
    startDate: undefined,
    endDate: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    sortBy: 'paymentDate',
    sortDirection: 'desc',
    page: 1,
    pageSize: 10,
  };

  pagination: PaymentPagination = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };

  // Durum ve tip listeleri
  statuses: PaymentStatus[] = [
    'Bekliyor',
    'Onaylandı',
    'İptal Edildi',
    'İade Edildi',
    'Kısmi Ödeme',
  ];

  paymentTypes: PaymentType[] = [
    'Nakit',
    'Kredi Kartı',
    'Havale/EFT',
    'Çek',
    'Senet',
  ];

  constructor() {
    // Örnek veri
    this.payments = [
      {
        id: 1,
        paymentNumber: 'ODM-2024-001',
        customerId: 1,
        orderId: 1,
        type: 'Kredi Kartı',
        amount: 5000,
        status: 'Onaylandı',
        paymentDate: new Date(),
        description: 'Sipariş ödemesi',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1,
      },
      // Diğer örnek ödemeler...
    ];

    this.filterPayments();
  }

  ngOnInit(): void {
    this.calculatePagination();
  }

  // Arama işlemi
  onSearch(): void {
    this.filter.page = 1;
    this.filterPayments();
  }

  // Filtre değişikliği
  onFilterChange(): void {
    this.filter.page = 1;
    this.filterPayments();
  }

  // Sıralama işlemi
  onSort(column: keyof Payment): void {
    if (this.filter.sortBy === column) {
      this.filter.sortDirection =
        this.filter.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.filter.sortBy = column;
      this.filter.sortDirection = 'asc';
    }
    this.filterPayments();
  }

  // Sıralama ikonu
  getSortIcon(column: string): string {
    if (this.filter.sortBy !== column) {
      return 'bi-chevron-expand';
    }
    return this.filter.sortDirection === 'asc'
      ? 'bi-chevron-up'
      : 'bi-chevron-down';
  }

  // Durum badge sınıfı
  getStatusBadgeClass(status: PaymentStatus): string {
    switch (status) {
      case 'Bekliyor':
        return 'bg-warning';
      case 'Onaylandı':
        return 'bg-success';
      case 'İptal Edildi':
        return 'bg-danger';
      case 'İade Edildi':
        return 'bg-info';
      case 'Kısmi Ödeme':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  }

  // Ödeme tipi badge sınıfı
  getPaymentTypeBadgeClass(type: PaymentType): string {
    switch (type) {
      case 'Nakit':
        return 'bg-success';
      case 'Kredi Kartı':
        return 'bg-info';
      case 'Havale/EFT':
        return 'bg-primary';
      case 'Çek':
        return 'bg-warning';
      case 'Senet':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  // Sayfa değişimi
  onPageChange(page: number): void {
    this.filter.page = page;
    this.filterPayments();
  }

  // Sayfalama hesaplama
  private calculatePagination(): void {
    const totalItems = this.filteredPayments.length;
    const totalPages = Math.ceil(totalItems / this.filter.pageSize!);

    this.pagination = {
      currentPage: this.filter.page!,
      pageSize: this.filter.pageSize!,
      totalItems,
      totalPages,
    };
  }

  // Başlangıç öğesi
  get startItem(): number {
    return (this.pagination.currentPage - 1) * this.pagination.pageSize + 1;
  }

  // Bitiş öğesi
  get endItem(): number {
    const end = this.pagination.currentPage * this.pagination.pageSize;
    return Math.min(end, this.pagination.totalItems);
  }

  // Yeni ödeme ekleme
  addPayment(): void {
    // Router ile yeni ödeme formuna yönlendir
  }

  // Ödeme görüntüleme
  viewPayment(payment: Payment): void {
    // Router ile ödeme detayına yönlendir
  }

  // Ödeme düzenleme
  editPayment(payment: Payment): void {
    // Router ile ödeme düzenleme formuna yönlendir
  }

  // Ödeme silme
  deletePayment(payment: Payment): void {
    // Silme işlemi
  }

  // Filtreleme işlemi
  private filterPayments(): void {
    let filtered = [...this.payments];

    // Arama terimi filtresi
    if (this.filter.searchTerm) {
      const searchTerm = this.filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment.paymentNumber.toLowerCase().includes(searchTerm) ||
          payment.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Durum filtresi
    if (this.filter.status) {
      filtered = filtered.filter(
        (payment) => payment.status === this.filter.status
      );
    }

    // Tip filtresi
    if (this.filter.type) {
      filtered = filtered.filter(
        (payment) => payment.type === this.filter.type
      );
    }

    // Tarih filtresi
    if (this.filter.startDate) {
      filtered = filtered.filter(
        (payment) => payment.paymentDate >= this.filter.startDate!
      );
    }
    if (this.filter.endDate) {
      filtered = filtered.filter(
        (payment) => payment.paymentDate <= this.filter.endDate!
      );
    }

    // Tutar filtresi
    if (this.filter.minAmount !== undefined) {
      filtered = filtered.filter(
        (payment) => payment.amount >= this.filter.minAmount!
      );
    }
    if (this.filter.maxAmount !== undefined) {
      filtered = filtered.filter(
        (payment) => payment.amount <= this.filter.maxAmount!
      );
    }

    // Sıralama
    if (this.filter.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[this.filter.sortBy!];
        const bValue = b[this.filter.sortBy!];
        const direction = this.filter.sortDirection === 'asc' ? 1 : -1;

        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) return -1 * direction;
        if (aValue > bValue) return 1 * direction;
        return 0;
      });
    }

    // Sayfalama
    const startIndex = (this.filter.page! - 1) * this.filter.pageSize!;
    const endIndex = startIndex + this.filter.pageSize!;
    this.filteredPayments = filtered.slice(startIndex, endIndex);

    this.calculatePagination();
  }
}

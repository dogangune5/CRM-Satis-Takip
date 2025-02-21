import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Customer,
  CustomerStatus,
  CustomerFilter,
  CustomerPagination,
  LeadType,
  CustomerContact,
  CustomerAddress,
  ContactType,
} from '../../interfaces/customer.interface';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
  // Arama ve Filtreleme
  filter: CustomerFilter = {
    searchTerm: '',
    status: undefined,
    leadType: undefined,
    sortBy: 'customerNumber',
    sortDirection: 'asc',
    page: 1,
    pageSize: 10,
  };

  // Sayfalama
  pagination: CustomerPagination = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };

  pages: number[] = [];

  // Müşteri Listesi
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  constructor() {
    // Örnek veri
    this.customers = [
      {
        id: 1,
        customerNumber: 'CUS001',
        leadType: 'Kurumsal',
        name: 'Ahmet Yılmaz',
        company: 'Teknoloji Ltd.',
        taxNumber: '1234567890',
        taxOffice: 'Ankara VD',
        status: 'Aktif',
        contacts: [
          {
            id: 1,
            type: 'Telefon',
            value: '0532 111 2233',
            isPrimary: true,
          },
          {
            id: 2,
            type: 'Email',
            value: 'ahmet@tekltd.com',
            isPrimary: true,
          },
        ],
        addresses: [
          {
            id: 1,
            type: 'İş',
            country: 'Türkiye',
            city: 'Ankara',
            district: 'Çankaya',
            address: 'Kızılay Mah. Atatürk Cad. No:1',
            postalCode: '06100',
            isPrimary: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        customerNumber: 'CUS002',
        leadType: 'Bireysel',
        name: 'Ayşe Demir',
        status: 'Potansiyel',
        contacts: [
          {
            id: 3,
            type: 'Telefon',
            value: '0533 444 5566',
            isPrimary: true,
          },
        ],
        addresses: [
          {
            id: 2,
            type: 'Ev',
            country: 'Türkiye',
            city: 'İstanbul',
            district: 'Kadıköy',
            address: 'Bağdat Cad. No:50',
            postalCode: '34100',
            isPrimary: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  ngOnInit(): void {
    this.filterCustomers();
  }

  // Arama İşlemi
  onSearch(): void {
    this.filter.page = 1;
    this.filterCustomers();
  }

  // Filtreleme İşlemi
  onFilterChange(): void {
    this.filter.page = 1;
    this.filterCustomers();
  }

  // Sıralama İşlemi
  onSort(column: keyof Customer): void {
    if (this.filter.sortBy === column) {
      this.filter.sortDirection =
        this.filter.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.filter.sortBy = column;
      this.filter.sortDirection = 'asc';
    }
    this.filterCustomers();
  }

  // Sıralama İkonu
  getSortIcon(column: string): string {
    if (this.filter.sortBy !== column) return 'bi-arrow-down-up';
    return this.filter.sortDirection === 'asc'
      ? 'bi-arrow-up'
      : 'bi-arrow-down';
  }

  // Durum Badge Sınıfı
  getStatusBadgeClass(status: CustomerStatus): string {
    switch (status.toLowerCase()) {
      case 'aktif':
        return 'bg-success';
      case 'pasif':
        return 'bg-danger';
      case 'potansiyel':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  // Müşteri Tipi Badge Sınıfı
  getLeadTypeBadgeClass(leadType: LeadType): string {
    switch (leadType) {
      case 'Kurumsal':
        return 'bg-primary';
      case 'Bireysel':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  // İletişim İkonu
  getContactIcon(type: ContactType): string {
    switch (type) {
      case 'Telefon':
        return 'bi bi-telephone';
      case 'Email':
        return 'bi bi-envelope';
      case 'Yüz Yüze':
        return 'bi bi-person';
      default:
        return 'bi bi-chat';
    }
  }

  // Primary İletişim Bilgilerini Al
  getPrimaryContact(contacts: CustomerContact[]): CustomerContact[] {
    return contacts.filter((contact) => contact.isPrimary);
  }

  // Primary Adresi Al
  getPrimaryAddress(addresses: CustomerAddress[]): CustomerAddress[] {
    return addresses.filter((address) => address.isPrimary);
  }

  // Adresi Formatla
  formatAddress(address: CustomerAddress): string {
    const parts = [
      address.address,
      address.district,
      address.city,
      address.country,
    ].filter(Boolean);
    return parts.join(', ');
  }

  // Sayfalama İşlemleri
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.filter.page = page;
      this.filterCustomers();
    }
  }

  private calculatePagination(): void {
    const { page = 1, pageSize = 10 } = this.filter;
    const totalItems = this.filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    this.pagination = {
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
    };

    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
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

  // Müşteri İşlemleri
  addNewCustomer(): void {
    // Yeni müşteri ekleme işlemi
  }

  viewCustomer(customer: Customer): void {
    // Müşteri detay görüntüleme işlemi
  }

  editCustomer(customer: Customer): void {
    // Müşteri düzenleme işlemi
  }

  deleteCustomer(customer: Customer): void {
    // Müşteri silme işlemi
  }

  private filterCustomers(): void {
    let result = [...this.customers];

    // Arama
    if (this.filter.searchTerm) {
      const searchLower = this.filter.searchTerm.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.customerNumber.toLowerCase().includes(searchLower) ||
          customer.name.toLowerCase().includes(searchLower) ||
          customer.company?.toLowerCase().includes(searchLower) ||
          customer.contacts.some((contact) =>
            contact.value.toLowerCase().includes(searchLower)
          )
      );
    }

    // Müşteri Tipi Filtresi
    if (this.filter.leadType) {
      result = result.filter(
        (customer) => customer.leadType === this.filter.leadType
      );
    }

    // Durum Filtresi
    if (this.filter.status) {
      result = result.filter(
        (customer) => customer.status === this.filter.status
      );
    }

    // Sıralama
    if (this.filter.sortBy) {
      result.sort((a, b) => {
        const aValue = a[this.filter.sortBy as keyof Customer];
        const bValue = b[this.filter.sortBy as keyof Customer];
        const direction = this.filter.sortDirection === 'asc' ? 1 : -1;

        if (aValue === undefined || bValue === undefined) {
          return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction * aValue.localeCompare(bValue);
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return direction * (aValue.getTime() - bValue.getTime());
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction * (aValue - bValue);
        }

        return 0;
      });
    }

    this.filteredCustomers = result;
    this.calculatePagination();

    // Sayfalama
    const startIndex =
      (this.pagination.currentPage - 1) * this.pagination.pageSize;
    const endIndex = startIndex + this.pagination.pageSize;
    this.filteredCustomers = result.slice(startIndex, endIndex);
  }
}

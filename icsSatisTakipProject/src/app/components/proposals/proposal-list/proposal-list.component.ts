import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Proposal,
  ProposalStatus,
  ProposalFilter,
  ProposalPagination,
} from '../../../interfaces/proposal.interface';

@Component({
  selector: 'app-proposal-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.css'],
})
export class ProposalListComponent implements OnInit {
  proposals: Proposal[] = [];
  filteredProposals: Proposal[] = [];

  // Filtreler
  filter: ProposalFilter = {
    searchTerm: '',
    status: undefined,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    page: 1,
    pageSize: 10,
  };

  // Sayfalama
  pagination: ProposalPagination = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  };

  statuses: ProposalStatus[] = [
    'Taslak',
    'Gönderildi',
    'Görüşülüyor',
    'Revize Edildi',
    'Onaylandı',
    'Reddedildi',
  ];

  constructor() {
    // Örnek veri
    this.proposals = [
      {
        id: 1,
        proposalNumber: 'TEK-2024-001',
        customerId: 1,
        opportunityId: 1,
        title: 'E-ticaret Projesi Teklifi',
        description: 'B2B E-ticaret platformu geliştirme projesi için teklif',
        status: 'Gönderildi',
        validUntil: new Date('2024-07-30'),
        items: [
          {
            id: 1,
            proposalId: 1,
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
        terms: 'Ödeme şartları...',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 1,
        updatedBy: 1,
      },
    ];
    this.filteredProposals = [...this.proposals];
  }

  ngOnInit(): void {
    this.calculatePagination();
  }

  // Arama
  onSearch(): void {
    this.filter.page = 1;
    this.filterProposals();
  }

  // Filtreleme
  onFilterChange(): void {
    this.filter.page = 1;
    this.filterProposals();
  }

  // Sıralama
  onSort(column: keyof Proposal): void {
    if (this.filter.sortBy === column) {
      this.filter.sortDirection =
        this.filter.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.filter.sortBy = column;
      this.filter.sortDirection = 'asc';
    }
    this.filterProposals();
  }

  // Sıralama ikonu
  getSortIcon(column: string): string {
    if (this.filter.sortBy !== column) return 'bi-arrow-down-up';
    return this.filter.sortDirection === 'asc'
      ? 'bi-arrow-up'
      : 'bi-arrow-down';
  }

  // Durum badge sınıfı
  getStatusBadgeClass(status: ProposalStatus): string {
    switch (status) {
      case 'Taslak':
        return 'bg-secondary';
      case 'Gönderildi':
        return 'bg-primary';
      case 'Görüşülüyor':
        return 'bg-info';
      case 'Revize Edildi':
        return 'bg-warning';
      case 'Onaylandı':
        return 'bg-success';
      case 'Reddedildi':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  // Sayfalama
  onPageChange(page: number): void {
    this.filter.page = page;
    this.filterProposals();
  }

  private calculatePagination(): void {
    const totalItems = this.filteredProposals.length;
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

  // Teklif işlemleri
  addProposal(): void {
    // Yeni teklif ekleme sayfasına yönlendir
  }

  viewProposal(proposal: Proposal): void {
    // Teklif detay sayfasına yönlendir
  }

  editProposal(proposal: Proposal): void {
    // Teklif düzenleme sayfasına yönlendir
  }

  deleteProposal(proposal: Proposal): void {
    // Silme modalını göster
  }

  private filterProposals(): void {
    let filtered = [...this.proposals];

    // Arama filtresi
    if (this.filter.searchTerm) {
      const searchLower = this.filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (prop) =>
          prop.proposalNumber.toLowerCase().includes(searchLower) ||
          prop.title.toLowerCase().includes(searchLower)
      );
    }

    // Durum filtresi
    if (this.filter.status) {
      filtered = filtered.filter((prop) => prop.status === this.filter.status);
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

    this.filteredProposals = filtered;
    this.calculatePagination();
  }
}

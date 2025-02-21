import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Opportunity,
  OpportunityStatus,
} from '../../../interfaces/opportunity.interface';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './opportunity-list.component.html',
  styleUrls: ['./opportunity-list.component.css'],
})
export class OpportunityListComponent implements OnInit {
  opportunities: Opportunity[] = [];
  viewMode: 'list' | 'kanban' = 'list';
  statusList: OpportunityStatus[] = [
    'Yeni',
    'Görüşülüyor',
    'Teklif Aşamasında',
    'Kazanıldı',
    'Kaybedildi',
  ];

  // Filtreler
  filter = {
    searchTerm: '',
    status: '' as OpportunityStatus | '',
    sortBy: 'expectedCloseDate' as keyof Opportunity,
    sortDirection: 'asc' as 'asc' | 'desc',
  };

  // Kanban görünümü için gruplandırılmış fırsatlar
  kanbanGroups: { [key in OpportunityStatus]: Opportunity[] } = {
    Yeni: [],
    Görüşülüyor: [],
    'Teklif Aşamasında': [],
    Kazanıldı: [],
    Kaybedildi: [],
  };

  constructor() {
    // Örnek veri
    this.opportunities = [
      {
        id: 1,
        customerId: 1,
        title: 'E-ticaret Projesi',
        description: 'B2B E-ticaret platformu geliştirme projesi',
        value: 150000,
        probability: 70,
        status: 'Görüşülüyor',
        expectedCloseDate: new Date('2024-06-30'),
        notes: 'Müşteri ile ilk görüşme yapıldı',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        customerId: 2,
        title: 'Mobil Uygulama',
        description: 'iOS ve Android mobil uygulama geliştirme',
        value: 200000,
        probability: 50,
        status: 'Teklif Aşamasında',
        expectedCloseDate: new Date('2024-07-15'),
        notes: 'Teklif hazırlanıyor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  ngOnInit(): void {
    this.updateKanbanGroups();
  }

  // Kanban gruplarını güncelle
  updateKanbanGroups(): void {
    // Grupları sıfırla
    Object.keys(this.kanbanGroups).forEach((key) => {
      this.kanbanGroups[key as OpportunityStatus] = [];
    });

    // Fırsatları gruplara dağıt
    this.opportunities.forEach((opportunity) => {
      this.kanbanGroups[opportunity.status].push(opportunity);
    });
  }

  // Görünüm modunu değiştir
  toggleView(mode: 'list' | 'kanban'): void {
    this.viewMode = mode;
    if (mode === 'kanban') {
      this.updateKanbanGroups();
    }
  }

  // Sıralama
  onSort(column: keyof Opportunity): void {
    if (this.filter.sortBy === column) {
      this.filter.sortDirection =
        this.filter.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.filter.sortBy = column;
      this.filter.sortDirection = 'asc';
    }
    this.filterOpportunities();
  }

  // Sıralama ikonu
  getSortIcon(column: string): string {
    if (this.filter.sortBy !== column) return 'bi-arrow-down-up';
    return this.filter.sortDirection === 'asc'
      ? 'bi-arrow-up'
      : 'bi-arrow-down';
  }

  // Durum badge sınıfı
  getStatusBadgeClass(status: OpportunityStatus): string {
    switch (status) {
      case 'Yeni':
        return 'bg-info';
      case 'Görüşülüyor':
        return 'bg-primary';
      case 'Teklif Aşamasında':
        return 'bg-warning';
      case 'Kazanıldı':
        return 'bg-success';
      case 'Kaybedildi':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  // Olasılık badge sınıfı
  getProbabilityBadgeClass(probability: number): string {
    if (probability >= 75) return 'bg-success';
    if (probability >= 50) return 'bg-warning';
    if (probability >= 25) return 'bg-info';
    return 'bg-danger';
  }

  // Filtreleme
  filterOpportunities(): void {
    let filtered = [...this.opportunities];

    // Arama filtresi
    if (this.filter.searchTerm) {
      const searchLower = this.filter.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(searchLower) ||
          opp.description.toLowerCase().includes(searchLower)
      );
    }

    // Durum filtresi
    if (this.filter.status) {
      filtered = filtered.filter((opp) => opp.status === this.filter.status);
    }

    // Sıralama
    filtered.sort((a, b) => {
      const aValue = a[this.filter.sortBy];
      const bValue = b[this.filter.sortBy];
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

    this.opportunities = filtered;
    if (this.viewMode === 'kanban') {
      this.updateKanbanGroups();
    }
  }

  // Fırsat işlemleri
  addOpportunity(): void {
    // Yeni fırsat ekleme sayfasına yönlendir
  }

  editOpportunity(opportunity: Opportunity): void {
    // Fırsat düzenleme sayfasına yönlendir
  }

  deleteOpportunity(opportunity: Opportunity): void {
    // Silme modalını göster
  }

  viewOpportunity(opportunity: Opportunity): void {
    // Fırsat detay sayfasına yönlendir
  }
}

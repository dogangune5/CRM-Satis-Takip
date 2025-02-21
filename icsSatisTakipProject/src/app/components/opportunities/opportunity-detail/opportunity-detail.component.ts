import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Opportunity,
  OpportunityStatus,
} from '../../../interfaces/opportunity.interface';

@Component({
  selector: 'app-opportunity-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './opportunity-detail.component.html',
  styleUrls: ['./opportunity-detail.component.css'],
})
export class OpportunityDetailComponent implements OnInit {
  opportunity: Opportunity = {
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
  };

  activities = [
    {
      id: 1,
      type: 'Görüşme',
      title: 'İlk Görüşme',
      description: 'Müşteri ile proje kapsamı görüşüldü',
      date: new Date(),
      status: 'Tamamlandı',
    },
    {
      id: 2,
      type: 'Teklif',
      title: 'Teklif Hazırlandı',
      description: 'Proje için ilk teklif hazırlandı',
      date: new Date(Date.now() - 86400000), // 1 gün önce
      status: 'Beklemede',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

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

  // Aktivite ikonu
  getActivityIcon(type: string): string {
    switch (type) {
      case 'Görüşme':
        return 'bi bi-calendar-event';
      case 'Teklif':
        return 'bi bi-file-earmark-text';
      case 'Not':
        return 'bi bi-journal-text';
      default:
        return 'bi bi-circle';
    }
  }

  // Aktivite durum badge sınıfı
  getActivityStatusClass(status: string): string {
    switch (status) {
      case 'Tamamlandı':
        return 'bg-success';
      case 'Beklemede':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  // Fırsat düzenleme
  editOpportunity(): void {
    // Düzenleme sayfasına yönlendir
  }

  // Yeni aktivite ekleme
  addActivity(): void {
    // Aktivite ekleme modalını göster
  }

  // Aktivite detayı görüntüleme
  viewActivity(activityId: number): void {
    // Aktivite detay modalını göster
  }
}

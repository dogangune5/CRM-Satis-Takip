import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Proposal,
  ProposalStatus,
  ProposalItem,
} from '../../../interfaces/proposal.interface';

@Component({
  selector: 'app-proposal-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'proposal-detail.component.html',
  styleUrls: ['proposal-detail.component.css'],
})
export class ProposalDetailComponent implements OnInit {
  proposal: Proposal = {
    id: 1,
    proposalNumber: 'TEK-2024-001',
    customerId: 1,
    opportunityId: 1,
    title: 'E-ticaret Sistemi Teklifi',
    description: 'B2B E-ticaret platformu geliştirme projesi için teklif',
    status: 'Görüşülüyor',
    validUntil: new Date('2024-06-30'),
    items: [
      {
        id: 1,
        proposalId: 1,
        type: 'Proje',
        name: 'E-ticaret Yazılımı',
        description: 'Özel geliştirme B2B e-ticaret platformu',
        quantity: 1,
        unitPrice: 150000,
        tax: 20,
        discount: 10,
        total: 162000,
      },
      {
        id: 2,
        proposalId: 1,
        type: 'Hizmet',
        name: 'Kurulum ve Eğitim',
        description: 'Sistem kurulumu ve kullanıcı eğitimi',
        quantity: 1,
        unitPrice: 15000,
        tax: 20,
        total: 18000,
      },
    ],
    subTotal: 165000,
    taxTotal: 33000,
    discountTotal: 15000,
    grandTotal: 183000,
    terms:
      '1. Ödeme: %40 peşin, %30 geliştirme sürecinde, %30 teslimde\n2. Geliştirme süresi: 3 ay\n3. 1 yıl ücretsiz destek',
    notes: 'Müşteri ile ilk görüşme yapıldı, teknik detaylar netleştirildi.',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 1,
    updatedBy: 1,
  };

  activities = [
    {
      id: 1,
      type: 'Oluşturma',
      title: 'Teklif Oluşturuldu',
      description: 'Teklif taslağı hazırlandı',
      date: new Date(),
      status: 'Tamamlandı',
    },
    {
      id: 2,
      type: 'Gönderim',
      title: 'Teklif Gönderildi',
      description: 'Müşteriye e-posta ile iletildi',
      date: new Date(Date.now() - 86400000), // 1 gün önce
      status: 'Tamamlandı',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

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

  // Aktivite ikonu
  getActivityIcon(type: string): string {
    switch (type) {
      case 'Oluşturma':
        return 'bi bi-plus-circle';
      case 'Gönderim':
        return 'bi bi-send';
      case 'Revizyon':
        return 'bi bi-pencil';
      case 'Onay':
        return 'bi bi-check-circle';
      case 'Red':
        return 'bi bi-x-circle';
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

  // Teklif düzenleme
  editProposal(): void {
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

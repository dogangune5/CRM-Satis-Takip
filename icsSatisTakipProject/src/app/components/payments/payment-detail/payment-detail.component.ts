import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Payment,
  PaymentStatus,
  PaymentType,
} from '../../../interfaces/payment.interface';

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css'],
})
export class PaymentDetailComponent implements OnInit {
  payment: Payment = {
    id: 1,
    paymentNumber: 'ODM-2024-001',
    customerId: 1,
    orderId: 1,
    type: 'Kredi Kartı',
    amount: 5000,
    status: 'Onaylandı',
    paymentDate: new Date(),
    description: 'Sipariş ödemesi',
    notes: 'Ödeme notları...',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 1,
    updatedBy: 1,
  };

  activities = [
    {
      id: 1,
      type: 'Oluşturma',
      title: 'Ödeme Oluşturuldu',
      description: 'Ödeme sisteme kaydedildi',
      date: new Date(),
      status: 'Tamamlandı',
    },
    {
      id: 2,
      type: 'Durum',
      title: 'Durum Güncellendi',
      description: 'Ödeme durumu "Onaylandı" olarak güncellendi',
      date: new Date(Date.now() - 86400000), // 1 gün önce
      status: 'Tamamlandı',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

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
        return 'bg-primary';
      case 'Havale/EFT':
        return 'bg-info';
      case 'Çek':
        return 'bg-warning';
      case 'Senet':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  // Aktivite ikonu
  getActivityIcon(type: string): string {
    switch (type) {
      case 'Oluşturma':
        return 'bi bi-plus-circle';
      case 'Durum':
        return 'bi bi-arrow-repeat';
      case 'Güncelleme':
        return 'bi bi-pencil';
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

  // Ödeme düzenleme
  editPayment(): void {
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

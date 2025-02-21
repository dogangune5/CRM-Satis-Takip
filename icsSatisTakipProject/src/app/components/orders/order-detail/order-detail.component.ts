import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  Order,
  OrderStatus,
  OrderItem,
} from '../../../interfaces/order.interface';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
})
export class OrderDetailComponent implements OnInit {
  order: Order = {
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
  };

  activities = [
    {
      id: 1,
      type: 'Oluşturma',
      title: 'Sipariş Oluşturuldu',
      description: 'Sipariş sisteme kaydedildi',
      date: new Date(),
      status: 'Tamamlandı',
    },
    {
      id: 2,
      type: 'Durum',
      title: 'Durum Güncellendi',
      description: 'Sipariş durumu "Onaylandı" olarak güncellendi',
      date: new Date(Date.now() - 86400000), // 1 gün önce
      status: 'Tamamlandı',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

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

  // Aktivite ikonu
  getActivityIcon(type: string): string {
    switch (type) {
      case 'Oluşturma':
        return 'bi bi-plus-circle';
      case 'Durum':
        return 'bi bi-arrow-repeat';
      case 'Güncelleme':
        return 'bi bi-pencil';
      case 'Teslimat':
        return 'bi bi-truck';
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

  // Sipariş düzenleme
  editOrder(): void {
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

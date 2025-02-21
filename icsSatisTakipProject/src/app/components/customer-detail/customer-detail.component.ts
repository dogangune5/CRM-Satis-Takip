import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from '../../interfaces/customer.interface';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css'],
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer = {
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
    description: 'Örnek müşteri açıklaması',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  activities = [
    {
      id: 1,
      type: 'Teklif',
      title: 'Yeni Teklif Oluşturuldu',
      description: 'E-ticaret sistemi için teklif hazırlandı',
      date: new Date(),
      status: 'Beklemede',
    },
    {
      id: 2,
      type: 'Görüşme',
      title: 'Müşteri Toplantısı',
      description: 'Proje detayları görüşüldü',
      date: new Date(Date.now() - 86400000), // 1 gün önce
      status: 'Tamamlandı',
    },
    {
      id: 3,
      type: 'Ödeme',
      title: 'Fatura Ödemesi',
      description: 'Aylık bakım ücreti ödendi',
      date: new Date(Date.now() - 172800000), // 2 gün önce
      status: 'Tamamlandı',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  // İletişim bilgisi ikonu
  getContactIcon(type: string): string {
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

  // Aktivite ikonu
  getActivityIcon(type: string): string {
    switch (type) {
      case 'Teklif':
        return 'bi bi-file-earmark-text';
      case 'Görüşme':
        return 'bi bi-calendar-event';
      case 'Ödeme':
        return 'bi bi-credit-card';
      default:
        return 'bi bi-circle';
    }
  }

  // Aktivite durum badge sınıfı
  getActivityStatusClass(status: string): string {
    switch (status) {
      case 'Beklemede':
        return 'bg-warning';
      case 'Tamamlandı':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  // Müşteri düzenleme
  editCustomer(): void {
    // Düzenleme işlemi
  }

  // Yeni aktivite ekleme
  addActivity(): void {
    // Aktivite ekleme işlemi
  }

  // Aktivite detayı görüntüleme
  viewActivity(activityId: number): void {
    // Aktivite detay görüntüleme işlemi
  }
}

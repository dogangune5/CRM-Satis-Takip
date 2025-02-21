import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import {
  Customer,
  LeadType,
  CustomerStatus,
} from '../../interfaces/customer.interface';

Chart.register(...registerables);

interface SalesData {
  month: string;
  sales: number;
  target: number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChartCanvas!: ElementRef<HTMLCanvasElement>;
  salesChart: Chart | undefined;

  // Son müşteriler listesi
  recentCustomers: Customer[] = [
    {
      id: 1,
      customerNumber: 'CUS001',
      leadType: 'Kurumsal',
      name: 'Ahmet Yılmaz',
      company: 'Teknoloji Ltd.',
      status: 'Aktif',
      contacts: [],
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      customerNumber: 'CUS002',
      leadType: 'Bireysel',
      name: 'Ayşe Demir',
      company: 'Demir İnşaat',
      status: 'Potansiyel',
      contacts: [],
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      customerNumber: 'CUS003',
      leadType: 'Kurumsal',
      name: 'Mehmet Kaya',
      company: 'Kaya Holding',
      status: 'Aktif',
      contacts: [],
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Örnek veri
  salesData: SalesData[] = [
    { month: 'Ocak', sales: 65000, target: 70000 },
    { month: 'Şubat', sales: 72000, target: 70000 },
    { month: 'Mart', sales: 85000, target: 75000 },
    { month: 'Nisan', sales: 95000, target: 80000 },
    { month: 'Mayıs', sales: 102000, target: 85000 },
    { month: 'Haziran', sales: 108000, target: 90000 },
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initSalesChart();
  }

  // Müşteri tipi badge sınıfı
  getLeadTypeBadgeClass(leadType: LeadType): string {
    switch (leadType) {
      case 'Kurumsal':
        return 'bg-info';
      case 'Bireysel':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  // Durum badge sınıfı
  getStatusBadgeClass(status: CustomerStatus): string {
    switch (status) {
      case 'Aktif':
        return 'bg-success';
      case 'Pasif':
        return 'bg-danger';
      case 'Potansiyel':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  private initSalesChart(): void {
    const ctx = this.salesChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Grafik verilerini hazırla
    const labels = this.salesData.map((data) => data.month);
    const salesValues = this.salesData.map((data) => data.sales);
    const targetValues = this.salesData.map((data) => data.target);

    // Grafik oluştur
    this.salesChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Gerçekleşen Satış',
            data: salesValues,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Hedef',
            data: targetValues,
            borderColor: '#ffc107',
            borderWidth: 2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#e9ecef',
            },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#495057',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: '#e9ecef',
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: '#e9ecef',
              callback: function (value) {
                return '₺' + value.toLocaleString('tr-TR');
              },
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'index',
        },
      },
    });
  }

  // Component yok edildiğinde grafiği temizle
  ngOnDestroy(): void {
    if (this.salesChart) {
      this.salesChart.destroy();
    }
  }
}

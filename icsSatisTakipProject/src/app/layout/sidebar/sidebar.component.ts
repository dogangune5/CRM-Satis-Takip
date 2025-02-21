import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  menuItems = [
    { icon: 'bi-speedometer2', label: 'Dashboard', route: '/dashboard' },
    { icon: 'bi-people', label: 'Müşteriler', route: '/customers' },
    { icon: 'bi-graph-up', label: 'Fırsatlar', route: '/opportunities' },
    { icon: 'bi-file-text', label: 'Teklifler', route: '/proposals' },
    { icon: 'bi-cart', label: 'Siparişler', route: '/orders' },
    { icon: 'bi-credit-card', label: 'Ödemeler', route: '/payments' },
  ];
}

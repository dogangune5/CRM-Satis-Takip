import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Customer } from '../../models/database.types';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Müşteriler</h2>
        <button class="btn btn-primary" (click)="addNewCustomer()">
          <i class="bi bi-plus"></i> Yeni Müşteri
        </button>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input
                type="text"
                class="form-control"
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearch()"
                placeholder="Müşteri Ara..."
              />
            </div>
          </div>
        </div>
      </div>

      @if (isLoading) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
      } @else if (error) {
      <div class="alert alert-danger" role="alert">
        {{ error }}
      </div>
      } @else if (customers.length === 0) {
      <div class="alert alert-info" role="alert">
        Henüz müşteri bulunmamaktadır.
      </div>
      } @else {
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>İsim</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Adres</th>
              <th>Oluşturulma Tarihi</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            @for (customer of customers; track customer.id) {
            <tr>
              <td>{{ customer.name }}</td>
              <td>{{ customer.email || '-' }}</td>
              <td>{{ customer.phone || '-' }}</td>
              <td>{{ customer.address || '-' }}</td>
              <td>{{ customer.created_at | date : 'dd/MM/yyyy HH:mm' }}</td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    (click)="viewCustomer(customer)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    (click)="editCustomer(customer)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    (click)="deleteCustomer(customer)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .btn-group {
        gap: 0.25rem;
      }
    `,
  ],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadCustomers();
  }

  async loadCustomers(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      this.customers = await this.customerService.getAll();
    } catch (error) {
      console.error('Error loading customers:', error);
      this.error = 'Müşteriler yüklenirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  async onSearch(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      if (this.searchTerm.trim()) {
        this.customers = await this.customerService.searchCustomers(
          this.searchTerm
        );
      } else {
        this.customers = await this.customerService.getAll();
      }
    } catch (error) {
      console.error('Error searching customers:', error);
      this.error = 'Müşteriler aranırken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  addNewCustomer(): void {
    this.router.navigate(['/customers/new']);
  }

  viewCustomer(customer: Customer): void {
    this.router.navigate(['/customers', customer.id]);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/customers', customer.id, 'edit']);
  }

  async deleteCustomer(customer: Customer): Promise<void> {
    if (
      !confirm(
        `${customer.name} müşterisini silmek istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      await this.customerService.delete(customer.id);
      await this.loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      this.error = 'Müşteri silinirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }
}

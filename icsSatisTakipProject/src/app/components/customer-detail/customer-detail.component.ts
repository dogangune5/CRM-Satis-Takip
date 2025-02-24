import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../models/database.types';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      @if (isLoading) {
      <div class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
      } @else if (error) {
      <div class="alert alert-danger" role="alert">
        {{ error }}
        <button class="btn btn-link" (click)="goBack()">Geri Dön</button>
      </div>
      } @else if (customer) {
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <h3 class="mb-0">{{ customer.name }}</h3>
              <div>
                <button class="btn btn-primary me-2" (click)="editCustomer()">
                  <i class="bi bi-pencil"></i> Düzenle
                </button>
                <button class="btn btn-danger" (click)="deleteCustomer()">
                  <i class="bi bi-trash"></i> Sil
                </button>
              </div>
            </div>
            <div class="card-body">
              <div class="row mb-3">
                <div class="col-md-4">
                  <strong>E-posta:</strong>
                </div>
                <div class="col-md-8">
                  {{ customer.email || '-' }}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-4">
                  <strong>Telefon:</strong>
                </div>
                <div class="col-md-8">
                  {{ customer.phone || '-' }}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-4">
                  <strong>Adres:</strong>
                </div>
                <div class="col-md-8">
                  {{ customer.address || '-' }}
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-4">
                  <strong>Oluşturulma Tarihi:</strong>
                </div>
                <div class="col-md-8">
                  {{ customer.created_at | date : 'dd/MM/yyyy HH:mm' }}
                </div>
              </div>
            </div>
          </div>

          @if (customerProposals) {
          <div class="card mt-4">
            <div class="card-header">
              <h4 class="mb-0">Teklifler</h4>
            </div>
            <div class="card-body">
              @if (customerProposals.length === 0) {
              <p class="text-muted">Henüz teklif bulunmamaktadır.</p>
              } @else {
              <div class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>Durum</th>
                      <th>Toplam Tutar</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (proposal of customerProposals; track proposal.id) {
                    <tr>
                      <td>
                        {{ proposal.proposal_date | date : 'dd/MM/yyyy' }}
                      </td>
                      <td>
                        <span
                          class="badge"
                          [ngClass]="getProposalStatusClass(proposal.status)"
                        >
                          {{ getProposalStatusText(proposal.status) }}
                        </span>
                      </td>
                      <td>
                        {{
                          proposal.total_amount
                            | currency : 'TRY' : 'symbol-narrow' : '1.2-2'
                        }}
                      </td>
                      <td>
                        <button
                          class="btn btn-sm btn-outline-primary"
                          (click)="viewProposal(proposal.id)"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                    }
                  </tbody>
                </table>
              </div>
              }
            </div>
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .badge {
        padding: 0.5em 0.75em;
      }
    `,
  ],
})
export class CustomerDetailComponent implements OnInit {
  customer: Customer | null = null;
  customerProposals: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  async ngOnInit(): Promise<void> {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (!customerId) {
      this.error = 'Müşteri ID bulunamadı.';
      return;
    }

    await this.loadCustomerDetails(customerId);
  }

  private async loadCustomerDetails(customerId: string): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      const customerData = await this.customerService.getCustomerWithProposals(
        customerId
      );
      this.customer = customerData;
      this.customerProposals = customerData.proposals || [];
    } catch (error) {
      console.error('Error loading customer details:', error);
      this.error = 'Müşteri bilgileri yüklenirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  getProposalStatusClass(status: string): string {
    switch (status) {
      case 'draft':
        return 'bg-secondary';
      case 'pending':
        return 'bg-warning';
      case 'accepted':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getProposalStatusText(status: string): string {
    switch (status) {
      case 'draft':
        return 'Taslak';
      case 'pending':
        return 'Beklemede';
      case 'accepted':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  }

  editCustomer(): void {
    if (this.customer) {
      this.router.navigate(['/customers', this.customer.id, 'edit']);
    }
  }

  async deleteCustomer(): Promise<void> {
    if (
      !this.customer ||
      !confirm(
        `${this.customer.name} müşterisini silmek istediğinizden emin misiniz?`
      )
    ) {
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      await this.customerService.delete(this.customer.id);
      await this.router.navigate(['/customers']);
    } catch (error) {
      console.error('Error deleting customer:', error);
      this.error = 'Müşteri silinirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  viewProposal(proposalId: string): void {
    this.router.navigate(['/proposals', proposalId]);
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }
}

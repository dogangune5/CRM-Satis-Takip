import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Proposal } from '../../../models/database.types';
import { ProposalService } from '../../../services/proposal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-proposal-detail',
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
      } @else if (proposal) {
      <div class="card">
        <div
          class="card-header d-flex justify-content-between align-items-center"
        >
          <h3 class="mb-0">Teklif Detayı</h3>
          <div class="btn-group">
            @if (canEdit(proposal)) {
            <button class="btn btn-primary" (click)="editProposal()">
              <i class="bi bi-pencil"></i> Düzenle
            </button>
            <button class="btn btn-danger" (click)="deleteProposal()">
              <i class="bi bi-trash"></i> Sil
            </button>
            }
            <button class="btn btn-secondary" (click)="goBack()">
              <i class="bi bi-arrow-left"></i> Geri
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="row mb-4">
            <div class="col-md-6">
              <h5>Müşteri Bilgileri</h5>
              <p class="mb-1">
                <strong>İsim:</strong> {{ proposal.customer?.name }}
              </p>
              <p class="mb-1">
                <strong>E-posta:</strong> {{ proposal.customer?.email || '-' }}
              </p>
              <p class="mb-1">
                <strong>Telefon:</strong> {{ proposal.customer?.phone || '-' }}
              </p>
              <p class="mb-1">
                <strong>Adres:</strong> {{ proposal.customer?.address || '-' }}
              </p>
            </div>
            <div class="col-md-6">
              <h5>Teklif Bilgileri</h5>
              <p class="mb-1">
                <strong>Durum:</strong>
                <span
                  class="badge ms-2"
                  [ngClass]="getStatusClass(proposal.status)"
                >
                  {{ getStatusText(proposal.status) }}
                </span>
              </p>
              <p class="mb-1">
                <strong>Tarih:</strong>
                {{ proposal.proposal_date | date : 'dd/MM/yyyy' }}
              </p>
              <p class="mb-1">
                <strong>Toplam Tutar:</strong>
                {{
                  proposal.total_amount
                    | currency : 'TRY' : 'symbol-narrow' : '1.2-2'
                }}
              </p>
            </div>
          </div>

          <h5>Ürünler</h5>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Miktar</th>
                  <th>Birim Fiyat</th>
                  <th>Toplam</th>
                </tr>
              </thead>
              <tbody>
                @for (detail of proposal.details; track detail.id) {
                <tr>
                  <td>{{ detail.product?.name }}</td>
                  <td>{{ detail.quantity }}</td>
                  <td>
                    {{
                      detail.unit_price
                        | currency : 'TRY' : 'symbol-narrow' : '1.2-2'
                    }}
                  </td>
                  <td>
                    {{
                      detail.quantity * detail.unit_price
                        | currency : 'TRY' : 'symbol-narrow' : '1.2-2'
                    }}
                  </td>
                </tr>
                }
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-end"><strong>Toplam:</strong></td>
                  <td>
                    {{
                      proposal.total_amount
                        | currency : 'TRY' : 'symbol-narrow' : '1.2-2'
                    }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          @if (canEdit(proposal)) {
          <div class="mt-4">
            <h5>Durum Güncelle</h5>
            <div class="btn-group">
              @for (status of availableStatuses; track status) {
              <button
                class="btn"
                [class.btn-outline-secondary]="proposal.status !== status"
                [class.btn-secondary]="proposal.status === status"
                (click)="updateStatus(status)"
                [disabled]="isUpdating"
              >
                {{ getStatusText(status) }}
              </button>
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
      .btn-group {
        gap: 0.25rem;
      }
      .badge {
        padding: 0.5em 0.75em;
      }
    `,
  ],
})
export class ProposalDetailComponent implements OnInit {
  proposal: any = null;
  isLoading = false;
  isUpdating = false;
  error: string | null = null;
  availableStatuses: Proposal['status'][] = [
    'draft',
    'pending',
    'accepted',
    'rejected',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proposalService: ProposalService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    const proposalId = this.route.snapshot.paramMap.get('id');
    if (!proposalId) {
      this.error = 'Teklif ID bulunamadı.';
      return;
    }

    await this.loadProposal(proposalId);
  }

  private async loadProposal(id: string): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      this.proposal = await this.proposalService.getProposalWithDetails(id);
    } catch (error) {
      console.error('Error loading proposal:', error);
      this.error = 'Teklif yüklenirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  getStatusClass(status: string): string {
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

  getStatusText(status: string): string {
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

  canEdit(proposal: Proposal): boolean {
    if (this.authService.isAdmin()) return true;
    return proposal.created_by === this.authService.getCurrentUserId();
  }

  async updateStatus(status: Proposal['status']): Promise<void> {
    if (!this.proposal || this.isUpdating) return;

    try {
      this.isUpdating = true;
      this.error = null;
      await this.proposalService.updateProposalStatus(this.proposal.id, status);
      await this.loadProposal(this.proposal.id);
    } catch (error) {
      console.error('Error updating proposal status:', error);
      this.error = 'Teklif durumu güncellenirken bir hata oluştu.';
    } finally {
      this.isUpdating = false;
    }
  }

  editProposal(): void {
    if (this.proposal) {
      this.router.navigate(['/proposals', this.proposal.id, 'edit']);
    }
  }

  async deleteProposal(): Promise<void> {
    if (
      !this.proposal ||
      !confirm('Bu teklifi silmek istediğinizden emin misiniz?')
    ) {
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      await this.proposalService.delete(this.proposal.id);
      await this.router.navigate(['/proposals']);
    } catch (error) {
      console.error('Error deleting proposal:', error);
      this.error = 'Teklif silinirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/proposals']);
  }
}

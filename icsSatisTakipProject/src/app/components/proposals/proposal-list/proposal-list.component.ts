import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Proposal } from '../../../models/database.types';
import { ProposalService } from '../../../services/proposal.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-proposal-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Teklifler</h2>
        <button class="btn btn-primary" (click)="createProposal()">
          <i class="bi bi-plus"></i> Yeni Teklif
        </button>
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
      } @else if (proposals.length === 0) {
      <div class="alert alert-info" role="alert">
        Henüz teklif bulunmamaktadır.
      </div>
      } @else {
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Müşteri</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th>Toplam Tutar</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            @for (proposal of proposals; track proposal.id) {
            <tr>
              <td>{{ proposal.customer?.name }}</td>
              <td>{{ proposal.proposal_date | date : 'dd/MM/yyyy' }}</td>
              <td>
                <span class="badge" [ngClass]="getStatusClass(proposal.status)">
                  {{ getStatusText(proposal.status) }}
                </span>
              </td>
              <td>
                {{
                  proposal.total_amount
                    | currency : 'TRY' : 'symbol-narrow' : '1.2-2'
                }}
              </td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-sm btn-outline-primary"
                    (click)="viewProposal(proposal.id)"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  @if (canEdit(proposal)) {
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    (click)="editProposal(proposal.id)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger"
                    (click)="deleteProposal(proposal)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                  }
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
      .badge {
        padding: 0.5em 0.75em;
      }
    `,
  ],
})
export class ProposalListComponent implements OnInit {
  proposals: Proposal[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private proposalService: ProposalService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadProposals();
  }

  private async loadProposals(): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      this.proposals = await this.proposalService.getMyProposals();
    } catch (error) {
      console.error('Error loading proposals:', error);
      this.error = 'Teklifler yüklenirken bir hata oluştu.';
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

  createProposal(): void {
    this.router.navigate(['/proposals/new']);
  }

  viewProposal(id: string): void {
    this.router.navigate(['/proposals', id]);
  }

  editProposal(id: string): void {
    this.router.navigate(['/proposals', id, 'edit']);
  }

  async deleteProposal(proposal: Proposal): Promise<void> {
    if (!confirm(`Bu teklifi silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;
      await this.proposalService.delete(proposal.id);
      await this.loadProposals();
    } catch (error) {
      console.error('Error deleting proposal:', error);
      this.error = 'Teklif silinirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }
}

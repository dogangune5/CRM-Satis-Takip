import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Proposal } from '../../../models/database.types';
import { ProposalService } from '../../../services/proposal.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-proposal-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h3 class="mb-0">
            {{ isEditMode ? 'Teklif Düzenle' : 'Yeni Teklif' }}
          </h3>
        </div>
        <div class="card-body">
          @if (error) {
          <div class="alert alert-danger mb-4">{{ error }}</div>
          }

          <form [formGroup]="proposalForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Müşteri</label>
                <select
                  class="form-select"
                  formControlName="customer_id"
                  [class.is-invalid]="isFieldInvalid('customer_id')"
                >
                  <option value="">Müşteri Seçin</option>
                  @for (customer of customers; track customer.id) {
                  <option [value]="customer.id">{{ customer.name }}</option>
                  }
                </select>
                @if (isFieldInvalid('customer_id')) {
                <div class="invalid-feedback">Müşteri seçimi zorunludur</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Teklif Tarihi</label>
                <input
                  type="date"
                  class="form-control"
                  formControlName="proposal_date"
                  [class.is-invalid]="isFieldInvalid('proposal_date')"
                />
                @if (isFieldInvalid('proposal_date')) {
                <div class="invalid-feedback">Teklif tarihi zorunludur</div>
                }
              </div>

              <div class="col-12">
                <h5 class="mb-3">Ürünler</h5>
                <div formArrayName="details">
                  @for (detail of details.controls; track $index) {
                  <div [formGroupName]="$index" class="row g-3 mb-3">
                    <div class="col-md-4">
                      <label class="form-label">Ürün</label>
                      <select
                        class="form-select"
                        formControlName="product_id"
                        [class.is-invalid]="
                          isDetailFieldInvalid($index, 'product_id')
                        "
                      >
                        <option value="">Ürün Seçin</option>
                        @for (product of products; track product.id) {
                        <option [value]="product.id">
                          {{ product.name }} -
                          {{
                            product.price
                              | currency : 'TRY' : 'symbol-narrow' : '1.2-2'
                          }}
                        </option>
                        }
                      </select>
                    </div>

                    <div class="col-md-3">
                      <label class="form-label">Miktar</label>
                      <input
                        type="number"
                        class="form-control"
                        formControlName="quantity"
                        min="1"
                        [class.is-invalid]="
                          isDetailFieldInvalid($index, 'quantity')
                        "
                      />
                    </div>

                    <div class="col-md-3">
                      <label class="form-label">Birim Fiyat</label>
                      <input
                        type="number"
                        class="form-control"
                        formControlName="unit_price"
                        min="0"
                        step="0.01"
                        [class.is-invalid]="
                          isDetailFieldInvalid($index, 'unit_price')
                        "
                      />
                    </div>

                    <div class="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        class="btn btn-danger"
                        (click)="removeDetail($index)"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  }

                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    (click)="addDetail()"
                  >
                    <i class="bi bi-plus"></i> Ürün Ekle
                  </button>
                </div>
              </div>

              <div class="col-12">
                <div class="d-flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="proposalForm.invalid || isLoading"
                  >
                    {{ isLoading ? 'Kaydediliyor...' : 'Kaydet' }}
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    (click)="onCancel()"
                    [disabled]="isLoading"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class ProposalFormComponent implements OnInit {
  proposalForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  error: string | null = null;
  customers: any[] = [];
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private proposalService: ProposalService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.proposalForm = this.createForm();
  }

  async ngOnInit(): Promise<void> {
    await this.loadCustomers();
    await this.loadProducts();

    const proposalId = this.route.snapshot.paramMap.get('id');
    if (proposalId) {
      this.isEditMode = true;
      await this.loadProposal(proposalId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      customer_id: ['', Validators.required],
      proposal_date: [
        new Date().toISOString().split('T')[0],
        Validators.required,
      ],
      details: this.fb.array([]),
    });
  }

  get details(): FormArray {
    return this.proposalForm.get('details') as FormArray;
  }

  private createDetailForm(): FormGroup {
    return this.fb.group({
      product_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unit_price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addDetail(): void {
    this.details.push(this.createDetailForm());
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  private async loadCustomers(): Promise<void> {
    try {
      this.customers = await this.customerService.getAll();
    } catch (error) {
      console.error('Error loading customers:', error);
      this.error = 'Müşteriler yüklenirken bir hata oluştu.';
    }
  }

  private async loadProducts(): Promise<void> {
    try {
      // TODO: Implement ProductService and load products
      this.products = [];
    } catch (error) {
      console.error('Error loading products:', error);
      this.error = 'Ürünler yüklenirken bir hata oluştu.';
    }
  }

  private async loadProposal(id: string): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      const proposal = await this.proposalService.getProposalWithDetails(id);

      if (proposal) {
        this.proposalForm.patchValue({
          customer_id: proposal.customer_id,
          proposal_date: proposal.proposal_date,
        });

        // Clear existing details
        while (this.details.length) {
          this.details.removeAt(0);
        }

        // Add proposal details
        proposal.details?.forEach((detail) => {
          this.details.push(
            this.fb.group({
              product_id: [detail.product_id, Validators.required],
              quantity: [
                detail.quantity,
                [Validators.required, Validators.min(1)],
              ],
              unit_price: [
                detail.unit_price,
                [Validators.required, Validators.min(0)],
              ],
            })
          );
        });
      }
    } catch (error) {
      console.error('Error loading proposal:', error);
      this.error = 'Teklif yüklenirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.proposalForm.invalid || this.isLoading) {
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;

      const formValue = this.proposalForm.value;
      const total_amount = formValue.details.reduce(
        (sum: number, detail: any) => sum + detail.quantity * detail.unit_price,
        0
      );

      const proposalData = {
        ...formValue,
        total_amount,
        status: this.isEditMode ? undefined : 'draft',
      };

      if (this.isEditMode) {
        const proposalId = this.route.snapshot.paramMap.get('id');
        if (!proposalId) throw new Error('Proposal ID not found');
        await this.proposalService.update(proposalId, proposalData);
      } else {
        await this.proposalService.create(proposalData);
      }

      await this.router.navigate(['/proposals']);
    } catch (error) {
      console.error('Error saving proposal:', error);
      this.error = 'Teklif kaydedilirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/proposals']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.proposalForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  isDetailFieldInvalid(index: number, fieldName: string): boolean {
    const detail = this.details.at(index);
    const field = detail.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}

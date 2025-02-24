import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../models/database.types';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header">
          <h3 class="mb-0">
            {{ isEditMode ? 'Müşteri Düzenle' : 'Yeni Müşteri' }}
          </h3>
        </div>
        <div class="card-body">
          @if (error) {
          <div class="alert alert-danger mb-4">{{ error }}</div>
          }

          <form [formGroup]="customerForm" (ngSubmit)="onSubmit()">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">İsim</label>
                <input
                  type="text"
                  class="form-control"
                  formControlName="name"
                  [class.is-invalid]="isFieldInvalid('name')"
                />
                @if (isFieldInvalid('name')) {
                <div class="invalid-feedback">İsim alanı zorunludur</div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">E-posta</label>
                <input
                  type="email"
                  class="form-control"
                  formControlName="email"
                  [class.is-invalid]="isFieldInvalid('email')"
                />
                @if (isFieldInvalid('email')) {
                <div class="invalid-feedback">
                  Geçerli bir e-posta adresi giriniz
                </div>
                }
              </div>

              <div class="col-md-6">
                <label class="form-label">Telefon</label>
                <input
                  type="tel"
                  class="form-control"
                  formControlName="phone"
                />
              </div>

              <div class="col-12">
                <label class="form-label">Adres</label>
                <textarea
                  class="form-control"
                  formControlName="address"
                  rows="3"
                ></textarea>
              </div>

              <div class="col-12">
                <div class="d-flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="customerForm.invalid || isLoading"
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
export class CustomerFormComponent implements OnInit {
  customerForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.customerForm = this.createForm();
  }

  async ngOnInit(): Promise<void> {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.isEditMode = true;
      await this.loadCustomer(customerId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
    });
  }

  private async loadCustomer(id: string): Promise<void> {
    try {
      this.isLoading = true;
      this.error = null;
      const customer = await this.customerService.getById(id);
      if (customer) {
        this.customerForm.patchValue(customer);
      } else {
        this.error = 'Müşteri bulunamadı.';
      }
    } catch (error) {
      console.error('Error loading customer:', error);
      this.error = 'Müşteri yüklenirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.customerForm.invalid || this.isLoading) {
      return;
    }

    try {
      this.isLoading = true;
      this.error = null;

      const customerData = this.customerForm.value;

      if (this.isEditMode) {
        const customerId = this.route.snapshot.paramMap.get('id');
        if (!customerId) throw new Error('Customer ID not found');
        await this.customerService.update(customerId, customerData);
      } else {
        await this.customerService.create(customerData);
      }

      await this.router.navigate(['/customers']);
    } catch (error) {
      console.error('Error saving customer:', error);
      this.error = 'Müşteri kaydedilirken bir hata oluştu.';
    } finally {
      this.isLoading = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}

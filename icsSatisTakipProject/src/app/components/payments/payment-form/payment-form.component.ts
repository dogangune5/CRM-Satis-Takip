import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Payment,
  PaymentStatus,
  PaymentType,
} from '../../../interfaces/payment.interface';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: 'payment-form.component.html',
  styleUrls: ['payment-form.component.css'],
})
export class PaymentFormComponent implements OnInit {
  @Input() payment?: Payment;
  @Output() save = new EventEmitter<Payment>();
  @Output() cancel = new EventEmitter<void>();

  paymentForm: FormGroup;
  isEditMode = false;

  statuses: PaymentStatus[] = [
    'Bekliyor',
    'Onaylandı',
    'İptal Edildi',
    'İade Edildi',
    'Kısmi Ödeme',
  ];

  paymentTypes: PaymentType[] = [
    'Nakit',
    'Kredi Kartı',
    'Havale/EFT',
    'Çek',
    'Senet',
  ];

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.payment) {
      this.isEditMode = true;
      this.paymentForm.patchValue(this.payment);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      paymentNumber: ['', Validators.required],
      customerId: ['', Validators.required],
      orderId: [''],
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['Bekliyor', Validators.required],
      paymentDate: ['', Validators.required],
      dueDate: [''],
      description: [''],
      notes: [''],
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const formValue = this.paymentForm.value;
      const paymentData: Payment = {
        ...formValue,
        id: this.isEditMode ? this.payment!.id : Date.now(),
        createdAt: this.isEditMode ? this.payment!.createdAt : new Date(),
        updatedAt: new Date(),
        createdBy: this.isEditMode ? this.payment!.createdBy : 1,
        updatedBy: 1,
      };

      this.save.emit(paymentData);
    } else {
      this.markFormGroupTouched(this.paymentForm);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (field.hasError('min')) {
      return 'Değer 0\'dan büyük olmalıdır';
    }
    return '';
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 
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
  Opportunity,
  OpportunityStatus,
} from '../../../interfaces/opportunity.interface';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './opportunity-form.component.html',
  styleUrls: ['./opportunity-form.component.css'],
})
export class OpportunityFormComponent implements OnInit {
  @Input() opportunity?: Opportunity;
  @Output() save = new EventEmitter<Opportunity>();
  @Output() cancel = new EventEmitter<void>();

  opportunityForm: FormGroup;
  statuses: OpportunityStatus[] = [
    'Yeni',
    'Görüşülüyor',
    'Teklif Aşamasında',
    'Kazanıldı',
    'Kaybedildi',
  ];
  isEditMode = false;

  constructor(private fb: FormBuilder) {
    this.opportunityForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.opportunity) {
      this.isEditMode = true;
      this.opportunityForm.patchValue(this.opportunity);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      value: ['', [Validators.required, Validators.min(0)]],
      probability: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      status: ['Yeni', Validators.required],
      expectedCloseDate: ['', Validators.required],
      notes: [''],
    });
  }

  // Form gönderme
  onSubmit(): void {
    if (this.opportunityForm.valid) {
      const formValue = this.opportunityForm.value;

      const opportunityData: Opportunity = {
        ...formValue,
        id: this.isEditMode ? this.opportunity!.id : Date.now(),
        customerId: this.isEditMode ? this.opportunity!.customerId : 0, // Bu değer servis entegrasyonunda güncellenecek
        createdAt: this.isEditMode ? this.opportunity!.createdAt : new Date(),
        updatedAt: new Date(),
      };

      this.save.emit(opportunityData);
    } else {
      this.markFormGroupTouched(this.opportunityForm);
    }
  }

  // İptal
  onCancel(): void {
    this.cancel.emit();
  }

  // Form doğrulama yardımcı metodları
  isFieldInvalid(fieldName: string): boolean {
    const field = this.opportunityForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.opportunityForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    if (field.hasError('minlength')) {
      return 'En az 3 karakter giriniz';
    }
    if (field.hasError('min')) {
      return 'Geçerli bir değer giriniz';
    }
    if (field.hasError('max')) {
      return 'Maksimum 100 olabilir';
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

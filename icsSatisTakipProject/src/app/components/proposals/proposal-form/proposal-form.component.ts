import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import {
  Proposal,
  ProposalStatus,
  ProposalItem,
  ProposalItemType,
} from '../../../interfaces/proposal.interface';

@Component({
  selector: 'app-proposal-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './proposal-form.component.html',
  styleUrls: ['./proposal-form.component.css'],
})
export class ProposalFormComponent implements OnInit {
  @Input() proposal?: Proposal;
  @Output() save = new EventEmitter<Proposal>();
  @Output() cancel = new EventEmitter<void>();

  proposalForm: FormGroup;
  isEditMode = false;
  statuses: ProposalStatus[] = [
    'Taslak',
    'Gönderildi',
    'Görüşülüyor',
    'Revize Edildi',
    'Onaylandı',
    'Reddedildi',
  ];
  itemTypes: ProposalItemType[] = ['Ürün', 'Hizmet', 'Proje'];

  constructor(private fb: FormBuilder) {
    this.proposalForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.proposal) {
      this.isEditMode = true;
      this.proposalForm.patchValue(this.proposal);
      this.proposal.items.forEach((item) => this.addItem(item));
    } else {
      this.addItem();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      proposalNumber: [
        '',
        [Validators.required, Validators.pattern('^TEK-[0-9]{4}-[0-9]{3}$')],
      ],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['Taslak', Validators.required],
      validUntil: ['', Validators.required],
      items: this.fb.array([]),
      terms: [''],
      notes: [''],
    });
  }

  // Form dizileri için getter'lar
  get items(): FormArray {
    return this.proposalForm.get('items') as FormArray;
  }

  // Yeni kalem ekle
  addItem(item?: ProposalItem): void {
    const itemForm = this.fb.group({
      type: [item?.type || 'Ürün', Validators.required],
      name: [item?.name || '', Validators.required],
      description: [item?.description || ''],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [
        item?.unitPrice || 0,
        [Validators.required, Validators.min(0)],
      ],
      tax: [item?.tax || 18, [Validators.required, Validators.min(0)]],
      discount: [item?.discount || 0, [Validators.min(0), Validators.max(100)]],
      total: [{ value: item?.total || 0, disabled: true }],
    });

    itemForm.valueChanges.subscribe(() => {
      this.calculateItemTotal(itemForm);
      this.calculateTotals();
    });

    this.items.push(itemForm);
    this.calculateTotals();
  }

  // Kalem sil
  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  // Kalem toplamını hesapla
  private calculateItemTotal(itemForm: FormGroup): void {
    const quantity = itemForm.get('quantity')?.value || 0;
    const unitPrice = itemForm.get('unitPrice')?.value || 0;
    const tax = itemForm.get('tax')?.value || 0;
    const discount = itemForm.get('discount')?.value || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * tax) / 100;
    const total = subtotal - discountAmount + taxAmount;

    itemForm.patchValue({ total: total }, { emitEvent: false });
  }

  // Genel toplamları hesapla
  private calculateTotals(): void {
    let subTotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;
    let grandTotal = 0;

    this.items.controls.forEach((item) => {
      const quantity = item.get('quantity')?.value || 0;
      const unitPrice = item.get('unitPrice')?.value || 0;
      const tax = item.get('tax')?.value || 0;
      const discount = item.get('discount')?.value || 0;

      const itemSubtotal = quantity * unitPrice;
      const itemDiscount = (itemSubtotal * discount) / 100;
      const itemTax = ((itemSubtotal - itemDiscount) * tax) / 100;

      subTotal += itemSubtotal;
      taxTotal += itemTax;
      discountTotal += itemDiscount;
    });

    grandTotal = subTotal - discountTotal + taxTotal;

    this.proposalForm.patchValue(
      {
        subTotal,
        taxTotal,
        discountTotal,
        grandTotal,
      },
      { emitEvent: false }
    );
  }

  // Form gönderme
  onSubmit(): void {
    if (this.proposalForm.valid) {
      const formValue = this.proposalForm.value;
      const items = this.items.controls.map((item) => ({
        ...item.value,
        total: item.get('total')?.value,
      }));

      const proposalData: Proposal = {
        ...formValue,
        id: this.isEditMode ? this.proposal!.id : Date.now(),
        customerId: this.isEditMode ? this.proposal!.customerId : 0, // Bu değer servis entegrasyonunda güncellenecek
        items: items,
        createdAt: this.isEditMode ? this.proposal!.createdAt : new Date(),
        updatedAt: new Date(),
        createdBy: this.isEditMode ? this.proposal!.createdBy : 1, // Bu değer auth servisinden alınacak
        updatedBy: 1, // Bu değer auth servisinden alınacak
      };

      this.save.emit(proposalData);
    } else {
      this.markFormGroupTouched(this.proposalForm);
    }
  }

  // İptal
  onCancel(): void {
    this.cancel.emit();
  }

  // Form doğrulama yardımcı metodları
  isFieldInvalid(fieldName: string): boolean {
    const field = this.proposalForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.proposalForm.get(fieldName);
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
      return 'Maksimum değeri aştınız';
    }
    if (field.hasError('pattern')) {
      return 'Geçerli bir format giriniz (Örn: TEK-2024-001)';
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

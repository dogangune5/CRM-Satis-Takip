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
  Order,
  OrderStatus,
  OrderItem,
  OrderItemType,
} from '../../../interfaces/order.interface';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
})
export class OrderFormComponent implements OnInit {
  @Input() order?: Order;
  @Output() save = new EventEmitter<Order>();
  @Output() cancel = new EventEmitter<void>();

  orderForm: FormGroup;
  isEditMode = false;

  statuses: OrderStatus[] = [
    'Yeni',
    'Onay Bekliyor',
    'Onaylandı',
    'Hazırlanıyor',
    'Kargoya Verildi',
    'Tamamlandı',
    'İptal Edildi',
  ];

  itemTypes: OrderItemType[] = ['Ürün', 'Hizmet', 'Proje'];

  constructor(private fb: FormBuilder) {
    this.orderForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.order) {
      this.isEditMode = true;
      this.orderForm.patchValue(this.order);
      this.order.items.forEach((item) => this.addItem(item));
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      orderNumber: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: ['Yeni', Validators.required],
      orderDate: [new Date().toISOString().split('T')[0], Validators.required],
      deliveryDate: [''],
      items: this.fb.array([]),
      shippingAddress: ['', Validators.required],
      billingAddress: ['', Validators.required],
      notes: [''],
    });
  }

  // Form Array Getter
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  // Yeni Kalem Ekleme
  addItem(item?: OrderItem): void {
    const itemForm = this.fb.group({
      type: [item?.type || 'Ürün', Validators.required],
      name: [item?.name || '', Validators.required],
      description: [item?.description || ''],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [
        item?.unitPrice || 0,
        [Validators.required, Validators.min(0)],
      ],
      tax: [
        item?.tax || 18,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      discount: [item?.discount || 0, [Validators.min(0), Validators.max(100)]],
      total: [{ value: item?.total || 0, disabled: true }],
    });

    itemForm.valueChanges.subscribe(() => {
      this.calculateItemTotal(itemForm);
    });

    this.items.push(itemForm);
    this.calculateTotals();
  }

  // Kalem Silme
  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  // Kalem Toplam Hesaplama
  private calculateItemTotal(itemForm: FormGroup): void {
    const quantity = itemForm.get('quantity')?.value || 0;
    const unitPrice = itemForm.get('unitPrice')?.value || 0;
    const tax = itemForm.get('tax')?.value || 0;
    const discount = itemForm.get('discount')?.value || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * tax) / 100;
    const total = taxableAmount + taxAmount;

    itemForm.patchValue({ total }, { emitEvent: false });
    this.calculateTotals();
  }

  // Genel Toplamları Hesaplama
  private calculateTotals(): void {
    let subTotal = 0;
    let taxTotal = 0;
    let discountTotal = 0;
    let grandTotal = 0;

    this.items.controls.forEach((control) => {
      const item = control.value;
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const tax = item.tax || 0;
      const discount = item.discount || 0;

      const itemSubtotal = quantity * unitPrice;
      const itemDiscount = (itemSubtotal * discount) / 100;
      const taxableAmount = itemSubtotal - itemDiscount;
      const itemTax = (taxableAmount * tax) / 100;

      subTotal += itemSubtotal;
      taxTotal += itemTax;
      discountTotal += itemDiscount;
      grandTotal += taxableAmount + itemTax;
    });

    this.orderForm.patchValue(
      {
        subTotal,
        taxTotal,
        discountTotal,
        grandTotal,
      },
      { emitEvent: false }
    );
  }

  // Form Gönderme
  onSubmit(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.getRawValue();
      const orderData: Order = {
        ...formValue,
        id: this.isEditMode ? this.order!.id : Date.now(),
        customerId: this.isEditMode ? this.order!.customerId : 1, // Geçici olarak 1 atandı
        createdAt: this.isEditMode ? this.order!.createdAt : new Date(),
        updatedAt: new Date(),
        createdBy: this.isEditMode ? this.order!.createdBy : 1, // Geçici olarak 1 atandı
        updatedBy: 1, // Geçici olarak 1 atandı
      };

      this.save.emit(orderData);
    } else {
      this.markFormGroupTouched(this.orderForm);
    }
  }

  // İptal
  onCancel(): void {
    this.cancel.emit();
  }

  // Form Doğrulama Yardımcıları
  isFieldInvalid(fieldName: string): boolean {
    const field = this.orderForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.orderForm.get(fieldName);
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

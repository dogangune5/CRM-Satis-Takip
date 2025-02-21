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
  Customer,
  CustomerStatus,
  LeadType,
  ContactType,
} from '../../interfaces/customer.interface';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
})
export class CustomerFormComponent implements OnInit {
  @Input() customer?: Customer;
  @Output() save = new EventEmitter<Customer>();
  @Output() cancel = new EventEmitter<void>();

  customerForm: FormGroup;
  isEditMode = false;
  leadTypes: LeadType[] = ['Bireysel', 'Kurumsal'];
  statuses: CustomerStatus[] = ['Aktif', 'Pasif', 'Potansiyel'];
  contactTypes: ContactType[] = ['Telefon', 'Email', 'Yüz Yüze'];
  addressTypes = ['İş', 'Ev', 'Fatura'];

  constructor(private fb: FormBuilder) {
    this.customerForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.customer) {
      this.customerForm.patchValue(this.customer);

      // İletişim bilgilerini doldur
      this.customer.contacts.forEach((contact) => {
        this.addContact(contact);
      });

      // Adres bilgilerini doldur
      this.customer.addresses.forEach((address) => {
        this.addAddress(address);
      });
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      customerNumber: [
        '',
        [Validators.required, Validators.pattern('^[A-Z0-9]+$')],
      ],
      leadType: ['Bireysel', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      company: [''],
      taxNumber: [''],
      taxOffice: [''],
      status: ['Aktif', Validators.required],
      description: [''],
      contacts: this.fb.array([]),
      addresses: this.fb.array([]),
    });
  }

  // İletişim bilgileri için form array getter
  get contacts(): FormArray {
    return this.customerForm.get('contacts') as FormArray;
  }

  // Adres bilgileri için form array getter
  get addresses(): FormArray {
    return this.customerForm.get('addresses') as FormArray;
  }

  // Yeni iletişim bilgisi ekle
  addContact(contact?: any): void {
    const contactForm = this.fb.group({
      type: [contact?.type || 'Telefon', Validators.required],
      value: [contact?.value || '', Validators.required],
      description: [contact?.description || ''],
      isPrimary: [contact?.isPrimary || false],
    });

    this.contacts.push(contactForm);
  }

  // İletişim bilgisi sil
  removeContact(index: number): void {
    this.contacts.removeAt(index);
  }

  // Yeni adres ekle
  addAddress(address?: any): void {
    const addressForm = this.fb.group({
      type: [address?.type || 'İş', Validators.required],
      country: [address?.country || 'Türkiye', Validators.required],
      city: [address?.city || '', Validators.required],
      district: [address?.district || ''],
      address: [address?.address || '', Validators.required],
      postalCode: [
        address?.postalCode || '',
        [Validators.required, Validators.pattern('^[0-9]{5}$')],
      ],
      isPrimary: [address?.isPrimary || false],
    });

    this.addresses.push(addressForm);
  }

  // Adres sil
  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  // Primary iletişim bilgisini güncelle
  setPrimaryContact(index: number): void {
    const contacts = this.contacts.controls;
    contacts.forEach((contact, i) => {
      contact.get('isPrimary')?.setValue(i === index);
    });
  }

  // Primary adresi güncelle
  setPrimaryAddress(index: number): void {
    const addresses = this.addresses.controls;
    addresses.forEach((address, i) => {
      address.get('isPrimary')?.setValue(i === index);
    });
  }

  // Müşteri tipi değiştiğinde
  onLeadTypeChange(): void {
    const leadType = this.customerForm.get('leadType')?.value;
    const companyControl = this.customerForm.get('company');
    const taxNumberControl = this.customerForm.get('taxNumber');
    const taxOfficeControl = this.customerForm.get('taxOffice');

    if (leadType === 'Kurumsal') {
      companyControl?.setValidators([Validators.required]);
      taxNumberControl?.setValidators([
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
      ]);
      taxOfficeControl?.setValidators([Validators.required]);
    } else {
      companyControl?.clearValidators();
      taxNumberControl?.clearValidators();
      taxOfficeControl?.clearValidators();
    }

    companyControl?.updateValueAndValidity();
    taxNumberControl?.updateValueAndValidity();
    taxOfficeControl?.updateValueAndValidity();
  }

  // Formu gönder
  onSubmit(): void {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;

      // ID ve tarih bilgilerini ekle
      const customerData: Customer = {
        ...formValue,
        id: this.isEditMode ? formValue.id : Date.now(),
        createdAt: this.isEditMode ? formValue.createdAt : new Date(),
        updatedAt: new Date(),
      };

      this.save.emit(customerData);
      this.customerForm.reset();
      this.contacts.clear();
      this.addresses.clear();
    } else {
      this.markFormGroupTouched(this.customerForm);
    }
  }

  // İptal
  onCancel(): void {
    this.cancel.emit();
  }

  // Form validasyonu için yardımcı metod
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Form kontrolü için yardımcı metodlar
  isFieldInvalid(fieldName: string): boolean {
    const field = this.customerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.customerForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Bu alan zorunludur';
    }
    return '';
  }
}

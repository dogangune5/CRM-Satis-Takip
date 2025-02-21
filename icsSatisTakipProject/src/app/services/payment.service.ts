import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Payment } from '@app/interfaces';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends BaseService<Payment> {
  protected override endpoint = 'payments';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Özel ödeme metodları
  getPaymentsByOrder(orderId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.baseUrl}/${this.endpoint}/by-order/${orderId}`
    );
  }

  getPaymentsByType(paymentTypeCode: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(
      `${this.baseUrl}/${this.endpoint}/by-type/${paymentTypeCode}`
    );
  }
}

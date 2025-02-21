import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '@app/interfaces';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends BaseService<Order> {
  protected override endpoint = 'orders';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Özel sipariş metodları
  getOrdersByCustomer(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${this.endpoint}/by-customer/${customerId}`
    );
  }

  getOrdersByStatus(statusCode: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.baseUrl}/${this.endpoint}/by-status/${statusCode}`
    );
  }
}

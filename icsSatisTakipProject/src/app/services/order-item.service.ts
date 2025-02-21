import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderItem } from '@app/interfaces';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService extends BaseService<OrderItem> {
  protected override endpoint = 'order-items';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  getOrderItemsByOrder(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(
      `${this.baseUrl}/${this.endpoint}/by-order/${orderId}`
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Customer } from '@app/interfaces';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService<Customer> {
  protected override endpoint = 'customers';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Özel müşteri metodları
  getCustomersByLeadType(leadTypeCode: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      `${this.baseUrl}/${this.endpoint}/by-lead-type/${leadTypeCode}`
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Opportunity } from '@app/interfaces';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OpportunityService extends BaseService<Opportunity> {
  protected override endpoint = 'opportunities';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Özel fırsat metodları
  getOpportunitiesByCustomer(customerId: number): Observable<Opportunity[]> {
    return this.http.get<Opportunity[]>(
      `${this.baseUrl}/${this.endpoint}/by-customer/${customerId}`
    );
  }

  getOpportunitiesByStatus(statusCode: string): Observable<Opportunity[]> {
    return this.http.get<Opportunity[]>(
      `${this.baseUrl}/${this.endpoint}/by-status/${statusCode}`
    );
  }
}

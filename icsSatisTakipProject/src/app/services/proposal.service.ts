import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Proposal } from '@app/interfaces';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProposalService extends BaseService<Proposal> {
  protected override endpoint = 'proposals';

  constructor(protected override http: HttpClient) {
    super(http);
  }

  // Özel teklif metodları
  getProposalsByOpportunity(opportunityId: number): Observable<Proposal[]> {
    return this.http.get<Proposal[]>(
      `${this.baseUrl}/${this.endpoint}/by-opportunity/${opportunityId}`
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LeadType } from '@app/interfaces';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class LeadTypeService extends BaseService<LeadType> {
  protected override endpoint = 'lead-types';

  constructor(protected override http: HttpClient) {
    super(http);
  }
}

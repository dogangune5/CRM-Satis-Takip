import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactType } from '@app/interfaces';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ContactTypeService extends BaseService<ContactType> {
  protected override endpoint = 'contact-types';

  constructor(protected override http: HttpClient) {
    super(http);
  }
}

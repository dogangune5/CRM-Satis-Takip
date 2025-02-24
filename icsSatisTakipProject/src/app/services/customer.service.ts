import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Customer } from '../models/database.types';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService<Customer> {
  protected tableName = 'customers';

  constructor(supabaseService: SupabaseService) {
    super(supabaseService);
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    const { data, error } = await this.supabaseService.client
      .from('customers')
      .select('*')
      .or(
        `name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`
      );

    if (error) throw error;
    return data || [];
  }

  async getCustomerWithProposals(
    customerId: string
  ): Promise<Customer & { proposals: any[] }> {
    const { data, error } = await this.supabaseService.client
      .from('customers')
      .select(
        `
        *,
        proposals (
          *,
          proposal_details (
            *,
            product:products (*)
          )
        )
      `
      )
      .eq('id', customerId)
      .single();

    if (error) throw error;
    return data;
  }
}

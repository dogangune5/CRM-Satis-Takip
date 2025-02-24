import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Proposal } from '../models/database.types';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProposalService extends BaseService<Proposal> {
  protected tableName = 'proposals';

  constructor(
    supabaseService: SupabaseService,
    private authService: AuthService
  ) {
    super(supabaseService);
  }

  async getProposalWithDetails(
    proposalId: string
  ): Promise<Proposal & { details: any[] }> {
    const { data, error } = await this.supabaseService.client
      .from('proposals')
      .select(
        `
        *,
        customer:customers (*),
        proposal_details (
          *,
          product:products (*)
        )
      `
      )
      .eq('id', proposalId)
      .single();

    if (error) throw error;
    return data;
  }

  async getMyProposals(): Promise<Proposal[]> {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return [];

    const { data, error } = await this.supabaseService.client
      .from('proposals')
      .select(
        `
        *,
        customer:customers (*)
      `
      )
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateProposalStatus(
    proposalId: string,
    status: Proposal['status']
  ): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('proposals')
      .update({ status })
      .eq('id', proposalId);

    if (error) throw error;
  }
}

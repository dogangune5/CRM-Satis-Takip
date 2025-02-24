import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';

@Injectable()
export abstract class BaseService<T> {
  protected abstract tableName: string;

  constructor(protected supabaseService: SupabaseService) {}

  async getAll(): Promise<T[]> {
    const { data, error } = await this.supabaseService.client
      .from(this.tableName)
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await this.supabaseService.client
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async create(item: Partial<T>): Promise<T> {
    const { data, error } = await this.supabaseService.client
      .from(this.tableName)
      .insert(item)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, item: Partial<T>): Promise<T> {
    const { data, error } = await this.supabaseService.client
      .from(this.tableName)
      .update(item)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  protected query(): PostgrestFilterBuilder<any, any, any> {
    return this.supabaseService.client.from(this.tableName).select('*');
  }
}

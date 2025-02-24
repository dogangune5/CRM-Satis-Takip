import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { User } from '../models/database.types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.supabaseService.client.auth.onAuthStateChange((event, session) => {
      if (session) {
        this.loadUserProfile();
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } =
        await this.supabaseService.client.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      if (data.user) {
        await this.loadUserProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.supabaseService.client.auth.signOut();
      this.currentUserSubject.next(null);
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  private async loadUserProfile(): Promise<void> {
    try {
      const {
        data: { user },
      } = await this.supabaseService.client.auth.getUser();

      if (user) {
        const { data: profile, error } = await this.supabaseService.client
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          this.currentUserSubject.next(profile);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      this.currentUserSubject.next(null);
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  isManager(): boolean {
    return this.currentUserSubject.value?.role === 'manager';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): string | null {
    return this.currentUserSubject.value?.id || null;
  }
}

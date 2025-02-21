import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { environment } from '@app/environments/environment';
import { ApiResponse } from '../interfaces/api-response.interface';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

// Mock kullanıcılar
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123', // Gerçek uygulamada asla plain text password kullanmayın
    name: 'Admin User',
    role: 'ADMIN' as const,
  },
  {
    id: 2,
    email: 'user@example.com',
    password: 'user123',
    name: 'Normal User',
    role: 'USER' as const,
  },
];

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuth();
  }

  private checkAuth() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this._user.set(user);
      } catch (e) {
        this.logout();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock login işlemi
    const user = MOCK_USERS.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return throwError(() => 'Geçersiz kullanıcı adı veya şifre');
    }

    // Kullanıcı bilgilerinden password'ü çıkar
    const { password, ...userWithoutPassword } = user;

    // Mock token oluştur
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: userWithoutPassword,
    };

    // Gerçek API çağrısını simüle et
    return of(mockResponse).pipe(
      delay(500), // 500ms gecikme ekle
      tap((response) => {
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem(environment.tokenKey, response.token);
        localStorage.setItem(
          environment.refreshTokenKey,
          response.refreshToken
        );
        this._user.set(response.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    this._user.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }
}

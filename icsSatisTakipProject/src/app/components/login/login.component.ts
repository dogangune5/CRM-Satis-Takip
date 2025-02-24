import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Giriş Yap</h2>
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label for="username">E-posta:</label>
            <input
              type="email"
              id="username"
              [(ngModel)]="username"
              name="username"
              required
              placeholder="E-posta adresiniz"
            />
          </div>
          <div class="form-group">
            <label for="password">Şifre:</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="Şifreniz"
            />
          </div>
          @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
          }
          <button type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
      }
      .login-box {
        padding: 2rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
      }
      .form-group {
        margin-bottom: 1rem;
      }
      label {
        display: block;
        margin-bottom: 0.5rem;
      }
      input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      button {
        width: 100%;
        padding: 0.75rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
      }
      button:not(:disabled):hover {
        background-color: #0056b3;
      }
      button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
      }
      .error-message {
        color: #dc3545;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 0.5rem;
        border-radius: 4px;
        margin-top: 1rem;
        text-align: center;
      }
    `,
  ],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  async onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Lütfen e-posta ve şifrenizi giriniz.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const success = await this.authService.login(
        this.username,
        this.password
      );
      if (success) {
        await this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage =
          'Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.';
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage =
        'Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.';
    } finally {
      this.isLoading = false;
    }
  }
}

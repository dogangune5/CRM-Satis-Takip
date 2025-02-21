import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
              placeholder="admin@example.com"
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
              placeholder="admin123"
            />
          </div>
          @if (errorMessage) {
          <div class="error-message">{{ errorMessage }}</div>
          }
          <button type="submit">Giriş Yap</button>
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
      button:hover {
        background-color: #0056b3;
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

  constructor(private router: Router) {}

  onLogin() {
    // Hata mesajını sıfırla
    this.errorMessage = '';

    // Kullanıcı adı ve şifre kontrolü
    if (this.username === 'admin@example.com' && this.password === 'admin123') {
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Geçersiz kullanıcı adı veya şifre!';
    }
  }
}

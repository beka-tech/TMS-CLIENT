import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

// export interface TmsUser {
//   displayName: string;
//   role: string;
// }
// export interface LoginRequest {
//   username: string;
//   password: string;
// }
// @Service()
// export class AuthService {
//   private http = inject(HttpClient);
//   currentUser = signal<TmsUser | null>(null);
//   hasRole(role: string): boolean {
//     const user = this.currentUser();
//     return user?.role === role || user?.role === 'Admin';
//   }
//   async login(credentials: LoginRequest) {
//     // Server sets the HttpOnly cookie in the Set-Cookie responseheader
//     await firstValueFrom(this.http.post<void>('/api/auth/login', credentials));
//     // Fetch authenticated profile — browser automatically sendsthe cookie
//     const user = await firstValueFrom(this.http.get<TmsUser>('/api/auth/me'));
//     this.currentUser.set(user);
//   }
// }
export interface TmsUser {
  email: string;
  displayName: string;
  role: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private accessToken = signal<string | null>(null);
  currentUser = signal<TmsUser | null>(null);
  getAccessToken(): string | null {
    return this.accessToken();
  }
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }
  async login(credentials: LoginRequest): Promise<void> {
    const res = await firstValueFrom(this.http.post<AuthResponse>('/api/auth/login', credentials));
    this.accessToken.set(res.accessToken);
    // Decode user payload from JWT (or fetch /api/auth/me)
    const payload = JSON.parse(atob(res.accessToken.split('.')[1]));
    this.currentUser.set({
      email: payload.email || payload.sub,
      displayName: payload.name || payload.email || 'User',
      role:
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        payload.role ||
        'Student',
    });
  }
  logout(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
  }
}

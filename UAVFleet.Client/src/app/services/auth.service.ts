import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

interface LoginResponse { token: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = '/api/auth';   // бекенд ендпойнт
  private _token = '';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<LoginResponse>(`${this.api}/login`, { username, password })
      .pipe(tap(res => {
        this._token = res.token;
        localStorage.setItem('jwt', res.token);
      }));
  }

  get token(): string {
    return this._token || localStorage.getItem('jwt') || '';
  }

  logout() {
    this._token = '';
    localStorage.removeItem('jwt');
  }

  get isLoggedIn(): boolean {
    return !!this._token;
  }
}

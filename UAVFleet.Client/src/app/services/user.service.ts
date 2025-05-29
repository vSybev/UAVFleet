import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = '/api/users';

  constructor(private http: HttpClient) {}

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  create(payload: Partial<User>): Observable<User> {
    return this.http.post<User>(this.url, payload);
  }

  update(id: number, payload: Partial<User>): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

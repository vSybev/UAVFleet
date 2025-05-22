import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Operator {
  operatorId: number;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber: string;
  hiredDate: string;
  notes?: string;
}

export interface Pagination<T> {
  totalItems: number;
  totalPages: number;
  items: T[];
}

@Injectable({ providedIn: 'root' })
export class OperatorService {
  private readonly api = '/api/operators';
  constructor(private http: HttpClient) {}

  list(
    page = 1,
    size = 10,
    sortBy = 'lastName',
    filter: { firstName?: string; lastName?: string } = {}
  ): Observable<Pagination<Operator>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
    if (filter.firstName) params = params.set('firstName', filter.firstName);
    if (filter.lastName)  params = params.set('lastName',  filter.lastName);
    return this.http.get<Pagination<Operator>>(this.api, { params });
  }

  get(id: number): Observable<Operator> {
    return this.http.get<Operator>(`${this.api}/${id}`);
  }

  create(data: Partial<Operator>): Observable<Operator> {
    return this.http.post<Operator>(this.api, data);
  }

  update(id: number, data: Partial<Operator>): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}

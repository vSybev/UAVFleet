// src/app/services/drone.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Drone {
  droneId: number;
  serialNumber: string;
  manufacturer: string;
  model: string;
  payloadCapacity: number;
  serviceDate: string;
  status: string;
}

export interface Pagination<T> {
  totalItems: number;
  totalPages: number;
  items: T[];
}

@Injectable({ providedIn: 'root' })
export class DroneService {
  private readonly api = '/api/drones';

  constructor(private http: HttpClient) {}

  list(
    page = 1,
    size = 10,
    sortBy = 'serialNumber',
    filter: { serialNumber?: string; status?: string } = {}
  ): Observable<Pagination<Drone>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);

    if (filter.serialNumber) params = params.set('serialNumber', filter.serialNumber);
    if (filter.status)       params = params.set('status', filter.status);

    return this.http.get<Pagination<Drone>>(this.api, { params });
  }

  get(id: number): Observable<Drone> {
    return this.http.get<Drone>(`${this.api}/${id}`);
  }

  create(data: Partial<Drone>): Observable<Drone> {
    return this.http.post<Drone>(this.api, data);
  }

  update(id: number, data: Partial<Drone>): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}

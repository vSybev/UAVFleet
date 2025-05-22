import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mission {
  missionId: number;
  droneId: number;
  operatorId: number;
  startTime: string;
  endTime: string;
  objective: string;
  result: string;
}

export interface Pagination<T> {
  totalItems: number;
  totalPages: number;
  items: T[];
}

@Injectable({ providedIn: 'root' })
export class MissionService {
  private readonly api = '/api/missions';

  constructor(private http: HttpClient) {}

  list(
    page = 1,
    size = 10,
    sortBy: 'startTime'|'endTime'|'result' = 'startTime',
    filter: { droneId?: number; operatorId?: number } = {}
  ): Observable<Pagination<Mission>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
    if (filter.droneId != null)    params = params.set('droneId',    filter.droneId.toString());
    if (filter.operatorId != null) params = params.set('operatorId', filter.operatorId.toString());
    return this.http.get<Pagination<Mission>>(this.api, { params });
  }

  get(id: number): Observable<Mission> {
    return this.http.get<Mission>(`${this.api}/${id}`);
  }

  create(data: Partial<Mission>): Observable<Mission> {
    return this.http.post<Mission>(this.api, data);
  }

  update(id: number, data: Partial<Mission>): Observable<void> {
    return this.http.put<void>(`${this.api}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}

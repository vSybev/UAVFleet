import { TestBed } from '@angular/core/testing';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { of } from 'rxjs';

import { JwtInterceptor } from './jwt.interceptor';
import { AuthService }   from '../services/auth.service';

class FakeAuthService {
  _token = '';
  get token(): string { return this._token; }
  logout(): void { this._token = ''; }
}

describe('JwtInterceptor', () => {
  let interceptor: HttpInterceptor;
  let auth: FakeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AuthService, useClass: FakeAuthService }
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
    auth = TestBed.inject(AuthService) as unknown as FakeAuthService;
  });

  it('should add Authorization header when auth.token is set', () => {
    // arrange
    auth._token = 'MY_FAKE_JWT';

    const req = new HttpRequest<any>('GET', '/some/url');

    let handledReq: HttpRequest<any> | null = null;
    const fakeHandler: HttpHandler = {
      handle: (r: HttpRequest<any>) => {
        handledReq = r;
        return of({} as HttpEvent<any>);
      }
    };

    interceptor.intercept(req, fakeHandler).subscribe();

    expect(handledReq).toBeTruthy();
    expect(handledReq!.headers.has('Authorization')).toBeTrue();
    expect(handledReq!.headers.get('Authorization'))
      .toBe('Bearer MY_FAKE_JWT');
  });

  it('should NOT add Authorization header when auth.token is empty', () => {
    auth._token = '';

    const req = new HttpRequest<any>('POST', '/another/url', null);

    let handledReq: HttpRequest<any> | null = null;
    const fakeHandler: HttpHandler = {
      handle: (r: HttpRequest<any>) => {
        handledReq = r;
        return of({} as HttpEvent<any>);
      }
    };

    interceptor.intercept(req, fakeHandler).subscribe();

    expect(handledReq).toBeTruthy();
    expect(handledReq!.headers.has('Authorization')).toBeFalse();
  });
});

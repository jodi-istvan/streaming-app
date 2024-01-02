import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private router: Router) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const bearerToken = localStorage.getItem('bearerToken');
    
    if (bearerToken) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${bearerToken}`);
      const authRequest = req.clone({ headers });
      
      return next.handle(authRequest).pipe(catchError(err => {
        // this.router.navigateByUrl('/auth-error');
        return of(err.message);
      }));
    }
    else {
      return next.handle(req);
    }
  }
}

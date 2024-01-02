import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';

import IUser from '../models/user.model';
import * as moment from 'moment';

export interface IAuthRes {
  token: string;
  expiresAt: string;
  user: IUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly BASE_URL = '/auth'
  
  public user$: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
  
  constructor(private http: HttpClient) {}
  
  public login(email: string, password: string): Observable<IAuthRes> {
    return this.http.post<IAuthRes>(`${this.BASE_URL}/login`, { email, password }).pipe(
      tap(res => this.setSession(res)),
      shareReplay()
    )
  }
  
  public logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('expiresAt');
    this.user$.next(null);
  }
  
  public isLoggedIn(): boolean {
    return moment().isBefore(this.getExpiration());
  }
  
  public initUser() {
    if (this.isLoggedIn()) {
      this.user$.next(JSON.parse(localStorage.getItem('user')));  
    }
  }
  
  private setSession(authResult: IAuthRes): void {
    const expiresAt = moment().add(authResult.expiresAt, 'second');
    localStorage.setItem('user', JSON.stringify(authResult.user));
    localStorage.setItem('bearerToken', authResult.token);
    localStorage.setItem('expiresAt', expiresAt.unix().toString());
    this.user$.next(authResult.user);
  }
  
  private getExpiration(): moment.Moment {
    const expiration = localStorage.getItem("expiresAt");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, finalize, Observable, of, shareReplay, tap } from 'rxjs';

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
  
  public user: BehaviorSubject<IUser> = new BehaviorSubject<IUser>(null);
  public isUserLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient) {
    this.initUser();
  }
  
  public initUser(): void {
    this.isUserLoading.next(true);
    this.http.get<IUser>(`${this.BASE_URL}/active-user`).pipe(
      finalize(() => this.isUserLoading.next(false)),
    ).subscribe({
      next: user => this.user.next(user),
      error: err => this.user.next(null)
    });
  }
  
  public signup(name: string, email: string, password: string): Observable<string> {
    return this.http.post(`${this.BASE_URL}/signup`, { name, email, password }, { responseType: 'text'});
  }
  
  public login(email: string, password: string): Observable<IAuthRes> {
    return this.http.post<IAuthRes>(`${this.BASE_URL}/login`, { email, password }).pipe(
      tap(res => this.handleLogin(res)),
      shareReplay()
    );
  }
  
  public logout(): void {
    localStorage.removeItem('bearerToken');
    localStorage.removeItem('expiresAt');
    this.user.next(null);
  }
  
  // public isLoggedIn(): boolean {
  //   return moment().isBefore(this.getExpiration());
  // }
  
  private handleLogin(authResult: IAuthRes): void {
    const expiresAt = moment().add(authResult.expiresAt, 'second');
    localStorage.setItem('bearerToken', authResult.token);
    localStorage.setItem('expiresAt', expiresAt.unix().toString());
    this.user.next(authResult.user);
  }
  
  private getExpiration(): moment.Moment {
    const expiration = localStorage.getItem("expiresAt");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}

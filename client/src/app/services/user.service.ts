import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private readonly BASE_URL = '/user'
  
  constructor(private http: HttpClient) { }
  
  public uploadProfilePicture(data: FormData): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/profile-picture`, data);
  }
}

import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  public readonly isPictureUploadLoading: WritableSignal<boolean> = signal(false);
  
  private readonly BASE_URL = '/user'
  
  constructor(private http: HttpClient) { }
  
  public uploadProfilePicture(data: FormData): Observable<void> {
    this.isPictureUploadLoading.set(true);
    return this.http.put<void>(`${this.BASE_URL}/profile-picture`, data)
      .pipe(finalize(() => this.isPictureUploadLoading.set(false)));
  }
}

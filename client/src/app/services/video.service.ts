import { Injectable } from '@angular/core';
import IVideo from '../models/video.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  
  private readonly BASE_URL = '/video'
  
  constructor(private http: HttpClient) { }
  
  public getById(id: string): Observable<Array<IVideo>> {
    return this.http.get<Array<IVideo>>(`${this.BASE_URL}/${id}`);
  }
  
  public likeVideo(id: string, action: 'ADD' | 'REMOVE') {
    return this.http.patch(`${this.BASE_URL}/like/${id}`, { action });
  }
}

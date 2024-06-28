import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import IUser from '../models/user.model';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../services/user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  
  readonly user: WritableSignal<IUser> = signal(null);
  readonly isUploadLoading: WritableSignal<boolean> = signal(false);
  
  readonly form = this.formBuilder.group({
    profilePicture: ['', []],
  });
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {}
  
  ngOnInit(): void {
    this.authService.user.subscribe(user => this.user.set(user));
  }
  
  onFileChange(event: Event): void {
    this.isUploadLoading.set(true);
    const target = event.target as HTMLInputElement;
    const image = (target.files as FileList)[0];
    
    if (!image) {
      throw new Error('Something went wrong while uploading picture');
    }
    
    const formData = new FormData();
    formData.append("profilePicture", image);
    this.userService.uploadProfilePicture(formData).pipe(
      map(() => this.authService.getActiveUser())
    ).subscribe(() => this.isUploadLoading.set(false));
  }
}

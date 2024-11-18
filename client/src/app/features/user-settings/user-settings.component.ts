import { Component, computed, OnInit, Signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import IUser from '../../models/user.model';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  
  readonly user: Signal<IUser> = toSignal(this.authService.user);
  readonly isUserLoading: Signal<boolean> = toSignal(this.authService.isUserLoading);
  readonly isProfilePictureLoading: Signal<boolean> = computed(() =>
    this.isUserLoading() || this.userService.isPictureUploadLoading());
  
  readonly form = this.formBuilder.group({
    profilePicture: ['', []],
  });
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {}
  
  ngOnInit(): void {}
  
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const image = (target.files as FileList)[0];
    
    if (!image) {
      throw new Error('Something went wrong while uploading picture');
    }
    
    const formData = new FormData();
    formData.append("profilePicture", image);
    this.userService.uploadProfilePicture(formData).pipe(
      map(() => this.authService.getActiveUser())
    ).subscribe();
  }
  
  onFileLabelClick(event: Event): void {
    if (this.isProfilePictureLoading()) {
      event.preventDefault();
    }
  }
}

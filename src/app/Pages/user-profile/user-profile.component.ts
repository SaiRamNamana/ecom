import { Component } from '@angular/core';
import { AuthService } from '../../Components/login/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TitleService } from '../../Service/title.service';
import { LoadProductsService } from '../../Service/load-products.service';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule,NgIf,FontAwesomeModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  changeProfile: FormGroup;
  arrowLeft = faArrowLeft;
  selectedFile:File | null = null;
  imageUrl:string='';
  nameOfUser:string|undefined;
  constructor(private loadProduct:LoadProductsService, public authService: AuthService, private fb: FormBuilder,private http:HttpClient,private toastr:ToastrService,private router:Router,private titleService:TitleService) {
    this.titleService.setTitle("Ecom | Profile")
    this.changeProfile = this.fb.group({
      userName: ['', [Validators.required,Validators.minLength(3), Validators.maxLength(10)]],
      file: [null]
    });
    this.authService.userName$In.subscribe(data => {
      this.nameOfUser = data;
      this.changeProfile.get('userName')?.setValue(this.nameOfUser);
    });
    this.authService.isUrl.subscribe(data => {
      this.imageUrl = data;
    });
  }
  async saveProfile() {
    const formData = new FormData();
    if (this.selectedFile) {
        formData.append('file', this.selectedFile); 
        (await this.loadProduct.uploadImage(formData)).subscribe({
          next: (response) => {
            this.imageUrl = response.filePath;
            this.authService.updateImage(this.imageUrl);
          },
          error: () => {
            this.toastr.error('Image upload failed. Please try again.', 'Error');
          }
        });
        
    }
    const username = this.changeProfile.value.userName;
    this.authService.updateName(username);
    this.toastr.success('', 'Your changes added successfully', {
      timeOut: 2000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right',
    });
    setTimeout(() => {
      this.router.navigate(['/'])
    }, 1000);
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0]; 
    if (file) {
       this.selectedFile = file;
    }
  }
  back(){
    window.history.back();
  }
}

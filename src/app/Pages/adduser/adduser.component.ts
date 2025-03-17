import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../Components/login/auth.service';
import { TitleService } from '../../Service/title.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import {faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/user';
import { NgIf } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-adduser',
  imports: [NgIf, ReactiveFormsModule, FormsModule,FontAwesomeModule],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent {
  addUserForm: FormGroup;
  apiUrl = 'http://localhost:5183/user/signup'
  arrowLeft = faArrowLeft;

  constructor(private fb: FormBuilder, private http: HttpClient, private toaster: ToastrService,
    public authService: AuthService, public titleService: TitleService, public router: Router) {

    this.addUserForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      reEnterPassword: ['', [Validators.required]],
      role: ['user']
    }, { validator: this.passwordsMatchValidator });
  }
  passwordsMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const reEnterPassword = form.get('reEnterPassword')?.value;

    if (password && reEnterPassword && password !== reEnterPassword) {
      return { passwordsMismatch: true };
    }
    return null;
  }
  async onSubmit() {
    const user = {
      username: this.addUserForm.value.userName,
      passwordHash: this.addUserForm.value.password,
      email: this.addUserForm.value.email,
      role: this.addUserForm.value.role
    };
    const isCreated = await this.authService.signUp(user);
    if (!isCreated) {
      this.toaster.warning('Bad Request', 'User Already Exists', {
        timeOut: 1000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
      this.addUserForm.reset();
    } else {
      this.toaster.success(`Added user! ${user.username}`, 'Success', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
      this.addUserForm.reset();
      if (this.addUserForm.value.role === 'admin') {
        var isUser = await this.authService.getUser(user.email, user.passwordHash, true);
        if (isUser) {
          this.authService.signInSubject.next(true);
          this.authService.user.verified = true
          this.router.navigate(['/'])
        }
        else {
          this.authService.signInSubject.next(false);
        }
      }
      else {
        var isUser = await this.authService.getUser(user.email, user.passwordHash, false);
        if (isUser) {
          this.authService.signInSubject.next(true);
          this.authService.user.verified = true
          this.router.navigate(['/'])
        }
        else {
          this.authService.signInSubject.next(false);
        }
      }

    }
  }
  back(){
    window.history.back();
  }
}

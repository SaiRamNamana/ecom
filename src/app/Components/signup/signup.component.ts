import { CommonModule, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { lastValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../login/auth.service';
import { TitleService } from '../../Service/title.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  @Input() label: string = 'Sign Up'
  @Input() bg: boolean = true;
  signupForm: FormGroup;
  isInvalidUser = false;
  apiUrl = 'http://localhost:5183/user/signup'

  constructor(private fb: FormBuilder, private http: HttpClient, private toaster: ToastrService,
    public authService: AuthService, public titleService: TitleService, public router: Router) {

    this.signupForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      reEnterPassword: ['', [Validators.required]],
      role: ['user']
    }, { validator: this.passwordsMatchValidator });
  }
  ngOnInit(){
    this.titleService.setTitle("Ecom | SignUp")
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
      username: this.signupForm.value.userName,
      passwordHash: this.signupForm.value.password,
      email: this.signupForm.value.email,
      role: "user"
    };
    const isCreated = await this.authService.signUp(user);
    if (!isCreated) {
      this.isInvalidUser = true;
    } else {
      this.toaster.success(`Added user! ${user.username}`, 'Success', {
        timeOut: 2000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
      this.signupForm.reset();
      var isUser = await this.authService.getUser(user.email,user.passwordHash,false);
      if(isUser){
          this.authService.signInSubject.next(true); 
          this.authService.user.verified=true
          this.router.navigate(['/'])
        }
      else{
      this.authService.signInSubject.next(false);
      }
    }
  }
}

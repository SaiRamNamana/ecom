import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '../../Service/title.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgIf],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  isInValid:boolean=false;
  isAdmin:number=0;

  constructor(private authService:AuthService,private router: Router,public titleService:TitleService,public toaster:ToastrService,private route:ActivatedRoute) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  async onSubmit(formValues: { email: string, password:string }) {
    var isUser;
    if(!this.checkID()) isUser = await this.authService.getUser(formValues.email,formValues.password,false);
    else{
      isUser = await this.authService.getUser(formValues.email,formValues.password,true);
    } 

    if(isUser){
          this.authService.signInSubject.next(true); 
          this.authService.user.verified=true
          this.router.navigate(['/'])
      }
    else{
      this.isInValid=true;
      this.authService.signInSubject.next(false);
    }
  }
  ngOnInit(){
    this.titleService.setTitle("Ecom | Sign In");
    this.route.queryParams.subscribe(params => {
      this.isAdmin = params['admin'];
    });
  }
  checkID(){
    if(this.isAdmin){
      return true;
    }
    return false;
  }

}

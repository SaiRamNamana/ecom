import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../Components/login/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGaurdService implements CanActivate{

  constructor(private authService:AuthService,private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    if (this.authService.isUserLoggedIn()) {
      return true; 
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

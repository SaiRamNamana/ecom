import { Component, ElementRef, HostListener, inject, output } from '@angular/core';
import { CartService } from '../../Service/cart.service';
import { NavigationEnd, Router, RouterLink} from '@angular/router';
import { AuthService } from '../login/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faTimes,faCartShopping,faBars,faUser,faHeart,faHistory,faSignOut,faEdit } from '@fortawesome/free-solid-svg-icons';
import { WishlistService } from '../../Service/wishlist.service';
import { TitleService } from '../../Service/title.service';


@Component({
  selector: 'app-header',
  imports: [RouterLink, NgIf, FontAwesomeModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  
  cartService = inject(CartService);
  authService = inject(AuthService);
  toaster = inject(ToastrService);
  router = new Router();
  btnClicked = output()
  faPlus = faPlus;
  faTimes = faTimes;
  faBars = faBars;
  faUser = faUser;
  faHeart = faHeart;
  faSignOut = faSignOut;
  faHistory = faHistory;
  faEdit=faEdit
  menuOpen = false;
  showForm = false;
  profileMenuOpen = false;
  currentRoute = '';
  faCartShopping = faCartShopping
  wishList :number[]= [];
  imageUrl:string|undefined;
  username:string|undefined;
  get cartCount(): number {
    return this.cartService.total;
  }
  get wishlistCount():number{
    this.authService.wishList.subscribe(data => this.wishList = data);
    return this.wishList.length;
  }

  constructor(public wishlistService:WishlistService,public titleService:TitleService,private eRef: ElementRef) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.updateIcon();
      }
    })
  }
  toggleForm(){
    this.showForm = !this.showForm;
  }

  updateIcon() {
    this.showForm = this.currentRoute == '/addbar';
  }

  logOut(){
    this.cartService.clear();
    this.authService.signInSubject.next(false);
    this.authService.removeUser();
    this.wishlistService.clear();
    this.router.navigate(['/'])
  }
  isSignIn: boolean = false;
  ngOnInit() {
    this.authService.isSignIn$.subscribe(status => {
      this.isSignIn = status; 
    });
    this.authService.isUrl.subscribe(data => this.imageUrl = data);
    this.authService.userName$In.subscribe(data => this.username = data);
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.profileMenuOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.profileMenuOpen = false;
    }
  }
  closeList(){
    this.profileMenuOpen = false;
  }
}

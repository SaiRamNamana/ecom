import { Component } from '@angular/core';
import { WishlistService } from '../../Service/wishlist.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { cartitem } from '../../models/cartitem';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Components/login/auth.service';
import { TitleService } from '../../Service/title.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '../../Service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { PrimaryButtonComponent } from "../../Components/primary-button/primary-button.component";

@Component({
  selector: 'app-wishlist',
  imports: [NgIf, NgFor, FontAwesomeModule, CommonModule, PrimaryButtonComponent,RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  arrowLeft = faArrowLeft;
  wishlistItems: cartitem[] = [];
  cartItems: number[] = [];
  isLoading = false;
  constructor(private wishlistService: WishlistService, private router: Router, private authService: AuthService, public titleService: TitleService, private cartService: CartService, private toastr: ToastrService) {

  }

  async ngOnInit() {
    this.titleService.setTitle("Ecom | Wishlist")
    this.authService.cartList.subscribe(
      data => { this.cartItems = [...data]; }
    )
    this.isLoading = true;
    await this.wishlistService.loadCart();
    this.loadWishlist();
  }

  async loadWishlist() {
    this.wishlistItems = [...await this.wishlistService.getWishlistItems()];
    this.isLoading = false;
  }

  async removeFromWishlist(product: cartitem) {
    const wishList = this.authService.getUserList();
    const index = wishList.indexOf(product.productId)
    wishList.splice(index, 1);
    this.authService.updateWishlistFromString(wishList.join(','))
    await this.wishlistService.removeFromWishlist(product);
    this.loadWishlist()
  }
  async navigateTo(item: cartitem) {
    this.router.navigate(['/single-product', item.productId])
  }
  isButtonDisabled(): boolean {
    return this.authService.isUser();
  }
  async addingProduct(cart: cartitem) {
    this.cartService.total += 1;
    this.cartService.addToCart(cart);
    this.toastr.success('Added', '', {
      positionClass: 'toast-top-right',
      timeOut: 500,
      progressBar: false,
      toastClass: 'ngx-toastr custom-toast'
    });
    this.authService.addToCart(cart.productId);
  }

}



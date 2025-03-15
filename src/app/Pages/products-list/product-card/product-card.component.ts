import { Component, EventEmitter, inject, Input, input, Output } from '@angular/core';
import { Product } from '../../../models/products.model';
import { PrimaryButtonComponent } from "../../../Components/primary-button/primary-button.component";
import { CartService } from '../../../Service/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { faHeart, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../Components/login/auth.service';
import { WishlistService } from '../../../Service/wishlist.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadProductsService } from '../../../Service/load-products.service';
import { cartitem } from '../../../models/cartitem';


@Component({
  selector: 'app-product-card',
  imports: [PrimaryButtonComponent, CommonModule, FontAwesomeModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  product = input.required<Product>();
  cartService = inject(CartService);
  router = new Router();
  faHeart = faHeart;
  faEdit = faEdit;
  faDelete = faTrash;
  isUser:boolean=false;
  showDeleteModal: boolean = false;
  productToDelete: number | undefined;
  isInCart: boolean = false;
  @Output() deleteRequest = new EventEmitter<any>();
  constructor(private toastr: ToastrService, public authService: AuthService, public wishlistService: WishlistService) { }

  navigateToPage(id: number) {
    this.router.navigate(['/single-product', id.toLocaleString()])
  }
 
  addingProduct(product: Product) {
    if(this.isUser){
      var cartItem: cartitem = {
        productId: product.id,
        title: product.title,
        quantity: 1,
        price: product.price,
        image: product.image,
        stock: product.stock
      }
      this.cartService.addToCart(cartItem);
      this.cartService.total += 1;
      this.toastr.info('Added to Cart', '', {
        positionClass: 'toast-top-right',
        timeOut: 500,
        progressBar: false,
        toastClass: 'ngx-toastr custom-toast'
      });
      this.authService.addToCart(product.id);
    }else{
      this.toastr.info("Login")
    }
  }

  checkUser() {
    return this.authService.isUserLoggedIn();
  }

  wishlistOfUser: number[] = [];
  cartlistOfUser: number[] = [];

  ngOnInit() {
    this.authService.wishList.subscribe(
      data => { this.wishlistOfUser = [...data]; }
    );
    this.authService.cartList.subscribe(
      data => { this.cartlistOfUser = [...data]; }
    )
    this.authService.isSignIn$.subscribe(data => this.isUser = data);
  }

  isInWishList(id: number) {
    return this.wishlistOfUser.indexOf(id);
  }

  async addToWishlist(product: Product) {
    if(this.isUser){
      var cartitem = {
        productId: product.id,
        title: product.title,
        quantity: 0,
        price: product.price,
        image: product.image,
        stock: product.stock
      }
      let isProductIndex = this.wishlistOfUser.indexOf(product.id);

    if (isProductIndex !== -1) {
      this.wishlistOfUser.splice(isProductIndex, 1);
    } else {
      this.wishlistOfUser.push(product.id);
    }


    this.authService.updateWishlistFromString(this.wishlistOfUser.join(","));

    if (isProductIndex !== -1) {
      await this.wishlistService.removeFromWishlist(cartitem);
      this.toastr.info('Removed from Wishlist');
    } else {
      await this.wishlistService.addToWishlist(cartitem);
      this.toastr.success('Added to Wishlist');
    }
    }
    else {
      this.toastr.info("Login")
    } 
  }

  editProduct(product: Product) {
    this.router.navigate(['/add', product.id])
  }
  openDeleteModal(product: any) {
    this.deleteRequest.emit(product);
  }
}

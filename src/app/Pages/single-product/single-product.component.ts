import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PrimaryButtonComponent } from "../../Components/primary-button/primary-button.component";
import { Product } from '../../models/products.model';
import { CartService } from '../../Service/cart.service';
import { AuthService } from '../../Components/login/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TitleService } from '../../Service/title.service';
import { WishlistService } from '../../Service/wishlist.service';
import { HttpClient } from '@angular/common/http';
import { faHeart,faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgIf, NgStyle } from '@angular/common';
import { LoadProductsService } from '../../Service/load-products.service';

@Component({
  selector: 'app-single-product',
  imports: [RouterModule, PrimaryButtonComponent, FontAwesomeModule, NgStyle, NgIf],
  templateUrl: './single-product.component.html',
  styleUrl: './single-product.component.css'
})
export class SingleProductComponent {

  isLoading(): boolean {
    throw new Error('Method not implemented.');
  }
  faHeart = faHeart
  previousUrl = '/';
  wishlistOfUser: number[] = [];
  cartItems: number[] = [];
  product: any;
  arrowLeft = faArrowLeft
  constructor(private loadProduct:LoadProductsService, private cartService: CartService, public authService: AuthService, private toastr: ToastrService, public titleService: TitleService, public wishlistService: WishlistService, private route: ActivatedRoute, private http: HttpClient) {
  }

  async addingProduct(product: Product) {
    if (this.authService.isUserLoggedIn()) {
      const cart = {
        productId: product.id,
        title: product.title,
        quantity: 0,
        price: product.price,
        image: product.image,
        stock: product.stock
      }
      await this.cartService.addToCart(cart)
      this.cartService.total += 1;
      this.toastr.success('Added', '', {
        positionClass: 'toast-top-right',
        timeOut: 500,
        progressBar: false,
      });
      this.authService.addToCart(product.id);
    }
  }
  id: any
  async ngOnInit() {
    this.route.paramMap.subscribe(params => this.id = params.get("id"));
    this.loadProduct.getProductsFromList(this.id).subscribe(
        (data) => {
          this.product = data;
          this.titleService.setTitle(`Ecom | ${this.product?.title?.slice(0, 25)}`);
        }
      );

    this.authService.wishList.subscribe(data => {
      this.wishlistOfUser = data;
    });
    this.authService.cartList.subscribe(
      data => { this.cartItems = [...data]; }
    );
  }

  async addToWishlist(product: Product) {

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
  navigateToHome() {
    window.history.back();
  }
}

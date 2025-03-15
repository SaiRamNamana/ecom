import { Injectable } from '@angular/core';
import axios from 'axios';
import { AuthService } from '../Components/login/auth.service';
import { cartitem } from '../models/cartitem';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlist: cartitem[] = [];
  constructor(public authService:AuthService){
    this.authService.isSignIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) this.loadCart();
    });
  }
  apiUrl = 'http://localhost:5183/Cart'


  public async loadCart() {
    if (this.authService.isUserLoggedIn()) {
      try {
        const response = await axios.get<cartitem[]>(`${this.apiUrl}/wishlist?userId=${this.authService.user.id}`);
        this.wishlist = response.data;
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }else this.wishlist = [];
  }

  async getWishlistItems(){
    await this.loadCart();
    return this.wishlist;
  }



  async addToWishlist(product: cartitem){
    await axios.post(`${this.apiUrl}/wishlist/?userId=${this.authService.user.id}&productId=${product.productId}`)
    await this.loadCart();
  }

  async removeFromWishlist(product: cartitem){
    await axios.post(`${this.apiUrl}/wishlist/remove?userId=${this.authService.user.id}&productId=${product.productId}`)
  }

  getWishListProduct(id:number){
    return this.wishlist.find(p => p.productId === id);
  }
  async clear(){
    await this.loadCart()
  }
}

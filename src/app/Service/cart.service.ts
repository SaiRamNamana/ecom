import { Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AuthService } from '../Components/login/auth.service';
import { cartitem } from '../models/cartitem';
import axios from 'axios';
import { BehaviorSubject} from 'rxjs'
import { Order } from '../models/order.model';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  total = 0;
  private cartItemsSubject = new BehaviorSubject<cartitem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  order = new BehaviorSubject<Order|undefined>(undefined);
  public presentOrder = this.order.asObservable();
  cartItems:any = [];
  public addressIndex = 0;
  isLoading = false;
  private apiUrl = 'http://localhost:5183/Cart';
  
  constructor(private http:HttpClient,private authService:AuthService){
    this.authService.isSignIn$.subscribe((isLoggedIn) => {
      this.isLoading = true;
      if (isLoggedIn) {
        setTimeout(() => {
          if (this.authService.isUserLoggedIn()) {
            this.loadCart();
          }
        }, 500);
      }
    });
  }

  async loadCart() {
    if (this.authService.isUserLoggedIn()) {
      try {
        const response = await axios.get<cartitem[]>(`${this.apiUrl}/${this.authService.user.id}`)
        this.cartItemsSubject.next(response.data);
        this.cartItems = [...response.data];
        this.cartItemsSubject.next(this.cartItems);
        this.isLoading = false;
        this.total = this.cartItems.length;
      } catch (error) {
      }
    }
  }
  addToCart(product : cartitem){
    const params = {
      userId: this.authService.user.id,
      productId: product.productId,
      quantity: 1
  };
  this.http.post(`${this.apiUrl}/add-to-cart`, {}, { params}).subscribe(response => {
    response
  });
  }

  async removeFromCart(id:number){
    await axios.delete(`${this.apiUrl}/remove/${id}?userId=${this.authService.user.id}`)
    this.loadCart();
  }
  async removeFromCartPermanent(id:number){
    await axios.delete(`${this.apiUrl}/remove/permanent/${id}?userId=${this.authService.user.id}`);
    this.loadCart();
  }
  
  clear(){
    this.cartItems=[];
    this.total = 0;
  }

  totalQuantity(){
    let total = 0;
    for(const item of this.cartItems) total += item.quantity;
    return total;
  }

  async orderConfirm(){
    for(const item of this.cartItems){
      const params = {
        userId: this.authService.user.id,
        quantity: item.quantity
    };
      if(item.quantity > item.stock) return item;
      else await axios.post(`${this.apiUrl}/order/${item.productId}`,{},{params});
    }
    this.loadCart();
    return null;
  }
  updateOrder(order:Order){
    this.order.next(order);
  }
  updateOrderList(){
    this.order.next(undefined);
  }

  async orderHistory(){
    return (await axios.post(`${this.apiUrl}/orderList/${this.authService.user.id}`)).data;
  }
}

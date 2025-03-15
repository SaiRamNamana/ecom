import { Component, inject, input } from '@angular/core';
import { ButtonComponent } from "../../../Components/button/button.component";
import { CartService } from '../../../Service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { LoadProductsService } from '../../../Service/load-products.service';
import { cartitem } from '../../../models/cartitem';
import {faPlus,faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../Components/login/auth.service';


@Component({
  selector: 'app-cart-item',
  imports: [ButtonComponent,FontAwesomeModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css'
})
export class CartItemComponent {
  faPlus = faPlus;
  faMinus = faMinus;
  cartListOfusers:number[]=[];
  item = input.required<cartitem>()
  cartService = inject(CartService)
  toastr = inject(ToastrService) 
  loadService = inject(LoadProductsService)

  constructor(public authService:AuthService){}
  ngOnInit(){
    this.authService.cartList.subscribe(data => {this.cartListOfusers = [...data];});
  }
  async decrement(product:cartitem){
    if(product.quantity === 1) return;
    await this.cartService.removeFromCart(product.productId);
  }
  async removeFromCart(product:cartitem){
    this.cartListOfusers = this.cartListOfusers.filter(id => id !== product.productId);
    await this.cartService.removeFromCartPermanent(product.productId);
    this.authService.updateCart(this.cartListOfusers);
    this.toastr.warning(`${product.title} removed from cart`, 'Item Removed', {
      positionClass: 'toast-top-right',
      timeOut: 2000,
      progressBar: true,
      closeButton: true
    });
  }

  addingProduct(product: cartitem) {
        if(product.quantity + 1 > product.stock){
          this.toastr.warning('Quantity Not Available', '', {
            positionClass: 'toast-top-right',
            timeOut: 500,
            progressBar: false,
            toastClass: 'ngx-toastr custom-toast'
          });
        }
        else{
          this.cartService.addToCart(product)
          var itemIndex = this.cartService.cartItems.findIndex((item:any)=> item.productId === product.productId)
          this.cartService.cartItems[itemIndex].quantity += 1;
        }
    }
}

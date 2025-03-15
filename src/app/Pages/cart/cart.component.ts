import { Component} from '@angular/core';
import { CartService } from '../../Service/cart.service';
import { CartItemComponent } from "./cart-item/cart-item.component";
import { OrderSummaryComponent } from "./order-summary/order-summary.component";
import { CommonModule, NgIf } from '@angular/common';
import { TitleService } from '../../Service/title.service';
import { AuthService } from '../../Components/login/auth.service';
import { Order } from '../../models/order.model';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CartItemComponent, OrderSummaryComponent, NgIf,CommonModule,FontAwesomeModule,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  constructor(public cartService:CartService,public titleService:TitleService,public authService:AuthService){}
  orderHistory : Order[] = [];
  showOrders = false;
  isLoading = false;
  arrowLeft = faArrowLeft;
  async ngOnInit(){
    this.cartService.loadCart();
    this.titleService.setTitle("Ecom | Cart");
    this.isLoading = true;
  }
}

import { Component, inject } from '@angular/core';
import { CartService } from '../../../Service/cart.service';
import { PrimaryButtonComponent } from "../../../Components/primary-button/primary-button.component";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule} from '@angular/common';
import { AuthService } from '../../../Components/login/auth.service';

@Component({
  selector: 'app-order-summary',
  imports: [PrimaryButtonComponent,CommonModule],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent {
  cartService = inject(CartService)
  cartItems: number[] = [];
  constructor(public toastr:ToastrService,public router:Router,private authService:AuthService){}
  ngOnInit(){
    this.authService.cartList.subscribe(
      data => { this.cartItems = [...data]; }
    );
  }
  total(){
    let total = 0;
    for(const item of this.cartService.cartItems) total += item.price * item.quantity;
    return total;
  }
  async orderConfirm(){
    this.router.navigate(['/address']);
  }
}

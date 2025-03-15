import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Order } from '../../models/order.model';
import axios from 'axios';
import { AuthService } from '../../Components/login/auth.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../Service/cart.service';
import { TitleService } from '../../Service/title.service';

@Component({
  selector: 'app-orderhistory',
  imports: [NgIf,NgFor,CommonModule,FontAwesomeModule,RouterLink],
  templateUrl: './orderhistory.component.html',
  styleUrl: './orderhistory.component.css'
})
export class OrderhistoryComponent {
  orderHistory : Order[] = [];
  arrowLeft = faArrowLeft;
  private apiUrl = 'http://localhost:5183/Cart';
  constructor(private authService:AuthService,private cartService:CartService,private router:Router,private titleService:TitleService){}
  async ngOnInit(){
    this.titleService.setTitle("Ecom | Order History")
    this.orderHistory = (await axios.post(`${this.apiUrl}/orderList/${this.authService.user.id}`)).data;
  }
  invoiceOfOrder(order:Order){
    this.cartService.updateOrder(order);
    this.router.navigate(['/invoice'])
  }
}

import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../../Components/login/auth.service';
import { CartService } from '../../Service/cart.service';
import { Address } from '../../models/address.model';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import { Order } from '../../models/order.model';
import { Item } from '../../models/item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteTrackingService } from '../../Service/route-tracking.service';
import { TitleService } from '../../Service/title.service';

@Component({
  selector: 'app-invoice',
  imports: [NgFor,CommonModule,FontAwesomeModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  @ViewChild('content')
  content!: ElementRef;
  now = Date.now(); 
  date:Date | undefined;
  index = 0;
  id:number = 0;
  arrowLeft = faArrowLeft;
  addresses:Address[] | undefined = [];
  orderHistory : Order[] = [];
  order:Order|undefined;
  items:Item[] = []
  private apiUrl = 'http://localhost:5183/Cart';

  async ngOnInit(){
    this.titleService.setTitle("Ecom | Invoice")
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    this.cartService.presentOrder.subscribe(data =>{
      this.order = data;
      if(this.order) this.items = this.order.items;
    });
    this.index = this.cartService.addressIndex;
    this.addresses = this.authService.userProfile?.addresses;
  }

  constructor(public authService:AuthService,public cartService:CartService,private router:Router,public routeTracking:RouteTrackingService,private route:ActivatedRoute,private titleService:TitleService){}

  total(){
    return this.order?.total;
  }

  backToHome(){
    this.router.navigate(['/'])
  }
  back(){
    window.history.back();
  }
  isOrderHistory(){
    return this.routeTracking.getPreviousUrl() === '/orderhistory';
  }

  download(){
    domtoimage.toPng(this.content.nativeElement)
    .then((dataUrl) => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth(); 
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = 300; 
      const imgHeight = (this.content.nativeElement.clientHeight * imgWidth) / this.content.nativeElement.clientWidth;
      const xPosition = (pageWidth - imgWidth) / 2;
      const yPosition = (pageHeight - imgHeight) / 2;
      pdf.addImage(dataUrl, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
      pdf.save('invoice.pdf');
    });
  }
  checkID(){
    if(this.id){
      return false;;
    }
    return true;
  }
}

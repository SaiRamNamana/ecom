import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../Components/login/auth.service';
import { Address } from '../../models/address.model';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../Service/cart.service';
import { Router } from '@angular/router';
import { Order } from '../../models/order.model';
import { ToastrService } from 'ngx-toastr';
import { TitleService } from '../../Service/title.service';
import { LoadProductsService } from '../../Service/load-products.service';

@Component({
  selector: 'app-address',
  imports: [ReactiveFormsModule,NgIf,FontAwesomeModule,NgFor,CommonModule,FontAwesomeModule],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  addAddressForm : FormGroup;
  isProceed:boolean=false;
  faEdit = faEdit;
  orderHistory : Order[] = [];
  addresses:Address[]|undefined = [];
  showForm = false;
  arrowLeft = faArrowLeft;
  constructor(private fb:FormBuilder,private authService:AuthService,private http:HttpClient,private cartService:CartService,private router:Router,public toastr:ToastrService,private titleService:TitleService,private loadProductService:LoadProductsService){
    this.addAddressForm = this.fb.group({
            street: ['', [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z0-9 ,\\-]*$')]],
            addressLine: ['',[Validators.pattern('^[a-zA-Z ,\-]*$')]],
            city: ['', [Validators.required, Validators.min(0),Validators.pattern('^[a-z A-Z]*$')]],
            state: ['', [Validators.required, Validators.required,Validators.pattern('^[a-z A-Z]*$')]],
            pinCode: ['', [Validators.required, Validators.minLength(6),Validators.pattern('^[0-9 ]*$')]]
    })
  }
  async saveAddress(){
    if(this.addAddressForm.valid){
      const updatedAddress={
        street:this.addAddressForm.value.street,
        addressLine:this.addAddressForm.value.addressLine,
        city:this.addAddressForm.value.city,
        state:this.addAddressForm.value.state,
        postalCode:this.addAddressForm.value.pinCode
      };
      this.loadProductService.updateAddress(updatedAddress).subscribe(async response => {
        await this.authService.updateProfile(updatedAddress);
    });
    this.authService.Addressess.subscribe(data => {
      this.addresses =  data ? [...data] : [];
  });
      this.showForm = !this.showForm;
    }
  }
 async orderConfirm(index:number){
      await this.cartService.orderConfirm();
      this.authService.updateCart([]);
      this.toastr.success('Order Confirmed', 'Your order will be deliverd soon', {
        timeOut: 3000,
        progressBar: true,
        progressAnimation: 'increasing',
        positionClass: 'toast-top-right',
      });
      this.cartService.addressIndex = index;
      this.orderHistory = await this.cartService.orderHistory();
      this.cartService.updateOrder(this.orderHistory[0]);
      setTimeout(() => {
        this.router.navigate(['/invoice'],{ 
          queryParams: { id: 1}
        });
      }, 2000);
  }
  back(){
    window.history.back();
  }
 ngOnInit(){
  this.titleService.setTitle("Ecom | Address")
  this.authService.Addressess.subscribe(data => {
    this.addresses = [...(data ?? [])];
  });
  }
  loadForm(index:number){
    this.addAddressForm = this.fb.group({
      street: [this.addresses?.[index].street, [Validators.required, Validators.minLength(3),Validators.pattern('^[a-zA-Z0-9 ,\\-]*$')]],
      addressLine: [this.addresses?.[index].addressLine,[Validators.pattern('^[a-zA-Z0-9 ,\\-]*$')]],
      city: [this.addresses?.[index].city, [Validators.required, Validators.min(0),Validators.pattern('^[a-z A-Z]*$')]],
      state: [this.addresses?.[index].state, [Validators.required, Validators.required,Validators.pattern('^[a-z A-Z]*$')]],
      pinCode: [this.addresses?.[index].postalCode, [Validators.required, Validators.maxLength(6),Validators.pattern('^[0-9]*$')]]
  })
  }
  editForm(index:number){
    this.showForm = !this.showForm;
    this.loadForm(index);
  }
  toggleForm(){
    this.addAddressForm.reset()
    this.showForm = !this.showForm;
  }
  remove(index:number){
    this.loadProductService.removeAddress(this.addresses?.[index]).subscribe({
      next: (response) => {
        this.addresses?.splice(index, 1);
        this.authService.updateProfileBy(this.addresses);
        this.authService.Addressess.subscribe(data => this.addresses = data);
      }
    });;
  }
}

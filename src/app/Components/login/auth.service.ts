import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { cartitem } from '../../models/cartitem';
import axios from 'axios';
import { Profile } from '../../models/profile.model';
import { Address } from '../../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user = {
    id: 0,
    username: '',
    role: '',
    wishlist: '',
    verified: false
  };

  public signInSubject = new BehaviorSubject<boolean>(this.isUserLoggedIn()); // Actually false
  public isSignIn$ = this.signInSubject.asObservable();
  private profileImageUrl = new BehaviorSubject<any>("");
  public isUrl = this.profileImageUrl.asObservable();
  private userName$ = new BehaviorSubject<string>("");
  public userName$In = this.userName$.asObservable();
  private apiUrl = 'http://localhost:5183/user/login';
  private apiUrlforCart = 'http://localhost:5183/Cart';
  private apiUrlforProfile = 'http://localhost:5183/api/Profile';
  public userProfile: Profile | undefined;

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  initialWishList = new BehaviorSubject<number[]>([]);
  wishList = this.initialWishList.asObservable();
  initialCartList = new BehaviorSubject<number[]>([]);
  cartList = this.initialCartList.asObservable();
  initialAddresses = new BehaviorSubject<Address[] | undefined>([]);
  Addressess = this.initialAddresses.asObservable();

  isUser() {
    return this.user.verified;
  }

  async getUser(email: string, password: string,isAdmin:boolean) {
    try {
      if (typeof window !== 'undefined' && !!!localStorage.getItem('user')) {
        this.user = await lastValueFrom(this.http.post<User>(`${this.apiUrl}`, { email, password, isAdmin}));
        this.userName$.next(this.user.username);
        const response = await axios.get<cartitem[]>(`${this.apiUrlforCart}/${this.user.id}`);
        const cartList = response.data.map((item: cartitem) => item.productId);
        this.updateCart(cartList);
        this.updateWishlistFromString(this.user.wishlist);
        await this.getProfile();
        this.saveUserToStorage();
      }
      return this.user;
    } catch (error) {
      return null;
    }
  }
  async getProfile() {
    try {
      this.userProfile = await lastValueFrom(this.http.get<Profile>(`${this.apiUrlforProfile}/${this.user.id}`));
      this.initialAddresses.next(this.userProfile?.addresses);
      this.profileImageUrl.next(this.userProfile?.profileImage);
    } catch (error) {
    }
  }
  public updateWishlistFromString(wishlistString: string) {
    const updatedList = wishlistString && wishlistString.trim() ? wishlistString.split(",").map(Number) : [];
    this.user.wishlist = updatedList.join(",");
    this.initialWishList.next(updatedList);
    this.saveUserToStorage();
  }
  public getCartFromStorage(): number[] {
    const cart = localStorage.getItem('cartItems');
    return cart ? JSON.parse(cart) : [];
  }

  updateCart(newCart: number[]) {
    this.initialCartList.next(newCart);
    localStorage.setItem('cartItems', JSON.stringify(newCart));
  }

  addToCart(item: number) {
    const updatedCart = [...this.initialCartList.value, item];
    this.updateCart(updatedCart);
  }

  public saveUserToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(this.user));
      if (this.userProfile) {
        localStorage.setItem('profile', JSON.stringify(this.userProfile));
      }
    }
  }

  public loadUserFromStorage() {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      const cartList = this.getCartFromStorage();
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        this.updateWishlistFromString(this.user.wishlist);
        this.updateCart(cartList);
        this.userName$.next(this.user.username);
        this.signInSubject.next(true);
      }
    }
    this.getProfileFromStorage();
  }
  removeUser() {
    this.user = { id: 0, username: '', role: '', wishlist: '', verified: false };
    this.initialWishList.next([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('cartItems');
      this.initialCartList.next([]);
      this.profileImageUrl.next("");
      this.userName$.next("");
      this.signInSubject.next(false);
    }
  }
  isUserLoggedIn() {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('user');
    }
    return false;
  }
  getUserList() {
    return this.user.wishlist.split(",").map(Number);
  }

  getProfileFromStorage() {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        this.userProfile = JSON.parse(storedProfile);
        this.initialAddresses.next(this.userProfile?.addresses);
        this.profileImageUrl.next(this.userProfile?.profileImage);
      }
    }
  }
  async updateProfile(address: Address) {
    await this.getProfile();

    const isDuplicate = this.userProfile?.addresses?.some(existing =>
      existing.street === address.street &&
      existing.addressLine === address.addressLine &&
      existing.city === address.city &&
      existing.state === address.state &&
      existing.postalCode === address.postalCode
    );
    this.initialAddresses.next(this.userProfile?.addresses);
    this.saveUserToStorage();
}

  async updateProfileBy(address: Address[] | undefined){
  if (this.userProfile) {
    this.userProfile = {
      ...this.userProfile,
      addresses: address ?? []
    };
    this.initialAddresses.next(this.userProfile.addresses);
  }
  this.saveUserToStorage();
}
updateImage(url:string){
  if(this.userProfile){
    this.userProfile = {
      ...this.userProfile,
      profileImage:url
    }
  }
  this.saveUserToStorage();
  this.profileImageUrl.next(url);
}
updateName(name:string){
  this.user.username = name;
  this.userName$.next(name);
}
}

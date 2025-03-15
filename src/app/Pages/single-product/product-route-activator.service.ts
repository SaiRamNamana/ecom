import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { LoadProductsService } from '../../Service/load-products.service';

@Injectable({
  providedIn: 'root'
})
export class ProductRouteActivatorService implements CanActivate {
  productList : number[]= []
  constructor(private productService: LoadProductsService, private router: Router) { 
    this.productService.loadedProducts.subscribe(data => this.productList = [...data]);
  }

  canActivate(route: ActivatedRouteSnapshot) {
    const exists = this.productList.indexOf(+route.params['id']);
    if (exists == -1) this.router.navigate(['/404'])
    return true;
  }
}

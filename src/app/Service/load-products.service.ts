import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/products.model';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, lastValueFrom, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadProductsService {

  products: Product[] = []
  products$ = new BehaviorSubject<number[]>([])
  loadedProducts = this.products$.asObservable();
  updatedproduct: any;
  constructor(public http: HttpClient) {
    this.loadInitialProducts();
  }
  private loadInitialProducts() {
    this.getProducts().subscribe(products => this.products$.next(products.map(product => product.id)));
  }
  getProducts(): Observable<Product[]> {
      return this.http.get<Product[]>('http://localhost:5183/api/Product').pipe(
        map(products =>
          products.map(product => ({
            ...product,
            categoryId: product.categoryId,
            rating: { rate: product.rating?.rate ?? 0, count: product.rating?.count ?? 0 },
            count: product.count ?? 0
          }))
        ),
        tap(products => {
          this.products = products;
          this.products$.next(products.map(product => product.id));
        }) 
      );
    }

  getProductsByCategory(categoryId:number){
    return this.http.get<Product[]>(`http://localhost:5183/api/Product/${categoryId}`).pipe(
      map(products =>
        products.map(product => ({
          ...product,
          categoryId: product.categoryId,
          rating: { rate: product.rating?.rate ?? 0, count: product.rating?.count ?? 0 },
          count: product.count ?? 0
        }))
      ),
      tap(products => (this.products = products)) 
    );
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }


  async addNewProduct(product:any){
    try {
      var response = await lastValueFrom(
        this.http.post('http://localhost:5183/api/Product', product, { responseType: 'text' })
      );
      return { message: response };
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(product:any){
    await this.http.put<Product>(`http://localhost:5183/api/Product/update`, product).subscribe(response => {
      this.updatedproduct = response?.count;
    });
  }

  async remove(id:number){
    return await this.http.delete(`http://localhost:5183/api/Product/${id}`);
  }

}

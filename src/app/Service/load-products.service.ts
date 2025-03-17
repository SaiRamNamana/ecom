import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/products.model';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, lastValueFrom, map, tap } from 'rxjs';
import { CategoryItem } from '../models/categoryitem.odel';
import { Category } from '../models/category.model';
import { AuthService } from '../Components/login/auth.service';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class LoadProductsService {

  products: Product[] = []
  products$ = new BehaviorSubject<number[]>([])
  loadedProducts = this.products$.asObservable();
  private baseUrl = 'http://localhost:5183/api/Product';
  private apiUrl = 'http://localhost:5183/api/Profile';
  updatedproduct: any;
  constructor(public http: HttpClient,private authService:AuthService) {
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
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/category`);
  }
  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  addCategory(categoryName: string): Observable<CategoryItem> {
    const params = new HttpParams().set('category', categoryName);

    return this.http.post<CategoryItem>(`${this.baseUrl}/category/add`, {}, { params });
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
  updateAddress(updatedAddress:any){
    return this.http.post<Address>(`${this.apiUrl}/${this.authService.user.id}`,updatedAddress);
  }
  removeAddress(address:Address|undefined){
    return this.http.post<Address>(`${this.apiUrl}/delete/${this.authService.user.id}`,address,{ responseType: 'text' as 'json' });
  }
  getProductsFromList(id:number){
    return this.http.get<Product>(`http://localhost:5183/api/Product/product/${id}`);
  }
  async uploadImage(formData:FormData){
    return await this.http.post<{ filePath: string }>(`http://localhost:5183/api/Profile/upload/${this.authService.user.id}`, formData);
  }
}

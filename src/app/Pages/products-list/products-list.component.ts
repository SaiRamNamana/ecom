import { Component, ElementRef, HostListener, OnInit, output, signal } from '@angular/core';
import { Product } from '../../models/products.model';
import { ProductCardComponent } from "./product-card/product-card.component";
import { LoadProductsService } from '../../Service/load-products.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TitleService } from '../../Service/title.service';
import { faSearch,faSort,faSortAlphaAsc,faSortAlphaDesc,faSortAmountAsc,faSortAmountDesc,faArrowUp,faArrowDown,faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-products-list',
  imports: [ProductCardComponent,FormsModule,CommonModule,FontAwesomeModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css'
})
export class ProductsListComponent implements OnInit{
  products: Product[] = [];
  originalProducts: Product[] = []; 
  isLoading = false;
  searchQuery: string = '';
  selectedSort=''
  selected="";
  activeCategory: string = 'All';
  showDeleteModal = false;
  isNameAsc=true;
  isPriceAsc=true;
  selectedProduct: any = null;
  faSearch = faSearch;
  faSort = faSort;
  faSortAlphaAsc = faSortAlphaAsc ;
  faSortAlphaDesc = faSortAlphaDesc;
  faSortAmountAsc = faSortAmountAsc;
  faSortAmountDesc = faSortAmountDesc;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faCross=faTimes
  dropDownMenu  = false;
  isAsc=true;
  isDsc=false;
  categories: string[] = ['All', 'Electronics', 'Gaming Accessories', 'Storage Devices'];

  constructor(private productService: LoadProductsService,public titleService:TitleService) {}
  
  ngOnInit(){
   this.isLoading = true
    this.loadProducts();
    this.titleService.setTitle("Ecom | Home")
  }

 
  async loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.originalProducts = products; 
      this.isLoading = false;
    });
  }

 
  retrive(category: string) {
    this.isLoading = true;
    this.titleService.setTitle(`Ecom | ${category}`)
    this.activeCategory = category;
    this.searchQuery = ''; 

    if (category === 'All') {
      this.loadProducts();
      return;
    }

    this.productService.getProductsByCategory(this.categories.indexOf(category)).subscribe(products => {
      this.products = products;
      this.originalProducts = products;
      this.isLoading = false;
    });
  }

 
  filterProducts() {
    const query = this.searchQuery.toLowerCase().trim();
    this.isLoading = true;
    if (query === '') {
      this.products = [...this.originalProducts]; 
      return;
    }

    this.products = this.originalProducts.filter(product =>
      product.title.toLowerCase().includes(query)
    );
    this.isLoading = false;
  }

  sortProducts(sortBy:string){
    let pList = [...this.products];
    this.selected = sortBy;
    if(sortBy === 'name' && this.isAsc){
      this.isAsc = false;
      this.isDsc = true;
      pList.sort(sortByName);
    }else if(sortBy === 'price' && this.isAsc){
      this.isAsc = false;
      this.isDsc = true;
      pList.sort(sortByPrice)
    }else if(sortBy === 'name'&& this.isDsc){
      this.isAsc = true;
      this.isDsc = false;
      pList.sort(sortByNameDsc)
    }else if(sortBy === 'price' && this.isDsc){
      this.isAsc = true;
      this.isDsc = false;
      pList.sort(sortByPriceDsc)
    }
    this.products = pList;
  }

  toggleOrder(){
    this.sortProducts(this.selected);
  }
  handleDeleteRequest(product: any) {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  async confirmDelete() {
    (await this.productService.remove(this.selectedProduct.id)).subscribe(response => {
      this.products = this.products.filter(p => p.id !== this.selectedProduct.id);
      this.originalProducts = this.originalProducts.filter(p => p.id !== this.selectedProduct.id);
    });
    this.showDeleteModal = false;
    this.selectedProduct = null;
    window.location.reload();
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }
}

function sortByName(p1:Product,p2:Product){
  if(p1.title > p2.title) return 1;
  else if(p1.title === p2.title) return 0;
  else return -1;
}
function sortByPrice(p1:Product,p2:Product){
  if(p1.price > p2.price) return 1;
  else if(p1.price == p2.price) return 0;
  else return -1;
}
function sortByPriceDsc(p1:Product,p2:Product){
  if(p1.price < p2.price) return 1;
  else if(p1.price == p2.price) return 0;
  else return -1;
}
function sortByNameDsc(p1:Product,p2:Product){
  if(p1.title < p2.title) return 1;
  else if(p1.title === p2.title) return 0;
  else return -1;
}
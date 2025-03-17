import { Component, output } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { Product } from '../../models/products.model';
import { CommonModule, NgIf } from '@angular/common';
import { LoadProductsService } from '../../Service/load-products.service';
import { faEdit, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TitleService } from '../../Service/title.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryItem } from '../../models/categoryitem.odel';
import { Category } from '../../models/category.model';



@Component({
  selector: 'app-add-product',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css'],
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule, FontAwesomeModule]
})
export class AddProductComponent {
  addProductForm: FormGroup;
  isEditing: boolean = false;
  product: Product | undefined;
  btnClicked = output();
  productId: number | undefined;
  isAddingNewCategory = false;
  newCategoryName = '';
  faDelete = faTrash;
  faEdit = faEdit;
  categoryExists = false;
  arrowLeft = faArrowLeft;

  categories: Category[] = [];

  constructor(private fb: FormBuilder, private productService: LoadProductsService, private route: ActivatedRoute, private router: Router, private toaster: ToastrService, public titleService: TitleService, private http: HttpClient) {
    this.addProductForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      price: ['', [Validators.required, Validators.min(1)]],
      rate: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      description: ['', [Validators.required, Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required]
    });
  }
  category = "electronics";

  async saveProduct() {
    if (this.addProductForm.valid) {
      const productData = this.addProductForm.value;

      if (this.productId) {
        const updatedProduct = {
          id: this.productId,
          title: this.addProductForm.value.title,
          image: this.addProductForm.value.image,
          price: this.addProductForm.value.price,
          description: this.addProductForm.value.description,
          stock: this.addProductForm.value.stock,
          categoryId: this.isEditing ? this.product?.categoryId : this.addProductForm.value.categoryId
        };
        try {
          await this.productService.updateProduct(updatedProduct);
          this.toaster.success("Product updated successfully!", "Success");
        } catch (error) {
          this.toaster.error("Failed to update product", "Error");
        }
      } else {
        try {
          const response = await this.productService.addNewProduct(productData);
          if (response.message === 'Product Created') {
            this.toaster.success('Product added successfully!', 'Success');
          } else {
            this.toaster.warning('Product already exists!', 'Failed to add');
          }
        } catch (error) {
          this.toaster.error("Failed to add product", "Error");
        }
      }

      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.productService.getCategories().subscribe(response => {
      this.categories = [...response];
    });
    this.route.paramMap.subscribe(async params => {
      this.productId = Number(params.get('id'));
      if (this.productId) {
        this.titleService.setTitle("Ecom | Edit Product");
        this.isEditing = true;
        this.loadProduct(this.productId);
      } else {
        this.isEditing = false;
        this.titleService.setTitle("Ecom | Add Product");
        this.initializeForm();
      }
    });
  }

  checkNewCategory(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.isAddingNewCategory = selectedValue === 'new';
  }
  addNewCategory() {
    this.categoryExists = false;
    if (this.addProductForm.value.newCategory.trim() && 
    this.categories.filter(category => category.name.toLocaleLowerCase() === this.addProductForm.value.newCategory.toLocaleLowerCase()).length === 0) {
      this.productService.addCategory(this.addProductForm.value.newCategory)
        .subscribe((response: CategoryItem) => {
          if (response && response.id) {
            const newCategory = {
              id: response.id,
              name: this.addProductForm.value.newCategory,
            };

            this.categories.push(newCategory);
            this.addProductForm.patchValue({ newCategory: '' });
            this.addProductForm.patchValue({ categoryId: newCategory.id });
          }
        });
    }
    else {
      this.categoryExists = true;
      this.addProductForm.patchValue({ newCategory: '' });
    }
  }
  async loadProduct(id: number) {
    this.product = await this.productService.getProductById(id);
    if (this.product) {
      this.addProductForm = this.fb.group({
        title: [this.product.title, [Validators.required, Validators.minLength(3)]],
        image: [this.product.image, [Validators.required, Validators.pattern('https?://.+')]],
        price: [this.product.price, [Validators.required, Validators.min(1)]],
        description: [this.product.description, [Validators.required]],
        stock: [this.product.stock, [Validators.required, Validators.min(0)]],
      });
    }
  }

  initializeForm() {
    this.addProductForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required, Validators.pattern('https?://.+')]],
      price: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]],
      stock: ['', [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      newCategory: ['', Validators.pattern('^[a-zA-Z]+$')]
    });
  }
  back() {
    window.history.back();
  }
}

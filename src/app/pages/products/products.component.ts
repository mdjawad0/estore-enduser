import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Products } from 'src/app/models/products';
import { DbService } from 'src/app/services/db.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  fetching: boolean = false;
  products: Products[] = [];
  tempProducts: Products[] = [];
  cartProducts: any[] = [];
  whishlistProducts: any[] = [];

  categories: Category[] = [];
  selectedCategoryIdx: number = 0;


  constructor(
    private httpClient: HttpClient,
    public db: DbService,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetching = true;
    this.db.getProducts();
    this.db.getCategoeies();
    
    combineLatest([this.db.productsSub, this.db.categoriessSub])
      .subscribe({
        next: ([products, categories]) => {
          this.fetching = false
          if(products.length !== 0) {
            this.products = products;
            this.tempProducts = products;
          }
          if(categories.length !== 0) {
            this.categories.splice(0, 0, { categoryId: "", categoryName: "All" });
            this.categories = categories;
          }
        },
        error: (error) => {
          this.fetching = false
          // console.log(error);
        }
      })
  }

  filtersProductsBasedCategory(categoryId: string, selectedCategoryIdx: number) {
    this.selectedCategoryIdx = selectedCategoryIdx;
    if(categoryId === "") {
      this.products = [ ...this.tempProducts ];
    } else {
      this.products = this.tempProducts.filter(x => x.categoryId === categoryId);
    }
  }

}

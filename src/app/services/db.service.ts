import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, map, of, take, tap } from 'rxjs';
import { BaseUrls } from '../base-urls';
import { Category } from '../models/category';
import { Products } from '../models/products';
import { Users } from '../models/users';

@Injectable({
  providedIn: 'root',
})
export class DbService {

  public user: Users | null = null;
  public products: any[] = [];
  public whishlistProducts: any[] = [];

  productsSub: BehaviorSubject<Products[]> = new BehaviorSubject<Products[]>([]);
  productsRetreived: boolean = false;

  categoriessSub: BehaviorSubject<Category[]> = new BehaviorSubject<Category[]>([]);
  categoriessRetreived: boolean = false;

  wishlistsSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  wishlistsRetreived: boolean = false;

  cartsSub: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  cartsRetreived: boolean = false;

  orders: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  ordersRetreived: boolean = false;

  constructor(
    private http: HttpClient,
    private toast: ToastrService,
  ) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}'); 
    this.getUserWishlist();
    this.getUserCart();
  }

  getProducts() {
    if (!this.productsRetreived) {
      this.http.get(BaseUrls.getUrl(BaseUrls.PRODUCT_GROUPURL))
      .subscribe({
        next: ({ code, message, data }: any) => {
          this.productsSub.next(Object.assign([], data))
          this.productsRetreived = true
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  getOrders() {
    if(!this.ordersRetreived) {
      this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.ORDER_GROUPURL}/get-user-orders/${this.user?.userId}`)
      .subscribe({
        next: ({ code, message, data }: any) => {
          this.orders.next(Object.assign([], data))
          this.ordersRetreived = true
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  getCategoeies() {
    if(!this.categoriessRetreived) {
      this.http.get(BaseUrls.getUrl(BaseUrls.CATEGORIES_GROUPURL))
      .subscribe({
        next: ({ code, message, data }: any) => {
          this.categoriessSub.next(Object.assign([], data))
          this.categoriessRetreived = true
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  getUserWishlist(): void {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.WISHLIST_GROUPURL}/get-user-wishlist/${this.user?.userId}`)
      .subscribe({
        next: async ({ data }: any) => {
          let response = Array.from(data);
          let ids = response.map((e: any) => e['productId']).join(",")
          if(ids.length !== 0) {
            let prdList: any = await this.getParticularProductsBasedOnIds(ids);
            let wishlist = response.map((wObj: any, idx: number) => {
              let prd = prdList.find((x: any) => x.productId === wObj['productId']);
              delete prd.productId;
              return { ...wObj, ...prd };
            });
            this.wishlistsSub.next(wishlist);
          }
        },
        error: (error) => this.toast.warning("Something Went Wrong!! Please Again...", "Failed")
      });
  }

  getUserCart(): void {
    this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.CART_GROUPURL}/get-user-cart/${this.user?.userId}`)
      .subscribe({
        next: async ({ data }: any) => {
          let response = Array.from(data);
          let ids = response.map((e: any) => e['productId']).join(",")
          if(ids.length !== 0) {
            let prdList: any = await this.getParticularProductsBasedOnIds(ids);
            let cart = response.map((cObj: any, idx: number) => {
              let prd = prdList.find((x: any) => x.productId === cObj['productId']);
              delete prd.productId;
              return { ...cObj, ...prd };
            });
            this.cartsSub.next(cart);
          }
        },
        error: (error) => this.toast.warning("Something Went Wrong!! Please Again...", "Failed")
      });
  }

  async getParticularProductsBasedOnIds(ids: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${BaseUrls.BASE_HREF}/${BaseUrls.PRODUCT_GROUPURL}/get-products?productIds=${ids}`).pipe(
        map(({ code, message, data }: any) => {
          this.getUserWishlist();
          resolve(data);
        }),
        catchError(error => of(error))
      ).subscribe();
    });
  }

  addProductToList(productId: any, cartBool: boolean): void {
    let formData = new FormData();
    formData.append("productId", productId);
    formData.append("userId", this.user?.userId);

    this.http.post(BaseUrls.getAddUrl(cartBool ? BaseUrls.CART_GROUPURL : BaseUrls.WISHLIST_GROUPURL), formData)
      .subscribe({
        next: (value: any) => {
          if(cartBool) this.getUserCart(); else this.getUserWishlist();
          this.toast.success(`Product added to ${ cartBool ? 'shopping cart' : 'wishlist' }`, "Success");
        },
        error: (error) => {
          console.log(error);
          this.toast.warning("Something Went Wrong!! Please Again...", "Failed");
        }
      })
  }

  removeItemFromList(id: number, cartBool: boolean, showToast: boolean = true): void {
    this.http.get(`${BaseUrls.getDeleteUrl(cartBool ? BaseUrls.CART_GROUPURL : BaseUrls.WISHLIST_GROUPURL)}/${id}`)
      .subscribe({
        next: (value: any) => {
          if(cartBool) this.getUserCart(); else this.getUserWishlist();
          showToast && this.toast.success(`Product removed from ${ cartBool ? 'shopping cart' : 'wishlist' }`, 'Success')
        },
        error: (error) => {
          console.log(error);
          this.toast.warning("Something Went Wrong!! Please Again...", "Failed");
        }
      });
  }

  moveProduct(prd: any, cartBool: boolean = false): any {
    this.addProductToList(prd['productId'], !cartBool);
    this.removeItemFromList(prd[cartBool ? 'cartId' : 'wishListId'], cartBool);
  }

}

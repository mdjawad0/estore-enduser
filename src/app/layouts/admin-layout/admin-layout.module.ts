import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { ProductsComponent } from '../../pages/products/products.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { ShoppingCartComponent } from '../../pages/shopping-cart/shopping-cart.component';
import { WhishlistComponent } from '../../pages/whishlist/whishlist.component';
import { CheckoutComponent } from '../../pages/checkout/checkout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersComponent } from '../../pages/orders/orders.component';


@NgModule({
  declarations: [
    ProductsComponent,
    UserProfileComponent,
    ShoppingCartComponent,
    WhishlistComponent,
    CheckoutComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminLayoutModule { }

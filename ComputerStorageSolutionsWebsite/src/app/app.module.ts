import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductpageComponent } from './productpage/productpage.component';
import { SignuppageComponent } from './signuppage/signuppage.component';
import { CartpageComponent } from './cartpage/cartpage.component';
import { OrderspageComponent } from './orderspage/orderspage.component';
import { BuyNowPageComponent } from './buy-now-page/buy-now-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NgOptimizedImage } from '@angular/common';
import { AddProductpageComponent } from './add-productpage/add-productpage.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { StatisticsComponent } from './statistics/statistics.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    ProductpageComponent,
    SignuppageComponent,
    CartpageComponent,
    OrderspageComponent,
    BuyNowPageComponent,
    NavBarComponent,
    AddProductpageComponent,
    ModifyProductComponent,
    ManageUsersComponent,
    StatisticsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgOptimizedImage,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

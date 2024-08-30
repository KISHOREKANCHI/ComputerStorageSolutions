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

@NgModule({
  declarations: [
    AppComponent,
    LoginpageComponent,
    ProductpageComponent,
    SignuppageComponent,
    CartpageComponent,
    OrderspageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

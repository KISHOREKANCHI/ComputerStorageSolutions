import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
import { ProductpageComponent } from './productpage/productpage.component';
import { SignuppageComponent } from './signuppage/signuppage.component';
import { BuyNowPageComponent } from './buy-now-page/buy-now-page.component';
import { CartpageComponent } from './cartpage/cartpage.component';
import { OrderspageComponent } from './orderspage/orderspage.component';
import { AddProductpageComponent } from './add-productpage/add-productpage.component';
import { ModifyProductComponent } from './modify-product/modify-product.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path:'login',component:LoginpageComponent},
  {path:'products',component:ProductpageComponent},
  {path:'signup',component:SignuppageComponent},
  {path: 'Products/:id', component: BuyNowPageComponent },
  {path: 'Cart', component: CartpageComponent },
  {path:'Orders',component:OrderspageComponent},
  {path:'AddProduct',component:AddProductpageComponent},
  {path:'ModifyProduct',component:ModifyProductComponent},
  {path:'ManageUsers',component:ManageUsersComponent},
  {path:'Statistics',component:StatisticsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

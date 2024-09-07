import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './orderspage.component.html',
  styleUrls: ['./orderspage.component.css']
})
export class OrderspageComponent implements OnInit {
  orders: any[] = [];
  Username: any;
  serverUrl=environment.serverUrl;

  constructor(
    private apiService: ApiServiceService,
    private manager : CookieManagerService,
    private router:Router){}

  ngOnInit(){
    const expiry = 1;
    this.manager.checkToken(expiry);
    const token = (document.cookie.split(';')[0]);
    const Jwttoken = jwtDecode<any>(atob(token.replace("token=", "")));
    this.Username = Jwttoken.UserName;
    this.getUserOrders();
  }


  getUserOrders(): void {
    this.apiService.getUserOrders().subscribe({
      next: (result: any) => {
        this.orders = result;        
      },
      error: (error) => {
      }
    });
  }

  navigateToProductDetails(productId: string): void {
    this.router.navigate(['Products', productId]);
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-order',
  templateUrl: './orderspage.component.html',
  styleUrls: ['./orderspage.component.css']
})
export class OrderspageComponent implements OnInit {
  orders: any[] = [];
  Username: any;

  constructor(private apiService: ApiServiceService,private manager : CookieManagerService){}

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
}

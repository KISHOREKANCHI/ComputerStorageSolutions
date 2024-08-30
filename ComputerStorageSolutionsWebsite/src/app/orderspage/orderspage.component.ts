import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';

@Component({
  selector: 'app-order',
  templateUrl: './orderspage.component.html',
  styleUrls: ['./orderspage.component.css']
})
export class OrderspageComponent implements OnInit {
  orders: any[] = [];

  constructor(private apiService: ApiServiceService,private manager : CookieManagerService){}

  ngOnInit(){
    const expiry = 1;
    this.manager.checkToken(expiry);
    this.getUserOrders();
  }


  getUserOrders(): void {
    this.apiService.getUserOrders().subscribe({
      next: (data: any) => {
        this.orders = data;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }  
}

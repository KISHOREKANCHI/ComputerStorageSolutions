import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';

@Component({
  selector: 'app-buy-now-page',
  templateUrl: './buy-now-page.component.html',
  styleUrls: ['./buy-now-page.component.css']
})
export class BuyNowPageComponent implements OnInit {

  productId!: string; // Changed to string to match the ID type from the route
  product: any;
  Address = {
    name: '',
    address: '',
    city: '',
    zip: ''
  };
  shippingAddress:string= '';
  popupVisible: boolean = false;
  popupText: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiServiceService, private manager:CookieManagerService,private router:Router) { }

  ngOnInit(): void {
    const expiry = 1;
    this.manager.checkToken(expiry);

    this.route.params.subscribe(params => {
      this.productId = params['id']; // Get product ID from route
      this.getProductDetails(this.productId);
    });
  }

  getProductDetails(id: string): void {
    this.apiService.getProductById(id).subscribe((response: any) => {
      this.product = response[0]; // Store product details
    });
  }

  OrderProduct() {
    if (this.Address.name && this.Address.address && this.Address.city && this.Address.zip) {
      this.shippingAddress = `${this.Address.name}, ${this.Address.address}, ${this.Address.city}, ${this.Address.zip}`;
      
      // Create the product order list
      const productOrders = [
        {
          ProductId: this.productId,
          Quantity: 1 // Assuming a quantity of 1 for simplicity, you can change this as needed
        }
      ];

      // Call the placeOrder API with the productOrders list and shippingAddress
      this.apiService.placeOrder(productOrders, this.shippingAddress).subscribe({
        next: (response) => {
          this.showPopup(response);
        },
        error: (error) => {
          this,this.showPopup(error);
        }
      });
      setTimeout(()=>{
        this.router.navigate(['Orders']);
      },2000);

    } else {
      this.showPopup('Please fill in all fields.');
    }
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }
}

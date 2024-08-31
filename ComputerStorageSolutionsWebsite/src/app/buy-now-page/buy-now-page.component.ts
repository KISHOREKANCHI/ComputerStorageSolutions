import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private apiService: ApiServiceService, private manager:CookieManagerService) { }

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
          console.log('Order placed successfully:', response);
          // Handle successful order placement (e.g., navigate to another page, show success message)
        },
        error: (error) => {
          console.error('Error placing order:', error);
          // Handle error (e.g., show error message)
        }
      });

    } else {
      console.log('Please fill in all fields.');
      // Handle case where address fields are not filled in
    }
  }
}

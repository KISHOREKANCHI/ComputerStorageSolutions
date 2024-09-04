import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.component.html',
  styleUrls: ['./cartpage.component.css']
})
export class CartpageComponent implements OnInit {
  cartItems: any[] = [];
  Quantity: number = 1;
  popupText: string = "";
  popupVisible: boolean = false;
  selectAll: boolean = false; 
  Address = {
    name: '',
    address: '',
    city: '',
    zip: ''
  };
  shippingAddress: string ='';

  constructor(private apiService:ApiServiceService,private manager:CookieManagerService,private route:Router){}

  ngOnInit(): void {
    this.loadCart();
    const expiry = 1;
    this.manager.checkToken(expiry);
  }

  loadCart(): void {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartItems.forEach(item => item.checked = false); // Initialize checked property
  }

  updateQuantity(item: any, change: number): void {
    if (item.quantity + change >= 0) {
      item.quantity += change;
      this.saveCart();
    }
  }

  removeFromCart(productId: string): void {
    const index = this.cartItems.findIndex(item => item.ProductId === productId);
    if (index !== -1) {
      this.cartItems.splice(index, 1); // Remove the item at the found index
      this.saveCart(); // Save the updated cart to localStorage
    }
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  placeOrder(event: Event): void {
    event.preventDefault(); // Prevent default form submission
  
    // Create the shipping address string
    this.shippingAddress = `${this.Address.name}, ${this.Address.address}, ${this.Address.city}, ${this.Address.zip}`;
  
    // Filter items that are checked for the order
    const itemsToOrder = this.cartItems.filter(item => item.checked);
    
    // Ensure at least one item is selected for ordering
    if (itemsToOrder.length === 0) {
      this.showPopup("Please select at least one item to place an order.");
      return;
    }
    if ((this.Address.name || this.Address.address || this.Address.city || this.Address.zip)=== ''){
      this.showPopup("Field/s cannot be empty in Billing Address");
      return;
    }
  
    interface ProductOrder {
      productId: string; // Use the correct type for ProductId (string, number, etc.)
      quantity: number;  // Ensure quantity is a number
    }
    // Prepare the order details according to the API format
    const orderDetails: ProductOrder[] = itemsToOrder.map(item => ({
      productId: item.ProductId,  // Ensure this is the correct property for ProductId
      quantity: item.Quantity      // Ensure this is the correct property for quantity
    })); 

    this.apiService.placeOrder(orderDetails, this.shippingAddress).subscribe({
      next: (response) => {
        this.showPopup(`${response}`);
        // Handle successful order placement (e.g., navigate to another page, show success message)
      },
      error: (error) => {
        this.showPopup(`${error}`);
        // Handle error (e.g., show error message)
      }
    });
    setTimeout(()=>{
      this.route.navigate(['Orders']);
    },2000);
  }
  
  

  onQuantityChange(event: Event, item: any): void {
    const inputElement = event.target as HTMLInputElement;
    const quantityStr = inputElement.value;

    // Only convert to a number if the input is not empty
    if (quantityStr !== '') {
      const quantity = Number(quantityStr);

      if (quantity <= 0) {
          this.removeFromCart(item.ProductId);
      }else if (quantity > 0 && quantity < 10) {
        if (quantity > item.stockQuantity) {
          this.showPopup(`Available quantity is ${item.stockQuantity}`);
        }
        item.quantity = quantity; // Update item quantity
        this.saveCart();
      }else {
        this.showPopup("Max quantity is 10");
      }
    }
  }


  getTotalAmount(): number {
    return this.cartItems
      .filter(item => item.checked) // Filter for checked items
      .reduce((total, item) => total + (item.Quantity * item.price), 0); // Calculate total
  }
  isCartEmpty(): boolean {
    return this.cartItems.length === 0;
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 3000);
  }

  toggleSelection(item: any): void {
  item.checked = !item.checked;
  }

  toggleSelectAll(): void {
    const allChecked = this.cartItems.every(item => item.checked);
    this.cartItems.forEach(item => item.checked = !allChecked); // Toggle check/uncheck
  }

  allSelected(): boolean {
    return this.cartItems.every(item => item.checked);
  }
}

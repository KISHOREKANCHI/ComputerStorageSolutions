import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.component.html',
  styleUrls: ['./cartpage.component.css']
})
export class CartpageComponent implements OnInit {
  cartItems: any[] = [];
  Quantity:number=1;

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log("get cart items",this.cartItems);
    this.cartItems.forEach(item => item.checked = false); // Initialize checked property
  }

  updateQuantity(item: any, change: number): void {
    if (item.quantity + change >= 0) {
      item.quantity += change;
      this.saveCart();
    }
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.saveCart();
  }

  saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  placeOrder(): void {
    const itemsToOrder = this.cartItems.filter(item => item.checked);
  }

  onQuantityChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = Number(inputElement.value);
    this.Quantity=quantity;
  }  

  
}

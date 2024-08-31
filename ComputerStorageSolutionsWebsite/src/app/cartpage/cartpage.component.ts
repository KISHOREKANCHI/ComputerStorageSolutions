import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cartpage',
  templateUrl: './cartpage.component.html',
  styleUrls: ['./cartpage.component.css']
})
export class CartpageComponent implements OnInit {
  cartItems: any[] = [];
  Quantity: number = 1;
  popupText: string ="";
  popupVisible: boolean = false;

  ngOnInit(): void {
    this.loadCart();
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

  placeOrder(): void {
    const itemsToOrder = this.cartItems.filter(item => item.checked);
    // Implement order placement logic here
  }

  onQuantityChange(event: Event, item: any): void {
    const inputElement = event.target as HTMLInputElement;
    const quantity = Number(inputElement.value);
    if (quantity > 0 && quantity<10) {
      item.quantity = quantity;
      this.saveCart();
    }else if(quantity>=10){
      this.showPopup("Max quantity is 10");
    }else{
      this.removeFromCart(item.ProductId);
    }
  }

  getTotalAmount(): number {
    return this.cartItems.reduce((total, item) => total + (item.Quantity * item.price), 0);
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
}

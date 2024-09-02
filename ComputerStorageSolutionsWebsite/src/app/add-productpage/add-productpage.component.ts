import { Component } from '@angular/core';

@Component({
  selector: 'app-add-productpage',
  templateUrl: './add-productpage.component.html',
  styleUrls: ['./add-productpage.component.css']
})
export class AddProductpageComponent {
  // Properties to store product details
  product = {
    productId: '',
    productName: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    status: 'available',
    imageUrl: '',
  };
  popupVisible: boolean = false;
  popupText: string = '';

  // Property to toggle the upload option visibility
  showUploadOption = false;

  // Method to handle image upload
  uploadImage(productId: string) {
    console.log(`Uploading image for product ID: ${productId}`);
    // Implement your image upload logic here
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }

  addProduct(){
    this.showPopup(`${this.product.productName} added Successfully`)
  }
}

import { Component } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';

@Component({
  selector: 'app-add-productpage',
  templateUrl: './add-productpage.component.html',
  styleUrls: ['./add-productpage.component.css']
})
export class AddProductpageComponent {

  constructor(private apiService: ApiServiceService,){}

  // Properties to store product details
  product = {
    productName: '',
    description: '',
    price: 0,
    categoryId: '',
    stockQuantity: 0,
    status: '',
  };
  popupVisible: boolean = false;
  popupText: string = '';
  selectedFile: File | null = null;

  // Property to toggle the upload option visibility
  showUploadOption = false;

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }

  addProduct() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('productName', this.product.productName);
      formData.append('description', this.product.description);
      formData.append('price', this.product.price.toString()); // Ensure price is a string
      formData.append('categoryId', this.product.categoryId.toString()); // Ensure categoryId is a string
      formData.append('stockQuantity', this.product.stockQuantity.toString()); // Ensure stockQuantity is a string
      formData.append('status', this.product.status);

      console.log('Form Data Entries:');
    console.log('Image:', formData.get('image'));
    console.log('Product Name:', formData.get('productName'));
    console.log('Description:', formData.get('description'));
    console.log('Price:', formData.get('price'));
    console.log('Category ID:', formData.get('categoryId'));
    console.log('Stock Quantity:', formData.get('stockQuantity'));
    console.log('Status:', formData.get('status'));
      this.apiService.AddProduct(formData).subscribe({
        next: response => {
          this.showPopup(`${this.product.productName} added successfully`);
          // this.resetForm(); // Optionally reset the form after successful addition
        },
        error: err => {
          console.log(err);
          this.showPopup('Error adding product');
        },
        complete: () => {
          console.log('Product upload complete');
        }
      });
    } else {
      this.showPopup('Please select an image');
    }
  }


  onFileChange(event: any,files:any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = <File>files[0]; // Set the selected file
      console.log("Selected file:", this.selectedFile);
    }
  }

  resetForm() {
    // Reset the product fields
    this.product = {
      productName: '',
      description: '',
      price:0,
      categoryId: '',
      stockQuantity: 0,
      status: 'available'
    };
    this.selectedFile = null; // Reset selected file
    this.showUploadOption = false; // Hide upload option
  }
}

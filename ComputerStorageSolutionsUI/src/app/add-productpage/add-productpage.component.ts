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
    price: '',
    categoryId: '',
    stockQuantity: '',
    status: '',
  };
  popupVisible: boolean = false;
  popupText: string = '';
  selectedFile: File | null = null;
  uploadedImage: string | ArrayBuffer | null = null;
  errorMessage: string = '';

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
    this.errorMessage = ''

    if (!this.product.productName || !this.product.description || 
      this.product.price == null || !this.product.categoryId || 
      this.product.stockQuantity == null || !this.product.status) {
      this.errorMessage = 'All fields are required!';
      return;
    }
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('productName', this.product.productName);
      formData.append('description', this.product.description);
      formData.append('price', this.product.price.toString()); // Ensure price is a string
      formData.append('categoryId', this.product.categoryId.toString()); // Ensure categoryId is a string
      formData.append('stockQuantity', this.product.stockQuantity.toString()); // Ensure stockQuantity is a string
      formData.append('status', this.product.status);

      this.apiService.AddProduct(formData).subscribe({
        next: response => {
          this.showPopup(`${this.product.productName} added successfully`);
          this.resetForm(); // Optionally reset the form after successful addition
        },
        error: err => {
          this.showPopup('Error adding product');
        },
      });
    } else {
      this.showPopup('Please select an image');
    }
  }


  onFileChange(event: any,files:any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = <File>files[0];
      
      const validImageTypes = [
        'image/jpeg', 'image/png', 'image/gif', 
        'image/bmp', 'image/tiff', 'image/webp' , 'image/jpg'
      ];

      if (!validImageTypes.includes(this.selectedFile.type)) {
        this.showPopup('Invalid file type. Only Images are allowed.');
        return;
      }

      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (this.selectedFile.size > maxSizeInBytes) {
        this.showPopup('File size exceeds the 2MB limit.');
        return;
      }
      
      // Set the selected file
      const reader = new FileReader();
      reader.onload = (e) => {
        // Check if e.target is not null
        if (e.target && e.target.result) {
          this.uploadedImage = e.target.result; // Set uploaded image to display
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  resetForm() {
    // Reset the product fields
    this.product = {
      productName: '',
      description: '',
      price: '',
      categoryId: '',
      stockQuantity: '',
      status: ''
    };
    this.selectedFile = null; // Reset selected file
    this.uploadedImage = null; // Clear the uploaded image
    this.showUploadOption = false; // Hide upload option
    this.errorMessage = ''; // Clear any error message
  }

  
  
}

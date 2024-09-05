import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-modify-product',
  templateUrl: './modify-product.component.html',
  styleUrls: ['./modify-product.component.css']
})
export class ModifyProductComponent {
  Username: string = '';
  ProductDetails: any[] = [];
  FilteredProducts: any[] = [];
  productId: string | null = null;
  categoryId: number | null = null;
  popupVisible: boolean = false;
  popupText: string = '';
  searchTerm: string = '';
  productsCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  paginationList: number[] = [];
  Role: string ='';
  role:string ='9c06200d-5af1-4b14-bb74-9364b10977fe'
  showUploadOption: boolean = false;
  showEditName: boolean = false;
  showEditDescription: boolean = false;
  showEditPrice: boolean = false;
  showUploadOptions: boolean[] = [];
  uploadedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  errorMessage: string = '';
  product = {
    productName: '',
    description: '',
    price: '',
    categoryId: '',
    stockQuantity: '',
    status: '',
  };


  constructor(
    private apiService: ApiServiceService,
    private manager: CookieManagerService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const expiry = 1;
    this.manager.checkToken(expiry);
    this.loadProducts();
  }
  
  loadProducts(): void {
    const token = document.cookie.split(';')[0];
    const Jwttoken = jwtDecode<any>(atob(token.replace('token=', '')));
    this.Username = Jwttoken.UserName;
    this.Role=Jwttoken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    this.apiService.getAllProducts().subscribe({
      next: (response: any) => {
        this.ProductDetails = response;
        this.FilteredProducts = this.ProductDetails;
        console.log(this.ProductDetails);
      },
    });
  }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.apiService.getProducts(pageNumber, this.pageSize).subscribe({
      next: (response: any) => {
        this.ProductDetails = response;
        this.FilteredProducts = this.ProductDetails;
      },
    });
  }

  modifyField(field: string, productId: number) {
      // Logic for modifying fields like name, description, price
  }

  toggleCart(categoryId: number, description: string, imageUrl: string, price: number,    productId: number, productName: string, stockQuantity: number) {
      // Logic for toggling cart state
  }


  editField(field: string, product: any) {
    if (field === 'name') {
      product.isEditingName = true;
    } else if (field === 'description') {
      product.isEditingDescription = true;
    } else if (field === 'price') {
      product.isEditingPrice = true;
    }
  }

  onFileChange(event: any,files:any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = <File>files[0]; // Set the selected file
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

  AddProduct(){
    this.router.navigate(['AddProduct']);
  }

  ModifyProduct() {  
  this.router.navigate(['/ModifyProduct'])
  }

  public filterByCategory(categoryId: number | null): void {
    if (categoryId === null) {
      this.FilteredProducts = this.ProductDetails;
    } else {
      this.FilteredProducts = this.ProductDetails.filter(
        (product) => product.categoryId === categoryId
      );
    }
  }

  searchProducts(): void {
    if (this.searchTerm) {
      this.FilteredProducts = this.ProductDetails.filter((product) =>
        product.productName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.FilteredProducts = this.ProductDetails; // Reset to show all products if searchTerm is empty
    }

    this.cdRef.detectChanges(); // Trigger change detection manually
  }

  logout(): void {
    this.router.navigate(['login']);
    function expireCookie(name: string) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
    expireCookie('token');
  }

  handleMouseEnter(index: number) {
    this.showUploadOptions[index] = true;
  }

  handleMouseLeave(index: number) {
    this.showUploadOptions[index] = false;
  }

  ManageUsers(){
    this.router.navigate(['ManageUsers'])
  }

  UpdateProduct(ProductId:any) {
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

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }
}

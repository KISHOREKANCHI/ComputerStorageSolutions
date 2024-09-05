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
  Role: string ='';
  role:string ='9c06200d-5af1-4b14-bb74-9364b10977fe'
  showUploadOption: boolean = false;
  showEditName: boolean = false;
  showEditDescription: boolean = false;
  showEditPrice: boolean = false;
  showUploadOptions: boolean[] = [];
  selectedFile: File | null = null;
  uploadedImage: (string | ArrayBuffer | null)[] = [];
  OriginalProductDetails: any[] = [];

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
        this.OriginalProductDetails = this.ProductDetails.map(product => ({ ...product }));
        this.showUploadOptions = new Array(this.ProductDetails.length).fill(false); // Initialize the upload options array
        this.uploadedImage = new Array(this.ProductDetails.length).fill(null);
      },
    });
  }

  resetForm(index:number): void {
    this.ProductDetails[index] = { ...this.OriginalProductDetails[index] }; // Reset the product to its original data
    this.uploadedImage[index] = null; // Clear any uploaded images for this product
    this.cdRef.detectChanges(); // Trigger change detection manually
  }
  
  UpdateProduct(ProductId:string){
    const product = this.ProductDetails.find(p => p.productId === ProductId);
    if (!product.productName || !product.description || 
      product.price == null || product.categoryId || 
      product.stockQuantity == null || product.status) {
      const formData = new FormData();
      formData.append('ProductId',ProductId);
      formData.append('productName', product.productName);
      formData.append('description', product.description);
      formData.append('price', product.price.toString());
      formData.append('categoryId', product.categoryId.toString());
      formData.append('stockQuantity', product.stockQuantity.toString());
      formData.append('status', product.status);
      if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
      }

      // Convert the FormData object to an array of [key, value] pairs
      // formData.forEach((value, key) => {
      //     console.log(key,value)
      // });

      this.apiService.ModifyProduct(formData).subscribe({
        next: (response) => {
          this.showPopup(response.message); 
        },
        error: err => {
          console.log(err);
          this.showPopup(err);
        },
      });
    }
    else{
      this.showPopup("all fields are required")
    }  
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

  onFileChange(event: any,index:number,files:any):void{
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = <File>files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        // Check if e.target is not null
        if (e.target && e.target.result) {
          this.uploadedImage[index] = e.target.result; // Set uploaded image to display
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
    localStorage.clear();
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

  Statistics(){
    this.router.navigate(['Statistics']);
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }
}
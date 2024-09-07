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
  categoryId: any;
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
  productsCount: number = 0;
  pageNumber: number = 1;
  pageSize: number = 5;
  paginationList: number[] = [];
  categories:any;

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
    this.getCategories()
  }

  checkCookieExists(): boolean {
    const cookies = document.cookie.split('; '); // Split cookies into an array
    const exists = cookies.some(cookie => cookie.startsWith(`token=`)); // Check if any cookie starts with the specified name
    return exists; // Return the boolean value
  }
  
  loadProducts(): void {
    const token = document.cookie.split(';')[0];
    const Jwttoken = jwtDecode<any>(atob(token.replace('token=', '')));
    this.Username = Jwttoken.UserName;
    this.Role = Jwttoken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    this.apiService.getProductCount().subscribe({
      next: (res) => {
        this.productsCount = res;
        this.paginationList = new Array(Math.ceil(res / this.pageSize));
        this.cdRef.detectChanges(); // Ensure change detection after updating paginationList
        this.getPage(1); // Fetch the first page of products
      },
      error: (err) => {
        console.error('Failed to load product count', err);
      }
    });

    this.apiService.getProducts(this.pageNumber, this.pageSize).subscribe({
      next: (response: any) => {
        this.ProductDetails = response;
        this.FilteredProducts = this.ProductDetails;
        this.cdRef.detectChanges(); // Ensure change detection after updating ProductDetails
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.popupText = 'Unable to load products. Please try again later.';
        this.popupVisible = true;
      }
    });
  }

  getCategories() {
    this.apiService.getCategories().subscribe({
      next: (result: any) => {
        this.categories = result;  // Store the fetched categories
        console.log(result);
      },
      error: (error: any) => {
        console.error('Error fetching categories', error);  // Handle errors if needed
      }
    });
  }

  filterByCategory(categoryId: any): void {
    this.searchTerm=''
    console.log("called categoryId",categoryId)
    if (categoryId === null) {
      this.loadProducts();
    } else {
        this.apiService.getProductCountbyCategory(categoryId).subscribe({
          next: (res) => {
            this.productsCount = res;
            this.paginationList = new Array(Math.ceil(res / this.pageSize));
            this.cdRef.detectChanges(); // Ensure change detection after updating paginationList
          },
          error: (err) => {
            console.error('Failed to load product count', err);
          }
        });
    
        this.apiService.getProductByCategory(categoryId,this.pageNumber, this.pageSize).subscribe({
          next: (response: any) => {
            this.ProductDetails = response;
            this.FilteredProducts = this.ProductDetails;
            this.cdRef.detectChanges(); 
          },
          error: (err) => {
            console.error('Failed to load products by category', err);
            this.popupText = 'Unable to load products by category. Please try again later.';
            this.popupVisible = true;
          }
        })
    }
  }

  searchProducts(): void {
    this.categoryId=null;
    if (this.searchTerm) {
      this.apiService.getProductCountBySearch(this.searchTerm).subscribe({
        next: (res) => {
          this.productsCount = res;
          console.log(res)
          this.paginationList = new Array(Math.ceil(res / this.pageSize)); // Update pagination based on search results
          console.log("pagination List",this.paginationList)
          this.cdRef.detectChanges(); // Ensure change detection after updating paginationList
          this.getPage(this.pageNumber); // Fetch the first page of results
        },
        error: (err) => {
          console.error('Failed to get product count by search', err);
          this.popupText = 'Failed to get product count by search';
          this.popupVisible = true;
        }
      });
    }else {
      this.loadProducts();
      console.log("failed search")
    }
  }

  getPage(pageNumber: number): void {
    this.pageNumber = pageNumber; // Update the current page number

    if (this.searchTerm) {
      this.apiService.getProductBySearch(this.searchTerm, this.pageNumber, this.pageSize).subscribe({
        next: (response: any) => {
          this.ProductDetails = response;
          this.FilteredProducts = this.ProductDetails;
          this.cdRef.detectChanges(); // Ensure change detection after updating ProductDetails
        },
        error: (err) => {
          console.error('Failed to load products based on search', err);
        }
      });
    } else if(this.categoryId!=null && this.categoryId!=0){
      this.apiService.getProductByCategory(this.categoryId, this.pageNumber, this.pageSize).subscribe({
        next: (response: any) => {
          this.ProductDetails = response;
          this.FilteredProducts = this.ProductDetails;
          this.cdRef.detectChanges(); // Ensure change detection after updating ProductDetails
        },
        error: (err) => {
          console.error('Failed to load products based on category', err);
        }
      });
    }else {
      this.apiService.getProducts(this.pageNumber, this.pageSize).subscribe({
        next: (response: any) => {
          this.ProductDetails = response;
          this.FilteredProducts = this.ProductDetails;
          this.cdRef.detectChanges(); // Ensure change detection after updating ProductDetails
        },
        error: (err) => {
          console.error('Failed to load products', err);
        }
      });
    }
  }

  getPreviousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getPage(this.pageNumber); // Fetch the previous page
    }
  }
  
  getNextPage(): void {
    if (this.pageNumber < this.paginationList.length) {
      this.pageNumber++;
      this.getPage(this.pageNumber); // Fetch the next page
    }
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
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-productpage',
  templateUrl: './productpage.component.html',
  styleUrls: ['./productpage.component.css'],
})
export class ProductpageComponent implements OnInit {
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
    if(this.checkCookieExists()){
      this.loadProducts();
      this.getCategories();
    }
  }

  GoToCart() {
    this.router.navigate(['Cart']);
  }

  checkCookieExists(): boolean {
    const cookies = document.cookie.split('; '); // Split cookies into an array
    const exists = cookies.some(cookie => cookie.startsWith(`token=`)); // Check if any cookie starts with the specified name
    return exists; // Return the boolean value
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

  filterByCategory(categoryId: any): void {
    this.searchTerm=''
    console.log("called categoryId",categoryId)
    if (categoryId === null) {
      this.loadProducts()
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

  logout(): void {
    this.expireCookie('token');
  }

  expireCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    this.router.navigate(['login'])
      .then(() => {
        window.location.reload();
      });
  }

  navigateToProductDetails(productId: string): void {
    this.router.navigate(['PurchaseProduct', productId]);
  }

  isInCart(productId: string): boolean {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.some((item: any) => item.ProductId === productId);
  }

  toggleCart(
    categoryId: string,
    description: string,
    imageUrl: string,
    price: number,
    productId: string,
    productName: string,
    stockQuantity: number
  ): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex(
      (item: any) => item.ProductId === productId
    );

    if (productIndex > -1) {
      cart.splice(productIndex, 1);
      this.showPopup('Product removed from cart!');
    } else {
      cart.push({
        ProductId: productId,
        categoryId: categoryId,
        description: description,
        imageUrl: imageUrl,
        price: price,
        productName: productName,
        Quantity: 1,
        stockQuantity: stockQuantity,
      });
      this.showPopup('Product added to cart!');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 1000);
  }
  

  AddProduct(){
    this.router.navigate(['AddProduct']);
  }

  ModifyProduct() {  
    this.router.navigate(['/ModifyProduct'])
  }

  ManageUsers(){
    this.router.navigate(['ManageUsers'])
  }

  Statistics(){
    this.router.navigate(['Statistics']);
  }
  
}

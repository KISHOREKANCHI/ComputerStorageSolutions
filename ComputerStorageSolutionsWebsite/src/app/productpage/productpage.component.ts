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

  GoToCart() {
    this.router.navigate(['Cart']);
  }

  loadProducts(): void {
    const token = document.cookie.split(';')[0];
    const Jwttoken = jwtDecode<any>(atob(token.replace('token=', '')));
    this.Username = Jwttoken.UserName;
    this.Role=Jwttoken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    this.apiService.getProductCount().subscribe({
      next: (res) => {
        this.productsCount = res;
        this.paginationList = new Array(Math.ceil(res / this.pageSize));
      },
    });

    this.apiService.getProducts(this.pageNumber, this.pageSize).subscribe({
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

  getPreviousPage() {
    if (this.pageNumber - 1 < 1) {
      return;
    }
    this.pageNumber -= 1;
    this.apiService.getProducts(this.pageNumber, this.pageSize).subscribe({
      next: (response: any) => {
        this.ProductDetails = response;
        this.FilteredProducts = this.ProductDetails;
      },
    });
  }

  getNextPage() {
    if (this.pageNumber + 1 > this.paginationList.length) {
      return;
    }
    this.pageNumber += 1;
    this.apiService.getProducts(this.pageNumber, this.pageSize).subscribe({
      next: (response: any) => {
        this.ProductDetails = response;
        this.FilteredProducts = this.ProductDetails;
      },
    });
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

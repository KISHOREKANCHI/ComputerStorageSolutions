import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-productpage',
  templateUrl: './productpage.component.html',
  styleUrls: ['./productpage.component.css']
})
export class ProductpageComponent implements OnInit {

  Username: string = "";
  ProductDetails: any[] = [];
  FilteredProducts: any[] = [];
  productId: string | null = null;
  categoryId: number | null = null;
  popupVisible: boolean = false;
  popupText: string = '';

  constructor(private apiService: ApiServiceService, private manager: CookieManagerService, private router: Router) {}

  ngOnInit(): void {
    const expiry = 1;
    this.manager.checkToken(expiry);
    this.loadProducts();
  }

  loadProducts(): void {
    const token = (document.cookie.split(';')[0]);
    const Jwttoken = jwtDecode<any>(atob(token.replace("token=", "")));
    this.Username = Jwttoken.UserName;

    this.apiService.getProducts().subscribe({
      next: (response: any) => {
        this.ProductDetails = response;
        console.log(this.ProductDetails)
        this.FilteredProducts = this.ProductDetails;
      }
    });
  }

  filterByCategory(categoryId: number | null): void {
    if (categoryId === null) {
      this.FilteredProducts = this.ProductDetails;
    } else {
      this.FilteredProducts = this.ProductDetails.filter(product => product.categoryId === categoryId);
    }
  }

  logout(): void {
    this.router.navigate(['login']);
    function expireCookie(name: string) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
    expireCookie('token');
  }

  navigateToProductDetails(productId: string): void {
    this.router.navigate(['PurchaseProduct', productId]);
  }

  isInCart(productId: string): boolean {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.some((item: any) => item.ProductId === productId);
  }

  toggleCart(categoryId:string,description:string,imageUrl:string,price:number,productId:string,productName:string): void {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productIndex = cart.findIndex((item: any) => item.ProductId === productId);

    if (productIndex > -1) {
      cart.splice(productIndex, 1);
      this.showPopup('Product removed from cart!');
    } else {
      cart.push({ ProductId: productId, 
                  categoryId:categoryId,
                  description:description,
                  imageUrl:imageUrl,
                  price:price,
                  productName:productName,
                  Quantity: 1 });
      this.showPopup('Product added to cart!');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }
}

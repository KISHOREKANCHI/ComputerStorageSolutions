import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-productpage',
  templateUrl: './productpage.component.html',
  styleUrls: ['./productpage.component.css']
})
export class ProductpageComponent implements OnInit {

  constructor(private ApiService:ApiServiceService, private manager:CookieManagerService, private router : Router){}

  ProductDetails: any[] = [];
  FilteredProducts: any[] = [];
  productId: string | null = null;
  categoryId: number | null = null;

  ngOnInit(): void {
    const expiry = 1;
    this.manager.checkToken(expiry);
    this.loadProducts();
  }

  loadProducts(): void {
    this.ApiService.GetProducts().subscribe({
      next: (response: any) => {
        this.ProductDetails = response;
        this.FilteredProducts = this.ProductDetails;
        console.log(this.ProductDetails);
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

  logout(){
    this.router.navigate(['login'])
    function expireCookie(name:string) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
    expireCookie('token');
  }
}

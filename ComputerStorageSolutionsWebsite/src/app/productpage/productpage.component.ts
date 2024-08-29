import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';

@Component({
  selector: 'app-productpage',
  templateUrl: './productpage.component.html',
  styleUrls: ['./productpage.component.css']
})
export class ProductpageComponent implements OnInit {

  constructor(private ApiService:ApiServiceService, private manager:CookieManagerService){}

  ProductDetails:any|null =null;

  productId: string | null = null;
  categoryId: string | null = null;
  ngOnInit(): void {
    const expiry = 1;
    this.manager.checkToken(expiry);
    const productElement = document.getElementById('productId');
    const categoryElement = document.getElementById('categoryId');

    if (productElement) {
      this.productId = productElement.getAttribute('data-product-id');
    }
    if (categoryElement) {
      this.categoryId = categoryElement.getAttribute('data-category-id');
    }
    this.ApiService.GetProducts().subscribe({
      next:(response:any)=>{
        this.ProductDetails = response;
        console.log(this.ProductDetails);
      }
    });
  }
  
}

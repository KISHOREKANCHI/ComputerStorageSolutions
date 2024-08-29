import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productpage',
  templateUrl: './productpage.component.html',
  styleUrls: ['./productpage.component.css']
})
export class ProductpageComponent implements OnInit {
  productId: string | null = null;
  categoryId: string | null = null;
  ngOnInit(): void {
    const productElement = document.getElementById('productId');
    const categoryElement = document.getElementById('categoryId');

    if (productElement) {
      this.productId = productElement.getAttribute('data-product-id');
    }
    if (categoryElement) {
      this.categoryId = categoryElement.getAttribute('data-category-id');
    }
  }
}

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

  modifyField(field: string, productId: number) {
      // Logic for modifying fields like name, description, price
  }

  toggleCart(categoryId: number, description: string, imageUrl: string, price: number, productId: number, productName: string, stockQuantity: number) {
      // Logic for toggling cart state
  }

  isInCart(productId: number): boolean {
      // Logic to check if the product is in the cart
      return false; // Replace with actual logic
  }

  navigateToProductDetails(productId: number) {
      // Logic to navigate to product details
  }

  addProduct() {
      // Logic for adding a product
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

  saveEdit() {

  }

  uploadImage(abc:any){

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
}

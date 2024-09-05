import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieManagerService } from './cookie-manager.service';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private productApi = 'http://localhost:5037/api/Products';
  private orderApi = 'http://localhost:5037/api/OrderDetails';
  private ModifyUserApi = 'http://localhost:5037/api/ManageUsers';
  private statisticsApi = 'http://localhost:5037/api/Statistics';

  headers: HttpHeaders;

  constructor(private http: HttpClient, private manager: CookieManagerService) {
    const token = document.cookie.split(';')[0];
    const Jwttoken = atob(token.replace('token=', ''));
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${Jwttoken}`,
    });
    this.headers = headers;
  }

  ngOnInit() {
    const expiry = 1;
    this.manager.checkToken(expiry);
  }

  getProducts(pageNumber?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();

    if (pageNumber) {
      params = params.set('pageNumber', pageNumber);
    }
    if (pageSize) {
      params = params.set('pageSize', pageSize);
    }

    return this.http.get<any>(this.productApi, {
      headers: this.headers,
      params: params,
    });
  }

  getAllProducts(): Observable<any> {
    return this.http.get<any>(`${this.productApi}/GetAllProducts`, {
      headers: this.headers,
    });
  }

  getProductCount(): Observable<number> {
    return this.http.get<number>(`${this.productApi}/count`, {
      headers: this.headers,
    });
  }

  getUserOrders(): Observable<any> {
    return this.http.get<any>(`${this.orderApi}/UserOrders`, {
      headers: this.headers,
    });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.productApi}/Id?Id=${id}`, {
      headers: this.headers,
    });
  }

  placeOrder(productOrders: any[], shippingAddress: string): Observable<any> {
    const body = {
      productOrders: productOrders,
      shippingAddress: shippingAddress,
    };
    return this.http.post(`${this.orderApi}/OrderProduct`, body, {
      headers: this.headers,
    });
  }

  AddProduct(formData: FormData): Observable<any>{
    return this.http.post(`${this.productApi}/AddProduct`, formData,{
      headers:this.headers,
    });
  }

  ModifyProduct(formData: FormData): Observable<any>{
    return this.http.patch(`${this.productApi}/ModifyProduct`, formData,{
      headers:this.headers,
    });
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.ModifyUserApi}/users`, {
      headers: this.headers,
    });
  }

  promoteToAdmin(userId: string): Observable<any> {
    console.log("Promoting user with ID:", userId);
    const body = JSON.stringify({ UserId: userId });
    return this.http.post<any>(`${this.ModifyUserApi}/promote`, body, {
      headers: this.headers.set('Content-Type', 'application/json'),
    });
  }

  demoteToUser(userId: string): Observable<any> {
    const body = JSON.stringify({ UserId: userId });
    return this.http.post<any>(`${this.ModifyUserApi}/demote`, body, {
      headers: this.headers.set('Content-Type', 'application/json'),
    });
  }

  deleteUser(userId: string): Observable<any> {
    const body = { UserId: userId }; // Create an object to send in the body
    return this.http.delete(this.ModifyUserApi, {
      headers: this.headers.set('Content-Type', 'application/json'),
      body: body // Pass the body with the request
    });
  }

 // Statistics Methods
 getLeastPopularProductDetails(month: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.statisticsApi}/least-popular-product-details/${month}`, {
    headers: this.headers,
  });
}

getCustomerProductsOrderedInQuarter(quarter: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.statisticsApi}/customer-products-ordered-in-quarter/${quarter}`, {
    headers: this.headers,
  });
}

getOrderDetailsHighestSellingProduct(): Observable<any[]> {
  return this.http.get<any[]>(`${this.statisticsApi}/order-details-highest-selling-product`, {
    headers: this.headers,
  });
}

// Add more methods as needed
  toggleUserStatus(userId: string, isActive: boolean): Observable<any> {
    const body={
      userId:userId,
      isActive:isActive
    }
    console.log("sent touserstatus",{userId,isActive});
    return this.http.post(`${this.ModifyUserApi}/toggleStatus`, body, { headers: this.headers.set('Content-Type', 'application/json'),});
  }
  
}

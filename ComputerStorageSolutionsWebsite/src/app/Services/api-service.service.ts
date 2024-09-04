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

  ngOnInt() {
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
}

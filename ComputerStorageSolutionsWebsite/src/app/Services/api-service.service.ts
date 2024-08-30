import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private productApi = "http://localhost:5037/api/Products";
  private orderApi = "http://localhost:5037/api/OrderDetails";

  headers:HttpHeaders;

  constructor(private http: HttpClient) {
    const token = (document.cookie.split(';')[0]);
    const Jwttoken = atob(token.replace("token=", ""));
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${Jwttoken}`
    });
    this.headers=headers
  }

  getProducts(): Observable<any> {
    return this.http.get<any>(this.productApi, { headers:this.headers });
  }

  getUserOrders(): Observable<any> {
    return this.http.get<any>(`${this.orderApi}/UserOrders`, { headers:this.headers });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.productApi}/Id?Id=${id}`,{headers:this.headers});
  }

  placeOrder(productOrders: any[], shippingAddress: string): Observable<any> {
    const body = {
      productOrders: productOrders,
      shippingAddress: shippingAddress
    };
    console.log("bodyyyyyyyyyyyyyyy",body);
    return this.http.post(`${this.orderApi}/OrderProduct`,body, { headers:this.headers });
  }
}

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
  private StatisticsApi = 'http://localhost:5037/api/Statistics';

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

  toggleUserStatus(userId: string, isActive: boolean): Observable<any> {
    const body={
      userId:userId,
      isActive:isActive
    }
    console.log("sent touserstatus",{userId,isActive});
    return this.http.post(`${this.ModifyUserApi}/toggleStatus`, body, { headers: this.headers.set('Content-Type', 'application/json'),});
  }

  getTotalSalesMonthWise(): Observable<{ month: string, totalSales: number }[]> {
    return this.http.get(`${this.StatisticsApi}/TotalSalesMonthWise`);
  }

  getTotalOrdersByCustomerMonthWise(): Observable<{ month: string, totalOrders: number }[]> {
    return this.http.get<{ month: string, totalOrders: number }[]>(`${this.StatisticsApi}/TotalOrdersByCustomerMonthWise`);
  }

  getOrdersByCustomerInSpecificMonth(customerId: string, month: string): Observable<{ date: string, orderCount: number }[]> {
    return this.http.get<{ date: string, orderCount: number }[]>(`${this.StatisticsApi}/OrdersByCustomerInMonth/${customerId}/${month}`);
  }

  getInactiveCustomers(): Observable<{ customerId: string, customerName: string }[]> {
    return this.http.get<{ customerId: string, customerName: string }[]>(`${this.StatisticsApi}/CustomersWithNoOrdersInLast3Months`);
  }

  getUnitsSoldInPriceRange(minPrice: number, maxPrice: number): Observable<{ productName: string, unitsSold: number }[]> {
    return this.http.get<{ productName: string, unitsSold: number }[]>(`${this.StatisticsApi}/UnitsSoldInPriceRange/${minPrice}/${maxPrice}`);
  }

  getPopularProductDetailsForMonth(month: string): Observable<{ productName: string, sales: number }[]> {
    return this.http.get<{ productName: string, sales: number }[]>(`${this.StatisticsApi}/MostPopularProduct/${month}`);
  }

  getLeastPopularProductDetailsForMonth(month: string): Observable<{ productName: string, sales: number }[]> {
    return this.http.get<{ productName: string, sales: number }[]>(`${this.StatisticsApi}/LeastPopularProduct/${month}`);
  }

  getCustomerProductsOrderedInQuarter(quarter: string): Observable<{ customerName: string, products: string }[]> {
    return this.http.get<{ customerName: string, products: string }[]>(`${this.StatisticsApi}/CustomerProductsInQuater/${quarter}`);
  }

  getOrderIdAndCustomerDetailsForHighestSellingProduct(): Observable<{ orderId: string, customerName: string }[]> {
    return this.http.get<{ orderId: string, customerName: string }[]>(`${this.StatisticsApi}/OrderAndCustomerForHighestSellingProduct`);
  }
}


import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieManagerService } from './cookie-manager.service';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private productApi = environment.apiUrls.productApi;
  private orderApi = environment.apiUrls.orderApi;    
  private ModifyUserApi = environment.apiUrls.modifyUserApi; 
  private StatisticsApi = environment.apiUrls.statisticsApi;

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

  getCategories():Observable<any>{
    return this.http.get<any>(`${this.productApi}/Categories`, {
      headers: this.headers,})
  }

  getProductByCategory(categoryId:number,pageNumber?: number, pageSize?: number):Observable<any>{
    let params = new HttpParams();
    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    if (pageNumber) {
      params = params.set('pageNumber', pageNumber);
    }
    if (pageSize) {
      params = params.set('pageSize', pageSize);
    }
    return this.http.get<any>(`${this.productApi}/GetProductsByCategoryId`,{
      headers:this.headers,
      params: params,
    });
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

  getAllProducts(pageNumber?: number, pageSize?: number): Observable<any> {
    let params = new HttpParams();

    if (pageNumber) {
      params = params.set('pageNumber', pageNumber);
    }
    if (pageSize) {
      params = params.set('pageSize', pageSize);
    }
    return this.http.get<any>(`${this.productApi}/GetAllProducts`, {
      headers: this.headers,
      params: params,
    });
  }

  getProductCountbyCategory(categoryId:number):Observable<number>{
    let params = new HttpParams();
    if(categoryId){
      params=params.set('categoryId',categoryId)
    }
    return this.http.get<number>(`${this.productApi}/getProductCountbyCategory`,{
      headers:this.headers,
      params:params
    })
  }

  getProductCount(): Observable<number> {
    return this.http.get<number>(`${this.productApi}/count`, {
      headers: this.headers,
    });
  }

  getProductCountBySearch(searchTerm: string): Observable<number> {
    return this.http.get<number>(`${this.productApi}/count/search`, {
      headers: this.headers,
      params: { search: searchTerm },
    });
  }

  getProductBySearch(search?: string,pageNumber?: number, pageSize?: number):Observable<any>{
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    if (pageNumber) {
      params = params.set('pageNumber', pageNumber);
    }
    if (pageSize) {
      params = params.set('pageSize', pageSize);
    }
    return this.http.get<any>(`${this.productApi}/search`, {
      headers: this.headers,
      params: params,
    });
  }

  getUserOrders(): Observable<any> {
    return this.http.get<any>(`${this.orderApi}/UserOrders`, {
      headers: this.headers,
    });
  }

  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.productApi}/${id}`, {
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
    return this.http.post(`${this.ModifyUserApi}/toggleStatus`, body, { headers: this.headers.set('Content-Type', 'application/json'),});
  }

  getTotalSalesMonthWise(): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/TotalSalesMonthWise`, { headers: this.headers });
  }

  getTotalOrdersByCustomerMonthWise(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/TotalOrdersByCustomerMonthWise?customerId=${customerId}`, { headers: this.headers });
  }

  getOrdersByCustomerInSpecificMonth(customerId: string, year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/OrdersByCustomerInMonth?customerId=${customerId}&year=${year}&month=${month}`, { headers: this.headers });
  }

  getInactiveCustomers(): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/CustomersWithNoOrdersInLast3Months`, { headers: this.headers });
  }

  getUnitsSoldInPriceRange(minPrice: number, maxPrice: number): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/UnitsSoldInPriceRange?minPrice=${minPrice}&maxPrice=${maxPrice}`, { headers: this.headers });
  }

  getPopularProductDetailsForMonth(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/MostPopularProduct?year=${year}&month=${month}`, { headers: this.headers });
  }


  getLeastPopularProductDetailsForMonth(year: number, month: number): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/LeastPopularProduct?year=${year}&month=${month}`, { headers: this.headers });
  }

  getCustomerProductsOrderedInQuarter(customerId: string, year: number, quarter: number): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/CustomerProductsInQuarter?customerId=${customerId}&year=${year}&quarter=${quarter}`, { headers: this.headers });
  }

  getOrderIdAndCustomerDetailsForHighestSellingProduct(): Observable<any> {
    return this.http.get<any>(`${this.StatisticsApi}/OrderAndCustomerForHighestSellingProduct`, { headers: this.headers });
  }
}


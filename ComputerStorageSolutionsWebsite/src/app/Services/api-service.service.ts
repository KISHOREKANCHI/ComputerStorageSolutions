import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http:HttpClient) { }

  private productApi="http://localhost:5037/api/Products";

  GetProducts() {
    const token = (document.cookie.split(';')[0]);
    const Jwttoken = token.replace("token=", "");
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${Jwttoken}`
    });

    return this.http.get<any>(this.productApi, { headers });
  }
}

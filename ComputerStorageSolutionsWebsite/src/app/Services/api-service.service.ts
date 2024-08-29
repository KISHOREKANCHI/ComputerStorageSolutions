import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http:HttpClient) { }

  private productApi="http://localhost:5037/api/Products";

  GetProducts():Observable<any> {
    const token = (document.cookie.split(';')[0]);
    const Jwttoken = atob(token.replace("token=", ""));
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${Jwttoken}`
    });

    return this.http.get<any>(this.productApi, { headers });
  }
}

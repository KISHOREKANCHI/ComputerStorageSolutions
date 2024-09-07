import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable , catchError, of, throwError} from 'rxjs';
import { CookieManagerService } from './cookie-manager.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  constructor(private http: HttpClient,private manager:CookieManagerService) { }

  ngOninit(){
    const expiry = 1;
    this.manager.checkToken(expiry);
  }
  serverUrl=environment.serverUrl;
  private Endpoint = `${this.serverUrl}/api/`

  GetUserDetails(credentials: any) : Observable<any>{
   // const headers = new HttpHeaders({'Content-Type':'application/json'}
    return this.http.post<any>(this.Endpoint+"Login",credentials);
  }

  RegisterDetails(credentials: any) : Observable<any>{
    // const headers = new HttpHeaders({'Content-Type':'application/json'}
     return this.http.post<any>(this.Endpoint+"SignUp",credentials);
   }
}

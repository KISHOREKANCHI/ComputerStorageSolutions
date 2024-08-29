import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CookieManagerService {

  constructor(private router:Router) { }

  checkToken(expirationDate:number){
    setTimeout(()=>{
      this.logout();
    },expirationDate);
  }

  logout(){
    const token = (document.cookie.split(';')[0]);
    const Jwttoken = token.replace("token=", "");
    if (!Jwttoken){
      this.router.navigate(['login'])
      localStorage.removeItem('token');
    }
    else{
      this.addTime();
    }
  }

  addTime(){
    const expiry = 3000;
    return this.checkToken(expiry);
  }
}

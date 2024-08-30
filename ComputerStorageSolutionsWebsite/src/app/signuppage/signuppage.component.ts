import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.css']
})
export class SignuppageComponent {

constructor(private router:Router){}

  LoginRedirect(){
    this.router.navigate(['login'])
  }

  CreateAccount(){}
}

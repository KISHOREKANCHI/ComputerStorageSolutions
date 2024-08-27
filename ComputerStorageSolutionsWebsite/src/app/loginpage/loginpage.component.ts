import { Component } from '@angular/core';
import { UserDetailsService } from '../Services/user-details.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {
  email: string = "";
  passwordHash: string = "";
  UserDetails: any | null = null;

  constructor(private userDetailsService: UserDetailsService) {}

  Login() {
    const loginData = {
      email: this.email,
      passwordHash: this.passwordHash
    };
    this.userDetailsService.GetUserDetails(loginData).subscribe({
      next: response => {
        console.log("Login Successful", response);
      },
      error: error => {
        console.log("Login failed", error);
      }
    });
  }
}

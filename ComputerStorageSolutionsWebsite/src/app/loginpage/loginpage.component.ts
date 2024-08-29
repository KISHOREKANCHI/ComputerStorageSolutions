import { Component } from '@angular/core';
import { UserDetailsService } from '../Services/user-details.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {
  email: string = "";
  Password: string = "";
  UserDetails: any | null = null;

  constructor(private userDetailsService: UserDetailsService) {}

  Login() {
    const loginData = {
      email: this.email,
      Password: this.Password
    };
    this.userDetailsService.GetUserDetails(loginData).subscribe({
      next: response => {
        console.log("Login Successful", response);
        this.UserDetails = response;
      },
      error: error => {
        console.log("Login failed", error);
      }
    });
  }
}

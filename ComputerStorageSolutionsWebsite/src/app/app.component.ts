import { Component } from '@angular/core';
import { CookieManagerService } from 'src/app/Services/cookie-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private manager : CookieManagerService){}

  ngOnInit(){
    const expiry = 1;
    this.manager.checkToken(expiry);
  }


}

import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './auth/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private roles: string[];
  private authority: string;
  private userName: string;

  constructor(private tokenStorage: TokenStorageService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.userName = this.tokenStorage.getUsername();
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'MANAGER'){
          this.authority = 'manager';
          return false;
        } else if (role === 'CUSTOMER'){
          this.authority = 'customer';
          return false;
        }else if (role === 'CHEF'){
          this.authority = 'chef';
          return false;
        }else if (role === 'STEWARD'){
          this.authority = 'steward';
          return false;
        }else if (role === 'CASHIER'){
          this.authority = 'cashier';
          return false;
        }
        this.authority = 'user';
        return true;
      });
    }
  }

  logout() {
    this.tokenStorage.signOut();
    this.authority = null;
  }
}

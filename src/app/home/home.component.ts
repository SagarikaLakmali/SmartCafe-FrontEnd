import { Component, OnInit } from '@angular/core';

import { TokenStorageService } from '../auth/token-storage.service';
import { User } from '../model/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  info: any;
  roles: string[] = [];
  isLoggedIn = false;

  user: User= {
    guid: null,
    firstName: null,
    lastName: null,
    email: null,
    id: null,
    image: null,
    active: null,
    role: null,
    address: null,
    department: null,
    createdBy: null,
    updatedBy: null,
  }

  constructor(private token: TokenStorageService, private userService: UserService) { }

  ngOnInit() {
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };

    if (this.token.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.token.getAuthorities();
      this.getUser(this.token.getUsername());
    }
  }

  logout() {
    this.user = null;
    this.token.signOut();
    window.location.reload();
  }

  getUser(email: string){
    this.userService.getUser(email)
      .subscribe(user => {
        this.user = user;
      });
  }
}

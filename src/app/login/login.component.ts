import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { AuthLoginInfo } from '../auth/login-info';
import { UserService } from '../services/user.service';
import { User } from '../model/User';
import { CommonResponse } from '../model/CommonResponse';
import { Login } from '../model/Login';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;
  currentPassword: string;
  newPassword: string;
  confPassword: string;
  errorMsg: string;
  successMessage: string;
  error: boolean;
  success: boolean;
  response: CommonResponse= {
    code: null,
    message: null
  }

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

  login: Login={
    username: null,
    password: null,
    newPassword: null
  }

  isChangePasswordClicked: boolean = false;
  showWelcome = true;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private userService: UserService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
      this.getUser(this.tokenStorage.getUsername());
    }
  }

  onSubmit() {

    this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password);

    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.jwttoken);
        this.tokenStorage.saveUsername(data.userName);
        data.roles.forEach(role => {
          this.roles.push(role.name);
        });
        this.tokenStorage.saveAuthorities(this.roles);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        this.reloadPage();
      },
      error => {
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }

  getUser(email: string){
    this.userService.getUser(email)
      .subscribe(user => {
        this.user = user;

        if(this.user && this.user.role && this.user.role.name === environment.tableRole){
          this.showWelcome = false;
        }
      });
  }

  changePassword(){
    this.isChangePasswordClicked = true;
  }

  clear(){
    this.isChangePasswordClicked = false;
    this.currentPassword = null;
    this.newPassword = null;
    this.confPassword = null;
    this.errorMsg = null;
    this.successMessage = null;
    this.error = false;
    this.success = false;
  }

  updatePassword(){
    this.error = false;
    this.success = false;
    this.errorMsg = "";
    this.successMessage = "";

    if(this.currentPassword != null && this.currentPassword.length > 0){
      if(this.newPassword != null && this.newPassword.length > 0){
        if(this.confPassword != null && this. confPassword.length > 0){
            if(this.confPassword === this.newPassword){
              this.login.username = this.tokenStorage.getUsername();
              this.login.password = this.currentPassword;
              this.login.newPassword = this.confPassword;
              this.userService.updatePassword(this.login)
              .subscribe(r => {
                this.response = r;
                if(this.response.code === "200"){
                  this.success = true;
                  this.successMessage = this.response.message;
                  this.currentPassword = null;
                  this.newPassword = null;
                  this.confPassword = null;
                }else{
                  this.errorMsg = this.response.message;
                }
              }, error => {
                this.errorMsg = error.error.message;
                this.error = true;
              });
              
            }else{
              this.error = true;
              this.errorMsg = this.errorMsg + "Confirmation password doesnot match with new password.";
            }
        }else{
          this.error = true;
          this.errorMsg = this.errorMsg + "Confirmation password cannot be empty.";
        }
      }else{
        this.error = true;
        this.errorMsg = this.errorMsg + "New password cannot be empty.";
      }
    }else{
      this.error = true;
      this.errorMsg = this.errorMsg + "Current password cannot be empty.";
    }
  }

  close(){
    this.clear();
  }
}

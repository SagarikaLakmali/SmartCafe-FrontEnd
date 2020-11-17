import { Component, OnInit } from '@angular/core';
import { Menu } from '../model/Menu';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuService } from '../services/menu.service';
import { AllMenusResponse } from '../model/AllMenusResponse';
import { stringify } from 'querystring';
import { CommonResponse } from '../model/CommonResponse';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { TokenStorageService } from '../auth/token-storage.service';

@Component({
  selector: 'app-user',
  templateUrl: './customermenu.component.html',
  styleUrls: ['./customermenu.component.css']
})
export class CustomerMenuComponent implements OnInit {

  constructor(private menuService:MenuService, private confirmationService: ConfirmationService, private tokenStorage: TokenStorageService) { }  
  
  loaded: boolean;
  errorMessage: string;
  successMessage: string;
  error: boolean;
  success: boolean;
  update: boolean;
  selectedFile: ImageSnippet;
  isSelected: boolean;

  menu: Menu= {
    guid: null,
    name: null,
    description: null,
    id: null,
    image: null,
    price: null,
    createdBy: null,
    updatedBy: null,
    available: null
  }

  response: CommonResponse= {
    code: null,
    message: null
  }

  allMenusResponse : AllMenusResponse;

  filterMenuName: string;
  
  page: number;
  paginator: boolean = true;
  loading: boolean;
  message: any;

  cartItems: MenuItem[] = [];

  cartSize: number;
  showCart: boolean = false;
  ordertotal: number = 0;

  orderStatus: boolean = false;

  ngOnInit() {
    this.isSelected = false;
    this.loaded = false;
    this.getAllMenus(true);
    this.loaded = true;
  }  
  
  save(){  
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;
    
    this.validate();
    if (!this.error) {
      this.loaded = false;
      if(!this.update){
        this.menu.createdBy = this.tokenStorage.getUsername();
      }
      if(this.isSelected){
        this.menu.image = this.selectedFile.src;
      }
      this.menuService.createMenu(this.menu)
        .subscribe(r => {
          this.response = r;
          this.loaded = true;

          if(this.menu.id != null && this.menu.id.length > 0){
            this.successMessage = "Menu updated successfully.";
          }else{
            this.successMessage = "Menu created successfully.";
          }
          
          this.success = true;
          this.menu.name = "";
          this.menu.description = "";
          this.menu.image = "";
          this.menu.price = null;
          this.menu.available = false;
          this.selectedFile = null;
          this.ngOnInit();
        }, error => {
          this.errorMessage = error.error.message;          
          this.loaded = true;
          this.error = true;
        });
    }else if(this.errorMessage != null && this.errorMessage.trim().length > 0){
      this.errorMessage = this.errorMessage;
      return
    }
  }

  validate(){

    if (this.menu.name == null || this.menu.name.length <= 0){
      this.errorMessage = this.errorMessage + "Name ";
    }

    if (this.menu.price == null || this.menu.price <= 0){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Price ";
    }

    if (!this.update && this.selectedFile == null){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Image ";
    }

    if (this.update && (this.menu.image == null || this.menu.image.length == 0)){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Image ";
    }
    

    if (this.menu.description == null || this.menu.description.length <= 0){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Description ";
    }

    if(this.errorMessage != null && this.errorMessage.length > 0){
      this.errorMessage = this.errorMessage + "cannot be blank.";
    }

    if(this.errorMessage != null && this.errorMessage.trim().length > 0){
      this.error = true;
    }else{
      this.error = false;
    }
  }

  clear(){
    this.menu.id = "";
    this.menu.guid = null;
    this.menu.name = "";
    this.menu.description = "";
    this.menu.image = "";
    this.menu.price = null;
    this.menu.available = false;
    this.selectedFile = null;
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;
    this.update = false;
    this.ngOnInit();
  }

  close(){
    this.error = false;
    this.success = false;
  }

  fetchMenusLazy(event) {
    this.loading = true;
    this.page = event.first / 15;

    this.getAllMenus(false);
  }

  getAllMenus(reset: boolean) {
    if (reset) {
      this.page = 0;
    }

    this.menuService.findAllMenus(this.page)
      .subscribe((allMenusResponse: AllMenusResponse) => {
        this.allMenusResponse = allMenusResponse
        if (this.allMenusResponse.content.length == 0) {
          this.paginator = false;
        } else {
          this.paginator = true;
        }
        this.loading = false;
      }
      ); 
  }

  editMenu(menu: Menu){
    this.menu.name = menu.name;
    this.menu.description = menu.description;
    this.menu.guid = menu.guid;
    this.menu.id = menu.id;
    this.menu.price = menu.price;
    this.menu.available = menu.available;
    this.menu.image = menu.image;
    this.update = true;
  }

  updateMenu(){
    this.menu.updatedBy = this.tokenStorage.getUsername();
    this.save();
    this.update = false;
  }

  delete(menu: Menu){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete '+ menu.name + '?',
      accept: () => {
        this.deleteMenu(menu.id);
      }
    });
  }

  deleteMenu(id: string) {
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;

    this.menuService.deleteMenu(id).subscribe(r => {
      this.response = r;

      if(this.response.code != null && this.response.code == "200"){
        this.success = true;
        this.successMessage = this.response.message;
      }else{
        this.error = true;
        this.errorMessage = this.response.message;
      }
      this.ngOnInit();
    });
  } 

  processFile(imageInput: any) {
    this.isSelected = true;
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
      this.menu.image = this.selectedFile.src;
    });
    reader.readAsDataURL(file);
  }

  addToCart(menu: Menu){
    this.cartItems.push(menu);
    this.cartSize = this.cartItems.length;
    this.ordertotal = this.ordertotal + menu.price;
  }

  viewCart(){
    this.showCart = true;
  }

  backToMenu(){
    this.showCart = false;
  }

  removeCart(menu){
    this.cartItems.pop();
    this.cartSize = this.cartItems.length;
    this.ordertotal = this.ordertotal - menu.price;
    if(this.ordertotal <= 0){
      this.showCart = false;
    }
  }

  clearCart(){
    this.cartItems = [];
    this.cartSize = 0;
    this.ordertotal = 0;
    this.showCart = false;
  }

  order(){
    this.orderStatus = true;
    this.clearCart();
  }

  viewOrderStatus(){

  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}


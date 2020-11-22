import { Component, OnInit } from '@angular/core';
import { Menu } from '../model/Menu';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuService } from '../services/menu.service';
import { AllMenusResponse } from '../model/AllMenusResponse';
import { AllOrdersResponse } from '../model/AllOrdersResponse';
import { stringify } from 'querystring';
import { CommonResponse } from '../model/CommonResponse';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { TokenStorageService } from '../auth/token-storage.service';
import { OrderService } from '../services/order.service';
import { Order } from '../model/Order';

@Component({
  selector: 'app-user',
  templateUrl: './customermenu.component.html',
  styleUrls: ['./customermenu.component.css']
})
export class CustomerMenuComponent implements OnInit {

  constructor(private menuService:MenuService, private confirmationService: ConfirmationService, private tokenStorage: TokenStorageService, private orderService: OrderService) { }  
  
  loaded: boolean;
  errorMessage: string;
  successMessage: string;
  error: boolean;
  success: boolean;
  selectedFile: ImageSnippet;
  isSelected: boolean;
  rate: boolean = true;

  menu: Menu= {
    guid: null,
    name: null,
    description: null,
    id: null,
    image: null,
    price: null,
    createdBy: null,
    updatedBy: null,
    available: null,
    readyToDeliver: null
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

  cartItems: Menu[] = [];

  cartSize: number;
  showCart: boolean = false;
  ordertotal: number = 0;

  orderStatus: boolean = false;
  orderStatusView = false;

  allOrdersResponse : AllOrdersResponse;

  orders: Array<Order>;

  ngOnInit() {
    this.isSelected = false;
    this.loaded = false;
    this.getAllMenus(true);    
    this.getAllOrders();
    this.loaded = true;
    this.rate = true;
  }

  close(){
    this.error = false;
    this.success = false;
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

  fetchMenusLazy(event) {
    this.loading = true;
    this.page = event.first / 12;

    this.getAllMenus(false);
  }

  addToCart(menu: Menu){
    this.cartItems.push(menu);
    this.cartSize = this.cartItems.length;
    this.ordertotal = this.ordertotal + menu.price;
  }

  viewCart(){
    this.showCart = true;
    this.orderStatusView = false;
  }

  backToMenu(){
    this.showCart = false;
    this.orderStatusView = false;
    this.getAllOrders();
    if(this.orders != null && this.orders.length > 0){
      this.orderStatus = true;
    }else{
      this.orderStatus = false;
    }
    this.success = false;
    this.error = false;
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

    this.success = false;
    this.error = false;

    this.orderService.createOrder(this.cartItems, this.tokenStorage.getUsername())
        .subscribe(r => {
          this.response = r;

          if(this.response.code != null && this.response.code == "200"){
            this.successMessage = "Order placed successfully.";
            this.success = true;
          }else{
            this.error = true;
            this.errorMessage = this.response.message;
          }
          this.orderStatus = true;
          this.clearCart();
          this.ngOnInit();
        }, error => {
          this.errorMessage = error.error.message;
          this.error = true;
        });    
  }

  viewOrderStatus(){
    this.success = false;
    this.error = false;
    this.getAllOrders();
    this.orderStatusView = true;
    this.orderStatus = false;
    this.showCart = true; 
  }

  fetchOrdersLazy(event) {
    this.loading = true;
    this.page = event.first / 12;

    this.getAllMenus(false);
  }

  getAllOrders() {
    this.orderService.findAllOrders(this.tokenStorage.getUsername())
    .subscribe(orders => {
      this.orders = orders;

      if(this.orders){
        this.orderStatus = true;
      }else{
        this.orderStatus = false;
      }
  });
  }

  requestBill(order: Order){
    this.success = false;
    this.error = false;
    this.rate =false;
    order.status = "BILL_REQUESTED";
    this.orderService.updateOrder(order)
        .subscribe(r => {
          this.response = r;

          if(this.response.code != null && this.response.code == "200"){
            this.successMessage = "Bill Requested for Order: "+order.guid;
            this.success = true;
          }else{
            this.error = true;
            this.errorMessage = this.response.message;
          }
          this.getAllOrders();
          this.orderStatusView = true;
          this.orderStatus = false;
          this.showCart = true; 
        }, error => {
          this.errorMessage = error.error.message;
          this.error = true;
        }); 
  }

  public replace(content: string) {
    return content.replace(/_/g, " ");
  }

  rateOrder(order: Order, rate: number){
    order.rating = rate
    this.orderService.updateOrder(order)
        .subscribe(r => {
          this.response = r;

          if(this.response.code != null && this.response.code == "200"){
            this.successMessage = "Order Rated";
            this.success = true;
          }else{
            this.error = true;
            this.errorMessage = this.response.message;
          }
          this.getAllOrders();
          this.orderStatusView = true;
          this.orderStatus = false;
          this.showCart = true; 
          this.rate = false;
        }, error => {
          this.errorMessage = error.error.message;
          this.error = true;
        }); 
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}


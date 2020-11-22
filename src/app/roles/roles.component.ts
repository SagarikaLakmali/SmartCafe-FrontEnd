import { Component, OnInit } from '@angular/core';
import { Role } from '../model/Role';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RoleService } from '../services/role.service';
import { AllRolesResponse } from '../model/AllRolesResponse';
import { stringify } from 'querystring';
import { CommonResponse } from '../model/CommonResponse';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  constructor(private roleService:RoleService, private confirmationService: ConfirmationService) { }  
  
  loaded: boolean;
  errorMessage: string;
  successMessage: string;
  error: boolean;
  success: boolean;
  update: boolean;

  role: Role= {
    guid: null,
    name: null,
    description: null,
    id: null
  }

  response: CommonResponse= {
    code: null,
    message: null
  }

  allRolesResponse : AllRolesResponse;

  filterRoleName: string;
  
  page: number;
  paginator: boolean = true;
  loading: boolean;
  message: any;

  ngOnInit() {
    this.loaded = true;
    this.getAllRoles(true)
  }  
  
  save(){  
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;
    this.validate();
    if (!this.error) {
      this.loaded = false;
      this.roleService.createRole(this.role)
        .subscribe(r => {
          this.response = r;
          this.loaded = true;

          if(this.role.id != null && this.role.id.length > 0){
            this.successMessage = "Role updated successfully.";
          }else{
            this.successMessage = "Role created successfully.";
          }
          
          this.success = true;
          this.ngOnInit();
          this.role.name = "";
          this.role.description = "";
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
    if (this.role.name == null || this.role.name.length <= 0){
      this.errorMessage = this.errorMessage + "Name ";
    }

    if (this.role.description == null || this.role.description.length <= 0){
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
    this.role.name = "";
    this.role.description = "";
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;
    this.update = false;
  }

  close(){
    this.error = false;
    this.success = false;
  }

  fetchRolesLazy(event) {
    this.loading = true;
    this.page = event.first / 12;

    this.getAllRoles(false);
  }

  getAllRoles(reset: boolean) {
    if (reset) {
      this.page = 0;
    }

    this.roleService.findAllRoles(this.page)
      .subscribe((allRolesResponse: AllRolesResponse) => {
        this.allRolesResponse = allRolesResponse
        if (this.allRolesResponse.content.length == 0) {
          this.paginator = false;
        } else {
          this.paginator = true;
        }
        this.loading = false;
      }
      ); 
  }

  editRole(role: Role){
    this.role.name = role.name;
    this.role.description = role.description;
    this.role.guid = role.guid;
    this.role.id = role.id;
    this.update = true;
  }

  updateRole(){
    this.save();
    this.update = false;
  }

  delete(role: Role){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete '+ role.name + '?',
      accept: () => {
        this.deleteRole(role.id);
      }
    });
  }

  deleteRole(id: string) {
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;

    this.roleService.deleteRole(id).subscribe(r => {
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
}

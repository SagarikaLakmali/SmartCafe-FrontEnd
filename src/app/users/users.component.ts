import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AllUsersResponse } from '../model/AllUsersResponse';
import { stringify } from 'querystring';
import { CommonResponse } from '../model/CommonResponse';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { TokenStorageService } from '../auth/token-storage.service';
import { Department } from '../model/Department';
import { DepartmentService } from '../services/department.service';
import { Role } from '../model/Role';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-user',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private userService:UserService, private confirmationService: ConfirmationService, private tokenStorage: TokenStorageService, private departmentService: DepartmentService, private roleService: RoleService) { }  
  
  loaded: boolean;
  errorMessage: string;
  successMessage: string;
  error: boolean;
  success: boolean;
  update: boolean;
  selectedFile: ImageSnippet;
  isSelected: boolean;

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

  response: CommonResponse= {
    code: null,
    message: null
  }

  allUsersResponse : AllUsersResponse;
  filterUserName: string;
  
  page: number;
  paginator: boolean = true;
  loading: boolean;
  message: any;

  departmentSelectItems: Array<Department>;
  departmentSelectItem: Department;

  roleSelectItems: Array<Role>;
  roleSelectItem: Role;
  states: SelectItem[];

  ngOnInit() {

    this.states = [
      { label: 'Please Select', value: '' },
      { label: 'ACT', value: 'ACT' },
      { label: 'NSW', value: 'NSW' },
      { label: 'NT', value: 'NT' },
      { label: 'QLD', value: 'QLD' },
      { label: 'SA', value: 'SA' },
      { label: 'TAS', value: 'TAS' },
      { label: 'VIC', value: 'VIC' },
      { label: 'WA', value: 'WA' },
    ];


    this.departmentService.getAllDepartments()
      .subscribe(departmentSelectItems => {
        this.departmentSelectItems = departmentSelectItems;

        console.log(JSON.stringify(this.departmentSelectItems));
    });

    this.roleService.getAllRoles()
      .subscribe(roleSelectItems => {
        this.roleSelectItems = roleSelectItems;
    });

    this.isSelected = false;
    this.loaded = false;
    this.getAllUsers(true);
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
        this.user.createdBy = this.tokenStorage.getUsername();
      }
      if(this.isSelected){
        this.user.image = this.selectedFile.src;
      }
      this.userService.createUser(this.user)
        .subscribe(r => {
          this.response = r;
          this.loaded = true;

          if(this.user.id != null && this.user.id.length > 0){
            this.successMessage = "User updated successfully.";
          }else{
            this.successMessage = "User created successfully.";
          }
          
          this.success = true;
          this.user.firstName = "";
          this.user.lastName = "";
          this.user.image = "";
          this.user.email = "";
          this.user.active = false;
          this.user.role = null;
          this.user.address = null;
          this.user.department = null;
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

    if (this.user.firstName == null || this.user.firstName.length <= 0){
      this.errorMessage = this.errorMessage + "Name ";
    }

    if (this.user.lastName == null || this.user.lastName.length <= 0){
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

    if (this.update && (this.user.image == null || this.user.image.length == 0)){
      if(this.errorMessage != null && this.errorMessage.length > 0){
        this.errorMessage = this.errorMessage + " / ";
      }
      this.errorMessage = this.errorMessage + "Image ";
    }
    

    if (this.user.email == null || this.user.email.length <= 0){
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

    this.user.firstName = "";
    this.user.lastName = "";
    this.user.image = "";
    this.user.email = "";
    this.user.active = false;
    this.user.role = null;
    this.user.address = null;
    this.user.department = null;
    this.selectedFile = null;
    this.user.id = "";
    this.user.guid = null;
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

  fetchUsersLazy(event) {
    this.loading = true;
    this.page = event.first / 15;

    this.getAllUsers(false);
  }

  getAllUsers(reset: boolean) {
    if (reset) {
      this.page = 0;
    }

    this.userService.findAllUsers(this.page)
      .subscribe((allUsersResponse: AllUsersResponse) => {
        this.allUsersResponse = allUsersResponse
        if (this.allUsersResponse.content.length == 0) {
          this.paginator = false;
        } else {
          this.paginator = true;
        }
        this.loading = false;
      }
      ); 
  }

  editUser(user: User){
    /*this.user.name = user.name;
    this.user.description = user.description;
    this.user.guid = user.guid;
    this.user.id = user.id;
    this.user.price = user.price;
    this.user.available = user.available;
    this.user.image = user.image;*/
    this.update = true;
  }

  updateUser(){
    this.user.updatedBy = this.tokenStorage.getUsername();
    this.save();
    this.update = false;
  }

  delete(user: User){
    console.log(JSON.stringify(user));
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete '+ user.firstName + '?',
      accept: () => {
        this.deleteUser(user.id);
      }
    });
  }

  deleteUser(id: string) {
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;

    this.userService.deleteUser(id).subscribe(r => {
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
      this.user.image = this.selectedFile.src;
    });
    reader.readAsDataURL(file);
  }
}

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}


import { Component, OnInit } from '@angular/core';
import { Department } from '../model/Department';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from '../services/department.service';
import { AllDepartmentsResponse } from '../model/AllDepartmentsResponse';
import { stringify } from 'querystring';
import { CommonResponse } from '../model/CommonResponse';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css']
})
export class DepartmentsComponent implements OnInit {

  constructor(private departmentService:DepartmentService, private confirmationService: ConfirmationService) { }  
  
  loaded: boolean;
  errorMessage: string;
  successMessage: string;
  error: boolean;
  success: boolean;
  update: boolean;

  department: Department= {
    guid: null,
    name: null,
    description: null,
    id: null
  }

  response: CommonResponse= {
    code: null,
    message: null
  }

  allDepartmentsResponse : AllDepartmentsResponse;

  filterDepartmentName: string;
  
  page: number;
  paginator: boolean = true;
  loading: boolean;
  message: any;

  ngOnInit() {
    this.loaded = true;
    this.getAllDepartments(true)
  }  
  
  save(){  
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;
    this.validate();
    if (!this.error) {
      this.loaded = false;
      this.departmentService.createDepartment(this.department)
        .subscribe(r => {
          this.response = r;
          this.loaded = true;

          if(this.department.id != null && this.department.id.length > 0){
            this.successMessage = "Department updated successfully.";
          }else{
            this.successMessage = "Department created successfully.";
          }
          
          this.success = true;
          this.ngOnInit();
          this.department.name = "";
          this.department.description = "";
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
    if (this.department.name == null || this.department.name.length <= 0){
      this.errorMessage = this.errorMessage + "Name ";
    }

    if (this.department.description == null || this.department.description.length <= 0){
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
    this.department.name = "";
    this.department.description = "";
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

  fetchDepartmentsLazy(event) {
    this.loading = true;
    this.page = event.first / 12;

    this.getAllDepartments(false);
  }

  getAllDepartments(reset: boolean) {
    if (reset) {
      this.page = 0;
    }

    this.departmentService.findAllDepartments(this.page)
      .subscribe((allDepartmentsResponse: AllDepartmentsResponse) => {
        this.allDepartmentsResponse = allDepartmentsResponse
        if (this.allDepartmentsResponse.content.length == 0) {
          this.paginator = false;
        } else {
          this.paginator = true;
        }
        this.loading = false;
      }
      ); 
  }

  editDepartment(department: Department){
    this.department.name = department.name;
    this.department.description = department.description;
    this.department.guid = department.guid;
    this.department.id = department.id;
    this.update = true;
  }

  updateDepartment(){
    this.save();
    this.update = false;
  }

  delete(department: Department){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete '+ department.name + '?',
      accept: () => {
        this.deleteDepartment(department.id);
      }
    });
  }

  deleteDepartment(id: string) {
    this.errorMessage = "";
    this.successMessage = "";
    this.error = false;
    this.success = false;

    this.departmentService.deleteDepartment(id).subscribe(r => {
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

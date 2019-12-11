import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service'
import { UserDataService } from '../../../service/user-data.service'
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.css']
})
export class EditProfilePageComponent implements OnInit {
user: any;
userData: any;
editProfileForm: FormGroup;
profile:boolean = true;
photo:boolean = false;

  constructor(
    private auth:AuthService,
    private UserDataService: UserDataService,
    public fb: FormBuilder,
    private modalService: NgbModal) 
    {
    this.auth.getUser().subscribe( user =>
    this.user = user )
   }

  ngOnInit() {
    
    this.userData = this.UserDataService.getUserDoc(this.user);

 this.editProfileForm = this.fb.group({
     
      'firstName': [],
      'lastName': [],
      'location': [],
      'about': [],
      'interest': [],
      'school': [],
      'work': []
      
    });

  }
    get firstName() { return this.editProfileForm.get('firstName') }
    get lastName() { return this.editProfileForm.get('lastName') }
    get location() { return this.editProfileForm.get('location') }
    get about() { return this.editProfileForm.get('about') }
    get interest() { return this.editProfileForm.get('interest') }
    get school() { return this.editProfileForm.get('school') }
    get work() { return this.editProfileForm.get('work') }
    setInfo(user) {
      return this.auth.updateUser(user, { 
        firstName:this.firstName.value, 
        lastName:this.lastName.value,
        location:this.location.value,
        about:this.about.value,
        interest:this.interest.value,
        school:this.school.value,
        work:this.work.value,
       })
    }
    open(content) {
      this.modalService.open(content);
    }

}

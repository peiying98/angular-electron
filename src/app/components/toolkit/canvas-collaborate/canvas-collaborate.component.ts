import { Component, OnInit, Input } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import {AuthService} from '../../../service/auth.service';
import {UserDataService} from "../../../service/user-data.service";
import * as $ from 'jquery';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

@Component({
  selector: 'app-canvas-collaborate',
  templateUrl: './canvas-collaborate.component.html',
  styleUrls: ['./canvas-collaborate.component.css']
})
export class CanvasCollaborateComponent implements OnInit {
@Input() CanvasID;

collaborateForm: FormGroup;
participants: any = [];
partLen:any

  constructor(
    public fb: FormBuilder,
    private tool: ToolkitService,
    private auth: AuthService,
    private userData: UserDataService
  ) { 

  }

  ngOnInit() {

    this.tool.getCanvasParticipants(this.CanvasID).pipe().subscribe(
      data=>{
        if (!data['participants'] || !data['participantsID'] || (data['participantsID'].length !== data['participants'].length)){
          this.tool.CollabRecon(this.CanvasID, data['participants'])
        }

        if(data['participantsID']){
          this.participants = [data['participantsID'],data['participants']];
          this.partLen = data['participantsID'].length;
        }else{
          this.participants = [[],[]];
          this.partLen = 0;
        }
     
       

      }
    )
    this.collaborateForm = this.fb.group({'collaborateEmail': ['', []]});
  }
  get collaborateEmail() { return this.collaborateForm.get('collaborateEmail') }

  addUser(){
    this.auth.user.pipe().subscribe(
      data=>{
          this.userData.getUserDocDirect(data.uid).take(1).subscribe(inviterData => {
              this.tool.collaborateWith(this.CanvasID, this.collaborateEmail.value, inviterData['firstName']);
          });
      }
    );
    $(`input[name=Email]`).val(``).focusout();
  // 
  }
// left styling
  rmUser(email) {
    if (confirm(`Are you sure you want to delete this user? This operation cannot be undone.`)) {
      this.auth.getUserFromEmail(email).pipe().subscribe(data=>{
        from(data).pipe(map(ele=> ele['uid'])).subscribe(userid=>{
            if(this.participants[0].includes(userid)) {
              this.tool.deleteCollab(this.CanvasID, userid, email);
            }
     
        })
     
      })
        
      };
   
  }
}

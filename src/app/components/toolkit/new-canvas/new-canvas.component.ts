import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import {AuthService} from '../../../service/auth.service';
import * as $ from 'jquery'


@Component({
  selector: 'app-new-canvas',
  templateUrl: './new-canvas.component.html',
  styleUrls: ['./new-canvas.component.css']
})
export class NewCanvasComponent implements OnInit {
  newCanvas: FormGroup;
  userID: any;
  email: any;
  loading: boolean = false;
  mobile: boolean;
  constructor(
    public fb: FormBuilder,
    private tool: ToolkitService,
    private  auth: AuthService,

  ) {

   }

  ngOnInit() {
    if($(window).width() <= 800)
    {this.mobile = true;}
    else{
      this.mobile= false;
    }
  this.loading = false;

    this.newCanvas = this.fb.group({
      'title': ['', [
        Validators.required,
        ]
      ],
      'problemstatement': ['', [
        Validators.required
        ]
      ]
      ,
      'note': ['', [
        ]
      ]
    });
  }

  addCanvas(){
    if(  this.title.value != ''){
    this.loading = true;
    this.auth.getUser().subscribe((user)=>{
      if(user){
      this.userID = user.uid;
      this.email = user.email;
    }
this.tool.addCanvas(
  this.title.value,
  this.problemstatement.value,
  this.note.value,
  this.userID,
  this.email
)
      })
  }
}
  get title() { return this.newCanvas.get('title') }
  get problemstatement() { return this.newCanvas.get('problemstatement')}
  get note() { return this.newCanvas.get('note') }
}


import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../../../service/user-data.service'
import {AuthService} from '../../../../service/auth.service'
import {ChatService} from '../../../../service/chat/chat.service'
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { database } from 'firebase/app';
import * as $ from 'jquery';
import {NotificationService} from '../../../../service/notification/notification.service'


@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  UserData: any;
  useruid: any;
  sendMessageForm: FormGroup;
  chatroomID: any;
  chatroomData: any;
  messages: any;
  user: any;
  errorMessage:string;
  otherUserDataName: any;
  otherUserDataImg: any;
  otherUserID: any;
  img: any;
  mobile: boolean;
  constructor(
    private userdata: UserDataService,
    private auth: AuthService,
    private chat: ChatService,  
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,

  ) 
  {this.auth.getUser().subscribe(user=>
   { if(user)
    {
      this.user= user;
     this.useruid = user.uid}
     if(!user)
    {
      this.user= '';
     this.useruid = ''}
   }
  )
  
    this.route.params.subscribe( params => 
      {
        this.chatroomID = params;
        });
      }
    ngOnInit() {


      const sWidth = $( window ).width();

      if (sWidth < 500)
  {
    this.mobile = true;
  }
      console.log("chatroomID",this.chatroomID.id)
      this.userdata.getViewProfileUserDoc(this.useruid).subscribe(data =>
      this.UserData = data)
      this.messages =  this.chat.getMessages(this.chatroomID.id).valueChanges()
      this.sendMessageForm = this.fb.group({
        'message': []
      });
      this.chatroomData = this.chat.getGlobalChatrooms(this.chatroomID.id)

      this.chatroomData.take(1).subscribe(
        data => {
          if(data.user1 == this.useruid )
          {
            this.otherUserID=data.user2;
            this.userdata.getUserDocDirect(data.user2).take(1).subscribe(
              data => 
          {
            this.otherUserDataName= data.firstName;
            this.otherUserDataImg= data.profileImg
          })
        } 
        else  if(data.user2 == this.useruid )
        {
          this.otherUserID=data.user1;
          this.userdata.getUserDocDirect(data.user1).take(1).subscribe(
            data => 
        {
          this.otherUserDataName= data.firstName;
          this.otherUserDataImg= data.profileImg
        })
      }
        }
      )

    }
    // end of ngOnInit
        get message() { return this.sendMessageForm.get('message') }
   
        sendMessage(){

          if(this.user.emailVerified == false)
          {
          this.errorMessage = "Please verify your email: " + this.user.email;
          }
else{
  if(($.trim( $('#msgInput').val() ) == ""))
{
  this.errorMessage = "You are trying to send an empty message?!?";
} 
          if(!($.trim( $('#msgInput').val() ) == ""))
          {
          this.chatroomData.take(1).subscribe(
            data => {
              if(this.UserData.profileImg){
                this.img=this.UserData.profileImg
              }
              else if(!this.UserData.profileImg){
                this.img="https://app.pitchspot.co/assets/images/navbar-logo-2.png"
              }
              this.chat.sendMessage( 
                this.message.value, 
                this.useruid , 
                this.UserData.firstName , 
                this.img , 
                this.chatroomID.id , 
                data.user1, 
                data.user2);
                $('#msgInput').val('');
              
                if(data.user1 != this.useruid )
                {
                  this.userdata.getUserDocDirect(data.user1).take(1).subscribe(
                    data => 
                  this.notification.sendEmail(data.firstName, data.email , this.UserData.firstName,   this.img ,this.message.value)
                    
                  )
              } 
              else  if(data.user2 != this.useruid )
              {
                this.userdata.getUserDocDirect(data.user2).take(1).subscribe(
                  data => 
                this.notification.sendEmail(data.firstName,data.email , this.UserData.firstName,  this.img ,this.message.value)
                )
            }
            }
          )
        }
        else{
          console.log("Empty message not allowed!")
        }         
        }
         }
      }

    
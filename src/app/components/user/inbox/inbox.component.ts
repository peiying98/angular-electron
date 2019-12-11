import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../../service/user-data.service'
import {AuthService} from '../../../service/auth.service'
import {ChatService} from '../../../service/chat/chat.service'
import { RouterModule, Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

UserData: any;
useruid: any;
chatrooms:any;
mobile: boolean;
  constructor(
    private userdata: UserDataService,
    private auth: AuthService,
    private chat: ChatService,
    public router: Router,
  ) {
    this.auth.getUser().subscribe(user=>
  {if(user)
  {  this.useruid = user.uid
  }
  else if(!user)
  {  this.useruid = false
  }
  }
  ) 
  }

  ngOnInit() {

    const sWidth = $( window ).width();

    if (sWidth < 500)
{
  this.mobile = true;
}
    // this.chat.checkChatrooms(this.useruid, 'dx3RLUNRFR3sYAXGPSvv').subscribe(
    //   data =>
    //   console.log('data:', data )
    // )

    
  
  this.userdata.getViewProfileUserDoc(this.useruid).subscribe(data =>
  {this.UserData = data
})

this.chat.getUserChatrooms(this.useruid).subscribe(
  list =>
  this.chatrooms = list
);

this.chat.clearNotification(this.useruid);

  }

  RouteTo(chatroomID, user1 , user2){
    this.router.navigate([`/inbox/${chatroomID}`]);
    this.auth.getUser().take(1).subscribe(user=>
      this.chat.setisRead(chatroomID, user1 , user2 , user.uid)) 
   
    
  }



}

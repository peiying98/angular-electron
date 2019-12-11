import { Component, OnInit, Input , OnChanges} from '@angular/core';
import {UserDataService} from '../../../service/user-data.service'
@Component({
  selector: 'app-user-img',
  templateUrl: './user-img.component.html',
  styleUrls: ['./user-img.component.css']
})
export class UserImgComponent implements OnInit {
  @Input() id: any;
  @Input() size: any;
  @Input() borderBool: any;
  userimg: any
  constructor(
    private userdatasvc: UserDataService,
  ) {  
  }

  ngOnInit() {  this.userdatasvc.getUserDocDirect(this.id).subscribe(
    data => 
    {
   this.userimg = data.profileImg
  })
  }
ngOnChanges(){
  
}
}
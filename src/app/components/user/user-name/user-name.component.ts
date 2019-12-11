import { Component, OnInit , Input } from '@angular/core'
import {UserDataService} from '../../../service/user-data.service'
@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.css']
})
export class UserNameComponent implements OnInit {
@Input() id;
data: any;
  constructor(
    private userdatasvc: UserDataService,
  ) { }

  ngOnInit() {
    this.userdatasvc.getUserDocDirect(this.id).subscribe(
      data =>  {
      if (data.firstName){
        this.data = data.firstName
      }  
      else {
        this.data = data.email
      }
      }
    );
  }


    }

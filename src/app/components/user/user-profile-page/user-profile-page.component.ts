import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserDataService } from '../../../service/user-data.service';
import { User } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';
import { AuthService } from '../../../service/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent implements OnInit {
  userDoc: AngularFirestoreDocument<User>;
  currentUser: any;
  userData: any;
  userPitches: any;
  useruid: any
  pitchesIsEmpty: any;
  submissionIsEmpty: any;
  nav: string = 'pitches';
  userPitchesSubmitted: any;
  constructor(    
    private userdata: UserDataService,
    private auth: AuthService,
    private route: ActivatedRoute
  )
    {
      this.auth.getUser().subscribe( user =>  
      {
        if(user)
        {this.currentUser=user
      }
      else{this.currentUser=''}
    }
    )
      this.route.params.subscribe( params =>  
       { this.useruid = params
   
        this.userData  = this.userdata.getViewProfileUserDoc(this.useruid.id);   
  
        this.userPitches = this.userdata.getViewProfileUserPitchCol(this.useruid.id);
   
        this.userdata.getViewProfileUserPitchCol(this.useruid.id).subscribe(
          data=> {
            console.log(data)
            if(data['length'] == 0 ){
              this.pitchesIsEmpty = true;
            }
            else{
              this.pitchesIsEmpty = false;
            }
          }
        )
      } )
      }
       
  ngOnInit() {
    
    this.userPitchesSubmitted = this.userdata.getPitchSumibttedtoChallenges(this.useruid.id)
    this.userdata.getPitchSumibttedtoChallenges(this.useruid.id).subscribe(
      data => { if(data['length'] == 0 ){
        this.submissionIsEmpty = true;
      }
      else{
        this.submissionIsEmpty = false;
      }}
    )
    // this.userData  = this.userdata.getViewProfileUserDoc(this.useruid.id);   
    // this.userPitches = this.userdata.getViewProfileUserPitchCol(this.useruid.id);

     
    }

}

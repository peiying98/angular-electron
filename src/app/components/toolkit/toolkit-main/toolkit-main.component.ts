import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {AuthService} from '../../../service/auth.service';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import {UserDataService} from '../../../service/user-data.service';
import {NotificationService} from '../../../service/notification/notification.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { database } from 'firebase';
import {SeoService} from '../../../service/seo/seo.service';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-toolkit-main',
  templateUrl: './toolkit-main.component.html',
  styleUrls: ['./toolkit-main.component.css']
})
export class ToolkitMainComponent implements OnInit {
  currentUser: any;
  ownerName:any;
  ownerEmail:any;
  userEmail: any;
  profileImg: any;
  useruid: any;
  show: Boolean = true;
  navstate: String = '';
  today: any;
  h: any;
  m: any;
  s: any;
  toggle: boolean;
  goodmessage: string;
  params: any;
  canvasID: any;
  canvases: any;
  canvasData: any;
  activeCanvasID: string;
  userName: any;
  focusForm: FormGroup;
  focusString: any;
  tutorialStep: string;
  newUser: any;
  tutorialPartTwo: Boolean = false;
  mobile: any;
  navIsShown: Boolean = false;
  chatpop: Boolean = true;
  feedbackform: FormGroup;
  isVerified: any;
  isSent:any;
  scrollValue:any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tool: ToolkitService,
    private userdata: UserDataService,
    public fb: FormBuilder,
    private notification: NotificationService,
    public _seoService: SeoService

  ) {
    this.route.params.subscribe( params => {
      if (params.id) {
      this.canvasID = params.id;
      this.activeCanvasID = params.id;
      this.canvasData = this.tool.getCanvasData(params.id);
      this.navstate = 'overview';
      this.goToTut(4);
    }else {
      this.canvasID = null;
    }
  });

 
  this.auth.getUser().subscribe(user => {
    if(user){
    this.userdata.getUserDocDirect(user.uid).subscribe(
      data => {
        if (data === undefined) {
          this.auth.setUserName(user, user.displayName)
          setTimeout(() => {
            window.location.reload();
          },
          2000);
        }else {
          this.userName = data.firstName;
          this.profileImg = data.profileImg;
          this.useruid = user.uid;
          this.userEmail = user.email;
          this.isVerified = data.isVerified;
          if (data.update !== true) {
            this.newUser = true;
          }
          if (data.isVerified !== true) {
            this.isSent = false;
          }
          if(this.auth.isVerified() && (data.isVerified === undefined || data.isVerified === null) && !this.isSent){
            this.auth.sendHardWelcome(data.firstName, user.email, user.uid);
            this.isSent = true;
          }

        
        }
      });
    this.canvases = this.tool.getUserCanvases(user.uid);
    }
   

    // if (this.auth.isVerified()) {
    //   this.tool.updateVerification(user.uid);
    // }

  });

  }

  ngOnInit() {
    // if(this.auth.isVerified() && !this.isSent){
    //   window.location.reload();
    // }
  

    if ($(window).width() <= 800){
      this.mobile = true;
    }else {
      this.mobile = false;
    }
    // console.log(this.mobile);

    setTimeout(() => {
      $('#QOTD').fadeOut(2000);
    },
    2000);

    this.timer();

    if (this.h < 12) {
      this.goodmessage = 'Good Morning';
    }else if (this.h >= 12 && this.h < 19) {
      this.goodmessage = `Let's ideate`;
    }else if (this.h >= 19) {
      this.goodmessage = `Can't sleep at night? Ideate here` ;
    }
    setInterval(() => {
      this.timer();
    },
    60000);

    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData('text', ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData('text');
        ev.target.appendChild(document.getElementById(data));
    }

    this.focusForm = this.fb.group({
      'focus': ['', []]
      });

    this.feedbackform = this.fb.group({
      'feedbackInput': ['', [
        ]
      ]
    });

    setTimeout( () => {

      $('#chat').addClass('bounce');
      this.chatpop = true;
      // this.play();
      }, 3000);
      this.auth.getUser().subscribe(user => {
        this.currentUser = user;
      });

      $('#mainbody').click( function(e){});
      $('#feedbackInput').click( function(e){});
 
  }

  get focus() {
    return this.focusForm.get('focus');
  }

  showNav() {
  this.navIsShown = !this.navIsShown;
    if (this.navIsShown) {
    $('#side-nav').slideUp();
  } else {
    $('#side-nav').slideDown();
  }
  }


  togglebtn(evt, canvasName) {
 
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" select", "");
    }
    document.getElementById(canvasName).style.display = "block";
    document.getElementById(canvasName+'-tab').className += " select";
  }

  getOwnerName(userid){
    this.userdata.getUserDocDirect(userid).pipe().subscribe(
      data => {
        if (data === undefined) {
          setTimeout(() => {
            window.location.reload();
          },
          2000);
        }else {
          this.ownerName = data.firstName;
          this.ownerEmail = data.email;
        }
      });
      return this.ownerName;
  }
  


  timer() {
    this.today = new Date();
    this.h = this.today.getHours();
    this.m = this.today.getMinutes();
    this.s = this.today.getSeconds();
    this.m = this.checkTime(this.m);
    this.s = this.checkTime(this.s);
  }

  checkTime(i) {
    // add zero in front of numbers < 10
    if (i < 10) {
      i = '0' + i;
    }

    return i;
  }

  updateCanvasActive(id) {
    if (id === this.activeCanvasID) {
      $(`#${this.activeCanvasID}nav`).toggle('fast');
    } else {
      $(`#${this.activeCanvasID}nav`).toggle('fast');
      $(`#${id}nav`).toggle('fast' , () => {
        this.activeCanvasID =  id;
        this.router.navigate([`/canvas/edit/${id}`]);
      });
    }
  
  }

  logout() {
  this.auth.signOut();
  }

  updateFocus() {

    const value = this.focus.value;
    this.auth.getUser().subscribe(
      user => {
        this.tool.updateFocus(user.uid , value);
      }
    );
    $('input[name=`focusInput`]').val('');
  }

  updateViewfn(state) {

    if (this.mobile) {
      this.showNav();
    }

    this.navstate = state;
    if (state === '') {
      this.router.navigate([`/toolkit`]);
    }

  }

  // teenfong(){
  //   $('#teenfong').animate({
  //     'width': '15em',
  //   });
  // }

  showSlider(canvas) {
    $(`#${canvas.CanvasID}sliderDiv`).slideDown();
    $(`#${canvas.CanvasID}sliderToggle`).slideUp(() => {
      $(`#${canvas.CanvasID}sliderExit`).slideDown();
    });
    this.deleteCanvas(canvas);
  }

  hideSlider(canvas) {
    document.getElementById(`${canvas.CanvasID}slider`)['value'] = 50;
    $(`#${canvas.CanvasID}sliderDiv`).slideUp();
    $(`#${canvas.CanvasID}sliderExit`).slideUp(() => {
      $(`#${canvas.CanvasID}sliderToggle`).slideDown();
    });

  }
  scrollDown(x){
    if(this.scrollValue !== x){
      $('.nav-view').animate({
        scrollTop: `${x * 80}`+'em'
      }, 800);
      this.scrollValue = x;
    }
    return true
  }

  

  // deleteCanvas(canvas) {

  //   document.getElementById(`${canvas.CanvasID}slider`).oninput = () => {
  //     // console.log(document.getElementById(`${canvas.CanvasID}slider`)['value'])
  //     if (document.getElementById(`${canvas.CanvasID}slider`)['value'] >= 90 &&
  //     confirm(`Are you sure you want to delete this canvas? All information, including the evidences will be permanently deleted. This operation cannot be undone.`)) {
  //       this.auth.getUser().take(1).subscribe(user => {
  //       this.tool.deleteCanvas(canvas.CanvasID, user.uid, user.email);
  //       this.router.navigate([`/toolkit`]);
  //     });
  //     }else{
  //       // document.getElementById(`${canvas.CanvasID}slider`)['value'] = 50;
  //       this.hideSlider(canvas)
  //     }
  //     if (document.getElementById(`${canvas.CanvasID}slider`)['value'] <= 10) {
  //       $(`#${canvas.CanvasID}sliderDiv`).slideUp();
       
  //       $(`#${canvas.CanvasID}sliderExit`).slideUp(() => {
  //         $(`#${canvas.CanvasID}sliderToggle`).slideDown();
  //       });

  //     }
  //   };
  // }

  deleteCanvas(canvas) {

      if ( confirm(`Are you sure you want to delete this canvas? All information, including the evidences will be permanently deleted. This operation cannot be undone.`)) {
        this.auth.getUser().take(1).subscribe(user => {
        this.tool.deleteCanvas(canvas.CanvasID, user.uid, user.email);
        this.router.navigate([`/toolkit`]);
      });
      }
      // [ 'KP', 'KA', 'KR', 'VP', 'CR', 'CH', 'CS', 'Cost', 'Rev', 'Evidences' ].forEach(ele=>{
      //   this.tool.delCol(['Disconfirming', 'Leaning Disconfirming', 'Neutral', 'Leaning Confirming', 'Confirming'],`canvas/${canvas.CanvasID}/${ele}`)
      // })

    
  }

  goToTut(step) {
    if (this.newUser === true) {
      if (step === 5 ) {
        this.auth.updateUser(this.currentUser, {'update': true});
        this.tutorialPartTwo = true;
        this.newUser = false;
      }
      this.tutorialStep = step;
      $(`#tutStep${step - 1}`).slideUp();
      $(`#tutStep${step}`).slideDown();
    }
}

  // sendfeedback(){
  //   const input = this.feedbackInput.value;
  //   if(this.useruid){
  //     this.userdata.getUserDocDirectWithUid(this.useruid).take(1).subscribe(
  //       data =>
  //       this.notification.sendEmail(
  //         `Pitchspot Customer Success Team`, `hello@pitchspot.co`, this.userEmail, data.firstName, data.profileImg, input
  //       ));
  //     }
  //   $('#feedbackInput').val('Thank you for the generous feedback! :)');
  //   $('#feedbackInput').attr('placeholder', 'Thank you for the generous feedback! :)');
  // }

  extendarea() {
    $('#feedbackInput').height(150);
  }

  get feedbackInput() {
     return this.feedbackform.get('feedbackInput');
  }

  closechat() {
    $('#chat').removeClass('bounce');
    this.chatpop = false;
  }
}

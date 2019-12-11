import { Component, OnInit, Input } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '../../../service/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-toolkit-login',
  templateUrl: './toolkit-login.component.html',
  styleUrls: ['./toolkit-login.component.css']
})
export class ToolkitLoginComponent implements OnInit {
  signupForm: FormGroup;
  toggled: boolean;
  endpoints:any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public fb: FormBuilder,
    private auth: AuthService,
    private http: HttpClient,
  ) { 
    this.route.params.pipe().subscribe( params => {
      if (params['endpoint']) {
      this.endpoints = params['endpoint'];
    }else {
      this.endpoints = null;

    }
  });

    this.auth.getUser().subscribe((user) => {
      if (user) {
        if (this.endpoints){
          this.router.navigate([`${this.endpoints}`]);
        }else{
          this.router.navigate(['/toolkit']);
        }
       
      }
    });
  }

  ngOnInit() {

    this.toggled = false;

    this.signupForm = this.fb.group({
      'signupEmail': ['', [
        Validators.required,
        Validators.email
        ]
      ],
      'signupPassword': ['', [
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
        ]
      ],
      'resignupPassword': ['', [
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
        ]
      ],
      'loginPassword': ['', [
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
        ]
      ],
      'signupName': ['', [
       Validators.required
        ]
      ]
    });

    // toggle between forget password page and login page

    $('#showforgetPassword').click(function(){
      $('#login-btn').hide();
      $('#showforgetPassword').hide();
      $('#signup-btn').hide();
      $('#firstName').slideUp();
      $('#signuppassword').slideUp();
      $('#resignuppassword').slideUp();
      $('#loginpassword').slideUp();
      $('tnc').hide();
      $('#loginForm').hide();
      $('#tnc').hide();
      $('#signupDesc').hide();
      $('#rmb-checkbox').hide();
      $('#login-header').hide();
      $('#signup-header').hide();
      $('#showloginPassword').fadeIn();
      $('#forgetPassword').fadeIn();
      $('#loginDesc').fadeIn();
      $('#loginForm').fadeIn();
      $('#reset-header').fadeIn();
  });

//     $('#showloginPassword').click(function(){
//       $('#forgetpwDesc').hide();
//       $('#forgetPassword').hide();
//       $('#showloginPassword').hide();
//       $('#login-btn').fadeIn();
//       $('#signupDesc').fadeIn();
//       $('#showforgetPassword').fadeIn();
//       $('#loginpassword').slideDown();
//       $('#login-btn').fadeIn();

// });

// toggle between sign-up page and login page
$('#loginForm').click(function(){
  $('#forgetPassword').hide();
  $('#signup-btn').hide();
  $('#firstName').slideUp();
  $('#loginForm').hide();
  $('#tnc').hide();
  $('#signuppassword').hide();
  $('#resignuppassword').hide();
  $('#loginDesc').hide();
  $('#signup-header').hide();
  $('#reset-header').hide();
  $('tnc').hide();
  $('#login-btn').fadeIn();
  $('#signupDesc').fadeIn();
  $('#rmb-checkbox').fadeIn();
  $('#loginpassword').slideDown();
  $('#showforgetPassword').fadeIn();
  $('#login-header').fadeIn();
});

$('#signupForm').click(function(){
  $('#forgetPassword').hide();
  $('#login-btn').hide();
  $('#signupDesc').hide();
  $('#loginpassword').hide();
  $('#rmb-checkbox').hide();
  $('#login-header').hide();
  $('#reset-header').hide();
  $('#signup-btn').fadeIn();
  $('#firstName').css({display: 'flex'}).slideDown();
  $('tnc').fadeIn();
  $('#loginForm').show();
  $('#loginDesc').fadeIn();
  $('#tnc').fadeIn();
  $('#showloginPassword').slideDown();
  $('#signuppassword').css({display: 'flex'});
  $('#resignuppassword').css({display: 'flex'});
  $('#signup-header').fadeIn();

 
});

  }

  get loginEmail() { return this.signupForm.get('signupEmail');}
  get loginPassword() { return this.signupForm.get('loginPassword'); }
  get signupEmail() { return this.signupForm.get('signupEmail'); }
  get resignupPassword() { return this.signupForm.get('resignupPassword'); }
  get signupPassword() { return this.signupForm.get('signupPassword'); }
  get signupName() { return this.signupForm.get('signupName'); }

  login() {
    this.auth.emailLogin(this.loginEmail.value, this.loginPassword.value).then((user)=>{
      // this.auth.setEmail(user.user);
     
      if (this.endpoints){
        this.router.navigate([`${this.endpoints}`]);
      }else{
        this.router.navigate(['/toolkit']);
      }
   },
 
     err => {
       if (err.code === 'auth/wrong-password') {
       $('#incorrectMsg').slideDown(500, () => {
        setTimeout(() => {
     
            $('#incorrectMsg').slideUp(500);
          
        }, 1000);
      });
     }
     if (err.code === 'auth/user-not-found') {

       $('#nouserMsg').slideDown(500, () => {
        setTimeout(() => {
     
            $('#nouserMsg').slideUp(500);
          
        }, 1000);
      });
     }
   });
  }

  forgetPassword() {
    if (this.loginEmail.value != '') {
      this.auth.getUserFromEmail(this.loginEmail.value).take(1).subscribe(userRecord => {
        if(userRecord['0']){
          $('#forgetPassword').css({
            cursor: 'not-allowed',
            'pointer-events':'none',
            background: '#f1f6f8',
            border: '2px solid rgb(17, 38, 75)',
            opacity: '0.5',
            color: '#11264b',
            'font-weight': 'bold',
          }).html('Sent!');
          this.auth.forgetPassword(this.loginEmail.value, userRecord['0']['firstName']);
        }else{
          $('#noemailMsg').slideDown(500, () => {
            setTimeout(() => {
                $('#noemailMsg').slideUp(500);
            }, 1000);
          });
        }
      })
    }
  }

 signup() {
   if (this.signupPassword.value === this.resignupPassword.value){
    this.auth.emailSignUp(this.signupEmail.value , this.resignupPassword.value)
    .then(
      data => {

        data.user.updateProfile({
          displayName: this.signupName.value,// some displayName,
          photoURL: `${window.location.origin}/assets/images/navbar-logo-2.png`// some photo url
       })

        this.auth.setUserName(data.user, this.signupName.value);
        this.auth.sendEmailVerification(this.signupName.value, this.signupEmail.value);
      },
      err => {
      
        if (err.code === 'auth/email-already-in-use') {

            $('#errorMsg').slideDown(500, () => {
              setTimeout(() => {
          
                  $('#errorMsg').slideUp(500);
                
              }, 1000);
            });

        }
      });
    }else{
      $('#retypeMsg').slideDown(500, () => {
        setTimeout(() => {
     
            $('#retypeMsg').slideUp(500);
          
        }, 1000);
      });
    }
 }


 loginGoogle(){
  // console.log('click')
  this.auth.googleLogin().then(()=>{
    if (this.endpoints){
      this.router.navigate([`${this.endpoints}`]);
    }else{
      this.router.navigate(['/toolkit']);
    }

  });

 

  
  }

  loginFB(){
    // console.log('click')
    this.auth.fbLogin().then(()=>{
      if (this.endpoints){
        this.router.navigate([`${this.endpoints}`]);
      }else{
        this.router.navigate(['/toolkit']);
      }

    });
  
    
    }



}
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '../../../service/auth.service';
import {NotificationService} from '../../../service/notification/notification.service';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-landing-about',
  templateUrl: './landing-about.component.html',
  styleUrls: ['./landing-about.component.css']
})

export class LandingAboutComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  mobile: boolean;
  name_value = '';
  email_value = '';
  text_value= '';
  constructor(
    private notification: NotificationService,
    private router: Router,
    private auth: AuthService,
    public fb: FormBuilder,
    ) { }

  ngOnInit() {

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
      'signupName': ['', [
       Validators.required
        ]
      ]
    });

    this.loginForm = this.fb.group({
      'loginEmail': ['', [
        Validators.required,
        Validators.email
        ]
      ],
      'loginPassword': ['', [
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
        ]
      ]
    });

$(document).ready(function(){
  // Add smooth scrolling to all links
  $('a').on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== '') {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      const hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top - 50
      }, 800, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});
$('#showforgetPassword').click(function(){
  $('#login-pw').hide();
  $('#login-btn').hide();
  $('#showforgetPassword').hide();
  $('#showloginPassword').show();
  $('#forgetPassword').show();
});

$('#showloginPassword').click(function(){
  $('#forgetPassword').hide();
  $('#showloginPassword').hide();
  $('#showforgetPassword').show();
  $('#login-pw').show();
  $('#login-btn').show();

});


}

get loginEmail() { return this.loginForm.get('loginEmail');}
get loginPassword() { return this.loginForm.get('loginPassword'); }
get signupEmail() { return this.signupForm.get('signupEmail'); }
get signupPassword() { return this.signupForm.get('signupPassword'); }
get signupName() { return this.signupForm.get('signupName'); }

login() {
  this.auth.emailLogin(this.loginEmail.value, this.loginPassword.value).then((user)=>{
    this.router.navigate(['/toolkit']);
    this.auth.setEmail(user);
 },

   err => {
     if (err.code === 'auth/wrong-password') {
     alert('Incorrect Password');
   }
   if (err.code === 'auth/user-not-found') {
     alert('No such user found');
   }
 });
}

forgetPassword() {
   if (this.loginEmail.value != ''){
     this.auth.getUserFromEmail(this.loginEmail.value).take(1).subscribe(userRecord => {
         this.auth.forgetPassword(this.loginEmail.value, userRecord['firstName']).then(() => {
             $('#forgetPassword').css({
                 cursor: 'not-allowed',
                 'pointer-events': 'none',
                 background: '#ebedef',
                 color: '#11264b'
             }).html('Sent!');
         }).catch((error) => {
             alert("Email not found!")
         });
     });
   }
}

signup() {
  this.auth.emailSignUp(this.signupEmail.value , this.signupPassword.value).then(
    data => {
      this.auth.setUserName(data.user, this.signupName.value);
      // this.auth.sendEmailVerification();
    },
    err => {
      if (err.code === 'auth/email-already-in-use') {
        $('#signUp-info').slideUp(500, () => {
         $('#errorMsg').slideDown(500, () => {
           setTimeout(() => {
             $('#signUp-info').slideDown(500, () => {
               $('#errorMsg').slideUp();
             });
           }, 1000);
         });
        });
      }
    });
}

redirect(){

  $(document).ready(() => {

    $("#mydiv>div").slideUp( 1000, () => {
      this.router.navigate(['/toolkit/signup']);})
    });

}

scrollDown(){
  var target = $(`#landingAbout`)
  $('html, body').animate({
    scrollTop: target.offset().top
  }, 800);
}

scrollUp(){
  var target = $(`#toolkit-signin`)
  $('html, body').animate({
    scrollTop: target.offset().top
  }, 800);

}

// dropmenu(){
//   if (!this.toggled){
//   $('#myTopnav').slideDown(1000, ()=>{
//     this.toggled = true;
//   });
// }
// else{
//   $('myTopnav').slideUp(1000, ()=>{
//     this.toggled = false;
//   });
// }



// redirect(){

//   // $(document).ready(() => {

//   //   $("#mydiv").animate({
//   //     width: "toggle",

//   //   }, 1000, ()=>{ this.router.navigate(['/business/trial-signup']);})
//   //   })
//   $(document).ready(() => {

//     $("#mydiv>div").slideUp( 1000, () => {
//       this.router.navigate(['/business/trial-signup']);})
//     });



// }
name_update(value: string) {
  this.name_value = value;

}
email_update(value: string) {
  this.email_value = value;

}
text_update(value: string) {
  this.text_value = value;

}

typewriter(){
  console.log('works')
  var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt ;

    var that = this;
    var delta = 125 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 200;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);

    document.getElementById("hamburger-toggle").onclick = function() {
      var x = document.getElementById("myTopnav");
      if (x.className === "topnav") {
          x.className += " responsive";
      }else{
          x.className = "topnav";
      }
  }
};

}

// submitMessage(event: any, el1: HTMLInputElement, el2: HTMLInputElement, el3: HTMLInputElement) {
//   event.preventDefault();


//   if (this.name_value && this.email_value && this.text_value ) {
//     this.notification.sendEmail(
//       'Landing Page Response',
//       'hello@pitchspot.co',
//       this.email_value,
//       this.name_value,
//       '',
//       this.text_value
//     );

//     alert('Thank you for your response! We will get back to you soon!');

//     el1.value = '';
//     el2.value = '';
//     el3.value = '';

//   }else {
//     alert('Opps! Did you missed out any part to submit?');
//   }

// }

}


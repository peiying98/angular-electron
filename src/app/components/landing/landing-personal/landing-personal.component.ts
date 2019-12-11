import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import * as $ from 'jquery';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {AuthService} from '../../../service/auth.service';
import {NotificationService} from '../../../service/notification/notification.service';
import { stringify } from '@angular/core/src/util';

@Component({
  selector: 'app-landing-personal',
  templateUrl: './landing-personal.component.html',
  styleUrls: ['./landing-personal.component.css']
})
export class LandingPersonalComponent implements OnInit {
  loginForm: FormGroup;
  signupForm: FormGroup;
  toggled: boolean;

  constructor(
    private router: Router,
    private notification: NotificationService,
  ) {

  }

  ngOnInit() {

    this.toggled = false;

    this.typewriter();


$(document).ready(function() {
  // Transition effect for navbar
  $(window).scroll(function() {
    // checks if window is scrolled more than 500px, adds/removes solid class
    if ($(this).scrollTop() > 90) {
        $('.topnav').addClass('solid');
    } else {
        $('.topnav').removeClass('solid');
    }
  });

  $('#hamburger-toggle').click(function(){
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav" || x.className === "topnav solid") {
      $('#fafabars').hide();
      $('#blue-banner').hide();
      $('#white-banner').show();
      $('#fafatimes').css({'display':'inline-block'});
      x.className += " responsive";
        
    }else{
      $('#fafatimes').hide();
      $('#white-banner').hide();
      $('#blue-banner').show();
      $('#fafabars').show();
      x.className = "topnav solid";
        
    }
  })
 
});



  }




  scrollDown(navlocation){
    var target = $(`#${navlocation}`);
    var x = document.getElementById("myTopnav");
    $('html, body').animate({
      scrollTop: target.offset().top - 50
    }, 1000);
    $('#fafatimes').hide();
    $('#fafabars').show();
    x.className = "topnav solid";
  }

  scrollUp(){
    var target = $(`#toolkit-signin`)
    $('html, body').animate({
      scrollTop: target.offset().top - 50
    }, 1000);

  }




  redirect(){

    $(document).ready(() => {

      $("#mydiv>div").slideUp( 1000, () => {
        this.router.navigate(['/toolkit/signup']);})
      });

  }



  dropmenu(){
    if (!this.toggled){
    $('#myTopnav').slideDown(1000, ()=>{
      this.toggled = true;
    });
  }
  else{
    $('myTopnav').slideUp(1000, ()=>{
      this.toggled = false;
    });
  }
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

  };

  }
}

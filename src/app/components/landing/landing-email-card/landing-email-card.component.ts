import {Component, Input, OnChanges, OnInit} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PotentialClient } from './potentialClient';

@Component({
  selector: 'app-landing-email-card',
  templateUrl: './landing-email-card.component.html',
  styleUrls: ['./landing-email-card.component.css']
})
export class LandingEmailCardComponent implements OnChanges, OnInit {
  @Input() index: string;

  model : PotentialClient = new PotentialClient();
  submitted : boolean = false;
  hideMessage : boolean = true;

  constructor(
      private http : HttpClient
  ) {}

  ngOnInit(): void {
    let whiteBtnOne: HTMLElement = document.getElementsByClassName('white-button')[0] as HTMLElement;
    let whiteBtnTwo: HTMLElement = document.getElementsByClassName('white-button')[1] as HTMLElement;
    let getStartedBtn: HTMLElement = document.getElementsByClassName('getstarted-btn')[0] as HTMLElement;

    let modalBtn: HTMLElement = document.getElementsByClassName('myBtn')[0] as HTMLElement;

    whiteBtnOne.onclick = function() {
      modalBtn.click();
    };

    whiteBtnTwo.onclick = function() {
      modalBtn.click();
    };

    getStartedBtn.onclick = function() {
      modalBtn.click();
    };
  }

  sendScheduleDemoEmailNotification(email: String, name: String) {
    let triggerUrl = 'https://us-central1-pitchspot-main.cloudfunctions.net/sendScheduleDemoEmailNotification';
    this.http.post(triggerUrl, {
        userFullName: name,
        userEmail: email
        }).subscribe();
  }

  onSubmit() {
    if (this.model.validateDataFields()) {
      this.submitted = true;
    } else {
      this.hideMessage = false;
    }

    if (this.submitted) {
      this.sendScheduleDemoEmailNotification(this.model.email, this.model.name);
      const scriptURL = 'https://script.google.com/macros/s/AKfycbz1yAj2O4AccT9bxeamncoYOK5h9tz802YGZgkGtngs8EcpnQY/exec';
      const form = document.forms['contact'];
      fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => console.log('Success!', response))
        .catch(error => console.error('Error!', error.message))
    }
  }

  ngOnChanges(): void {
    let modal:HTMLElement = document.getElementsByClassName('myModal')[0] as HTMLElement;
    let btn: HTMLElement = document.getElementsByClassName('myBtn')[0] as HTMLElement;
    let span: HTMLElement = document.getElementsByClassName('myClose')[0] as HTMLElement;

    btn.onclick = function() {
      modal.style.display = 'block';
    };

    span.onclick = function() {
      modal.style.display = 'none';
    };

    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }

}

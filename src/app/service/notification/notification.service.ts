import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NotificationService {
  endpoint = 'https://us-central1-pitchspot-main.cloudfunctions.net/httpEmail';

  constructor(private http: HttpClient) { }

  sendEmail(toName, toEmail, senderName, profileImg, senderMsg) {
    const data = {
      toName: toName,
      toEmail: toEmail,
      senderName: senderName,
      profileImg: profileImg,
      senderMsg : senderMsg,
    };

    this.http.post(this.endpoint, data).subscribe();
  }

}






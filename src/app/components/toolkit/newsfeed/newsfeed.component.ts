import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthService} from '../../../service/auth.service';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, SelectMultipleControlValueAccessor } from '@angular/forms';
import * as $ from 'jquery';
import {Router} from '@angular/router';
import { delay } from 'rxjs/operator/delay';


@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {
userID: any;
list: any;
listlength = 0;
listMedium: any;
sublist: any;
loading: boolean = false;
competitorForm: FormGroup;
mobile: boolean;
  constructor(
    private http: HttpClient,
    private tool: ToolkitService,
    private auth: AuthService,
    public fb: FormBuilder,
    private router: Router,
  ) { 
    this.auth.getUser().subscribe(user=>{
      this.userID = user.uid;
    });
    
    
  }

  ngOnInit() {
    this.list = [];
    this.sublist = [];
    this.listMedium = [];
    this.competitorForm = this.fb.group({'competitorName': ['', []]});
    this.fetchCompetitor();
    this.fetchMedium();

    this.tool.getNewsfeed(this.userID).forEach(data=>{
      if (this.auth.isVerified()) {
        if (data.length >= 5){
          $('#maxinput').prop('disabled', true);
          $('#maxinput').attr("placeholder", "Free Trial up to 5 Keywords");
          $('#maxinput').css({cursor:'not-allowed'});
  
          $('#maxkeyword').html('MAX');
          $('#maxkeyword').css({
            background: 'rgb(252, 34, 81)', 
            opacity: '0.8', color: 'white', 
            cursor:'not-allowed', 
            'pointer-events':'none' });
        }else{
          $('#maxinput').prop('disabled', false);
          $('#maxinput').attr("placeholder", "eg. Deliveroo");
          $('#maxinput').css({cursor:'pointer'});
  
          $('#maxkeyword').html('Add');
          $('#maxkeyword').css({background: 'none', opacity: '1', color:"#11264b", cursor:'pointer', 'pointer-events':'all' });
     
        }
      }else{
        $('#maxinput').prop('disabled', true);
        $('#maxinput').attr("placeholder", "Please verify your email!");
        $('#maxinput').css({cursor:'not-allowed'});
        
  }
});
}


get competitorName() { return this.competitorForm.get('competitorName') }

// disableButton(btn){
//   document.getElementById(btn.id).disabled = true;
// }

addCompetitor(){
  this.loading=true;
  
  //this.sublist.push(this.competitorName.value);
  this.tool.checkNewsfeed(this.userID,this.competitorName.value).take(1).subscribe(data=>{
    if (this.competitorName.value !== ''){
      if(data.length == 0){
        this.tool.addNewsfeed(this.userID,
          { content: this.competitorName.value}).then(()=>{
            this.list = [];
            this.fetchCompetitor();
          });
          $('input[name="addCompetitorInput"]').val('')

          // this.tool.getCompetitor(this.CanvasID).take(1).subscribe( lst =>{
          //   let array = [];
          //   lst.forEach(ele =>{
          //     array = array.concat(ele['content']);
          //   });
          //   this.sublist = array;
            
          // });

      }else{
        alert(`${this.competitorName.value} exists in your newsfeed list!`)
    }
  }
  });
}
resendVerification(){
  $('#verifybtn').css({
    cursor: 'not-allowed', 
  'pointer-events':'none',
  background: '#ebedef',
  color: '#11264b'
  }).html('Sent!');

  this.auth.resendEmailVerification();
    


}

  unsubscribe(content, IDref){
    
    if (this.sublist.length <=1){
      this.sublist = [];
    }else{
      this.sublist = this.sublist.splice( this.sublist.indexOf(content), 1 );
    }
    this.tool.unsubscribeNewsfeed(this.userID, IDref).then(()=>{
      this.list = [];
      this.fetchCompetitor();
    });
  }

navigateTo(item){
  window.open(
    item.link,
    '_blank' 
  );
}

callFunction() {
  this.loading = false;
}

fetchCompetitor(){
  
  this.tool.getNewsfeed(this.userID).take(1).subscribe(
    data=>{
      let array = [];
      this.listlength = data.length;
      
      data.forEach((item)=>{
        let content =  item['content'].toLowerCase();
        let IDref =  item['ID'];
        

        array = array.concat({ content, IDref});
        // itterate throught the competitor from database
        this.http.get('https://us-central1-pitchspot-main.cloudfunctions.net/getNews' , {
          params: {
            Content: content,
          }}).subscribe(res=>{
          const parser = new DOMParser();
          const htmlDoc = parser.parseFromString(res['body'], "text/html");

          res['links'].forEach( item => {

            const defaultURL = 'https://pitchspot.co/assets/images/navbar-logo-2.png';
            const sourceText = (htmlDoc.getElementsByClassName('slp')[res['links'].indexOf(item)] || [])['textContent'];
            const imageurl =  (Array.from(htmlDoc.getElementsByClassName('th'))[res['links'].indexOf(item)] || [])['src'];
            const descText = (htmlDoc.getElementsByClassName('st')[res['links'].indexOf(item)] || [])['textContent'];

            if (item.title.toLowerCase().includes(content) || descText.toLowerCase().includes(content)) {
              this.list.push({
                IDref: IDref,
                category: content,
                title: item.title,
                link: item.link,
                source: sourceText || 'No Source',
                img: imageurl || defaultURL ,
                desc: descText || 'No Description'
              });
            }
          });
        });
      });
      this.sublist = array;

    });


}

fetchMedium(){
  let mediumRoot = "https://medium.com/@pitchspot/";
  let promise = new Promise((resolve, reject) => {
    let mediumURL = "https://us-central1-pitchspot-main.cloudfunctions.net/getLatest";
    let arr = [];
    let posts = [];
    this.http.get(mediumURL)
        .toPromise()
        .then(
          res => {
            for(var key in res["payload"]["references"]["Post"]) {
              posts.push(res["payload"]["references"]["Post"][key]);
            }
            posts.forEach(item => {
              this.listMedium.push({
                title: item.title,
                subtitle: item.previewContent.subtitle,
                link: mediumRoot + item.uniqueSlug
              });
            });
            resolve();
          });
        });
      }
}
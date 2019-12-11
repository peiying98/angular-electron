import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ToolkitService} from '../../../service/toolkit/toolkit.service'
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, SelectMultipleControlValueAccessor } from '@angular/forms';
import * as $ from 'jquery';
import {Router} from '@angular/router'
import { delay } from 'rxjs/operator/delay';

@Component({
  selector: 'app-competitor',
  templateUrl: './competitor.component.html',
  styleUrls: ['./competitor.component.css']
})
export class CompetitorComponent implements OnInit {
@Input() CanvasID: any;
list: any;
listlength = 0;
sublist: any;
loading: boolean = false;
competitorForm: FormGroup;
mobile: boolean;
  constructor(
    private http: HttpClient,
    private tool: ToolkitService,
    public fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    if($(window).width() <= 800)
    {this.mobile = true;}
    else{
      this.mobile= false;
    }
    this.list = [];
    this.sublist = [];
    this.competitorForm = this.fb.group({'competitorName': ['', []]});
    this.fetchCompetitor();

}
get competitorName() { return this.competitorForm.get('competitorName') }

addCompetitor(){
  this.loading=true;
  
  //this.sublist.push(this.competitorName.value);
  this.tool.checkCompetitor(this.CanvasID, this.competitorName.value).take(1).subscribe(data=>{
    if(data.length == 0){
      this.tool.addCompetitor(this.CanvasID,
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
      alert(`${this.competitorName.value} exists in your competitor list!`)
    }
  });
  


  }

  unsubscribe(content, IDref){
    
    if (this.sublist.length <=1){
      this.sublist = [];
    }else{
      this.sublist = this.sublist.splice( this.sublist.indexOf(content), 1 );
    }
    this.tool.unsubscribeCompetitor(this.CanvasID, IDref).then(()=>{
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
    this.tool.getCompetitor(this.CanvasID).take(1).subscribe(
      data=>{
        this.listlength = data.length;
        let array = []
        
        data.forEach((item)=>{
          let content =  item['content'].toLowerCase();
          let IDref =  item['ID'];
          array = array.concat({ content, IDref});
          // itterate throught the competitor from database
          this.http.get('https://us-central1-pitchspot-main.cloudfunctions.net/getCompetitor' , {
            params: {
              competitorName: content,
            }}).subscribe(res=>{
            res['links'].forEach((item)=>{
              if (item.title.toLowerCase().includes(content)) {
                this.list.push({ 
                  IDref: IDref,
                  category: content,
                  title: item.title,
                  link: item.link
                })
            }
            });
          });
        });
        this.sublist = array;
        
      })

  }
}

import { Component, OnInit, Input } from '@angular/core';
import * as $ from 'jquery'
import { HttpClient } from '@angular/common/http';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { take } from 'rxjs/operators';
import { normalizeGenFileSuffix } from '@angular/compiler/src/aot/util';
// import {gibberish} from 'gibberish-detector'
// import * as gibberish from 'gibberish-detector'
declare var require: any;
var gibberish = require('gibberish-detector');



@Component({
  selector: 'app-pga',
  templateUrl: './pga.component.html',
  styleUrls: ['./pga.component.css']
})
export class PgaComponent implements OnInit {
show: boolean = false;
CanvasData: any;
gainForm: FormGroup;
inertiaForm: FormGroup;
painForm: FormGroup;
editpainForm: FormGroup;
editinertiaForm: FormGroup;
editgainForm: FormGroup;
gainCol:any;
inertiaCol:any;
painCol:any;
gainpainRatio: any;
gainpainMessage: any;
gainLength:any;
inertiaLength:any;
painLength:any;
spamMsg: any;
mobile: any;
metric: boolean = true;
gainAnalysis:any;
inertiaAnalysis:any;
painAnalysis:any;

@Input() CanvasID;
@Input() Title;
@Input() UserName;

  constructor(
    private http: HttpClient,
    private tool: ToolkitService,
    public fb: FormBuilder,

  ) { }

    ngOnInit() {
      
    // this.http.get('https://newsapi.org/v2/everything?q=bitcoin&apiKey=bc0737a7d3b74732b830963f306e485a')
    // .subscribe(
    //    data => console.log(data)
    // );
    if($(window).width() <= 800){
      this.mobile=true;
    }else{
      this.mobile=false;
    }
    this.gainCol = this.tool.getGain(this.CanvasID)
    this.inertiaCol = this.tool.getInertia(this.CanvasID)
    this.painCol = this.tool.getPain(this.CanvasID)

    this.calculate();
    this.gainForm = this.fb.group({'gain': ['', [
      Validators.required
    ]]});
    this.inertiaForm = this.fb.group({'inertia': ['', [
      Validators.required
    ]]});
    this.painForm = this.fb.group({'pain': ['', [
      Validators.required
    ]]});
    this.editpainForm = this.fb.group({'editpain': ['', [
      Validators.required
    ]]});
    this.editgainForm = this.fb.group({'editgain': ['', [
      Validators.required
    ]]});
    this.editinertiaForm = this.fb.group({'editinertia': ['', [
      Validators.required
    ]]});

    $(document)
    .on('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows;
    });

  }

  ngOnChanges(){
    this.CanvasData = this.tool.getCanvasData(this.CanvasID)

  }

 get gain() { return this.gainForm.get('gain') }
 get inertia() { return this.inertiaForm.get('inertia')}
 get pain() { return this.painForm.get('pain') }
 get editpain() { return this.editpainForm.get('editpain') }
 get editgain() { return this.editgainForm.get('editgain') }
 get editinertia() { return this.editinertiaForm.get('editinertia') }

showToolTip(type){
  $(`#${type}ToolTipText`).slideDown(300, ()=>{
    // setTimeout(()=>{
    //   $(`#${type}ToolTipText`).slideUp()
    // },3000);
  });
}

hideToolTip(type){
  $(`#${type}ToolTipText`).slideUp(300, ()=>{
    // setTimeout(()=>{
    //   $(`#${type}ToolTipText`).slideUp()
    // },3000);
  });
}

addbtn(type){
  $(`#add-${type}-form`).slideDown('fast' , ()=>{
    $(`textarea[name='${type}']`).focus()
  });
  $(`#add-${type}-btn`).slideUp();

  $(`textarea[name='${type}']`).focusout(()=>{
    $(`#add-${type}-btn`).slideDown();
    $(`#add-${type}-form`).slideUp();
  })
}

removebtn(type){

let value;

if(type == 'Pain' && this.pain.value !== ''){
  value = this.pain.value
  this.painForm.reset();
}else if(type == 'Gain' && this.gain.value !== ''){
  value = this.gain.value
  this.gainForm.reset()
}else if(type == 'Inertia' && this.inertia.value !== ''){
  value = this.inertia.value
  this.inertiaForm.reset()
}

$(`#${type}-form`).focusout(()=>{
  $(`#add-${type}-form`).slideUp();
  $(`#add-${type}-btn`).slideDown();
});


// console.log('here',gibberish.detect(value))

// if (gibberish.detect(value) <=60 ){
  // console.log(value)
  if(value !== '' &&  value !== null && value !== undefined){
  this.tool.addPGA(this.CanvasID,{
    content: value,
    timeStamp: Date.now(),
    addedBy: this.UserName
  }, type)
 
}

  
  $(`textarea[name='${type}']`).val('').focusout()
  this.calculate();
// }
// else if(gibberish.detect(value)>60 && gibberish.detect(value)<=80){
// this.spamMsg="Sentence have to be more elaborative!"

//   $(`#${type}Error`).slideDown();
//   setTimeout(function(){  $(`#${type}Error`).slideUp(); }, 1000);
// }
// else if(gibberish.detect(value)>80 ){
// this.spamMsg="That doesn't seem right!"

//   $(`#${type}Error`).slideDown();
//   setTimeout(function(){  $(`#${type}Error`).slideUp(); }, 1000);
// }
}


removeEditForm(item, type){

  if(type == 'Pain'){
    var value = this.editpain.value;
    this.editpainForm.reset();
    }
    if(type == 'Gain'){
    var value = this.editgain.value;
    this.editgainForm.reset();
    }
    if(type == 'Inertia'){
    var value = this.editinertia.value;
    this.editinertia.reset()
    }
    // if (gibberish.detect(value) <=60 ){
      if(value !== '' &&  value !== null){
        this.tool.editPGA(this.CanvasID,{
          content: value
        }, item.ID, type);
        
      }
      this.calculate();
  // this.tool.getAnalysis(this.CanvasID, value, item.ID, type);
  $(`textarea[name='edit${type}']`).val('').focusout()
// }

  // else if(gibberish.detect(value)>60 && gibberish.detect(value)<=80){
  // this.spamMsg="Sentence have to be more elaborative!"
  // $(`#${item.ID}${type}ErrorInput`).slideDown();
  // setTimeout(function(){  $(`#${item.ID}${type}ErrorInput`).slideUp(); }, 1000);
  // }
  // else if(gibberish.detect(value)>80 ){
  // this.spamMsg="That doesn't seem right!"
  // $(`#${item.ID}${type}ErrorInput`).slideDown();
  //   setTimeout(function(){  $(`#${item.ID}${type}ErrorInput`).slideUp(); }, 1000);
  // }

}

openMetric(){
if(this.metric){
  $('#mobileMetricCol').slideDown()
this.metric = !this.metric
}else{
  {
    $('#mobileMetricCol').slideUp()
  this.metric = !this.metric
  }
}
}

showEditForm(item , type){
  $(`textarea[name='edit${type}']`).val(`${item.content}`)
  $(`#${item.ID}editform`).slideDown();
  $(`#${item.ID}`).slideUp();
  $(`textarea[name='edit${type}']`).focus()
  $(`#${item.ID}editform`).focusout(()=>{
    $(`#${item.ID}`).slideDown();
    $(`#${item.ID}editform`).slideUp();
  })
}

removeGain(item){
  this.tool.removeGain(this.CanvasID,item.ID)
  this.calculate();
}
removeInertia(item){
  this.tool.removeInertia(this.CanvasID,item.ID)
  this.calculate();
}
removePain(item){
  this.tool.removePain(this.CanvasID,item.ID)
  this.calculate();
}

showDel(item){
  $(`#${item.ID}trashBtn`).slideUp(()=>{
    $(`#${item.ID}delDiv`).slideDown();
  });
}
hideDel(item) {
  $(`#${item.ID}delDiv`).slideUp(()=>{
    $(`#${item.ID}trashBtn`).slideDown();
  });
}
deleteItem(item, type){
  if (type=='gain'){ 
    this.tool.removeGain(this.CanvasID,item.ID)
      this.calculate();
  }
  if (type=='pain'){  
    this.tool.removePain(this.CanvasID,item.ID)
     this.calculate();
   }
  if (type=='inertia'){ 
    this.tool.removeInertia(this.CanvasID,item.ID)
    this.calculate();
   }
}

calculate(){
  this.gainCol.subscribe(
    data=>{
      this.gainLength = data['length'];
      this.gainAnalysis = data.map( key => key.score).reduce((a, b) => a + b, 0)

      data.forEach(element => {
        if (!('score' in element)  && element['content'] !== undefined && element['ID'] !== undefined){
          this.tool.getAnalysis(this.CanvasID, element['content'], element['ID'], 'Gain')
        }
      });

    }
  )
  this.painCol.subscribe(
    data=>{
      this.painLength = data['length'];
      this.painAnalysis = data.map( key => key.score).reduce((a, b) => a + b, 0)

      data.forEach(element => {
        if (!('score' in element)  && 'content' in element && 'ID' in element){
          this.tool.getAnalysis(this.CanvasID, element['content'], element['ID'], 'Pain')
        }
      });
    }
  )
  this.inertiaCol.subscribe(
    data=>{
      this.inertiaLength = data['length'];
      this.inertiaAnalysis = data.map( key => key.score).reduce((a, b) => a + b, 0)
      data.forEach(element => {
        if (!('score' in element) && element['content'] !== undefined && element['ID'] !== undefined){
          this.tool.getAnalysis(this.CanvasID, element['content'], element['ID'], 'Inertia')
        }
      });
    }
  )
}


openNav() {
  this.show = true;
      $('#myDiv').animate({
              'width': '20%',
              "opacity": "1",
              'display': 'block',
          },
          ()=>{
  document.getElementById("metric-btn").style.opacity = "0";
  document.getElementById("metric-btn").style.display = "none";
  document.getElementById("mobileMetricCol").style.display = "block";
          } )
  

}

closeNav(){
  this.show = false;
  // document.getElementById("myDiv").style.width = "0px";
  $('#mobileMetricCol').animate({
    'display': 'none',

  })
  
  $('#myDiv').animate({
          'width': '0%',
          "opacity": "0",
          'display': 'none'
      },
      () => {
        document.getElementById("metric-btn").style.opacity = "1";
        document.getElementById("metric-btn").style.display = "block";
        document.getElementById("mobileMetricCol").style.display = "none";
      })
}

}

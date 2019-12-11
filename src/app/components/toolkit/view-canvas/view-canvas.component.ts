import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import * as $ from 'jquery'
import { HttpClient } from '@angular/common/http';
import {ToolkitService} from '../../../service/toolkit/toolkit.service';
import {Router, ActivatedRoute} from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { normalizeGenFileSuffix } from '@angular/compiler/src/aot/util';
import { BuiltinType, IfStmt } from '@angular/compiler';
import {AuthService} from '../../../service/auth.service';
// import {gibberish} from 'gibberish-detector'
// import * as gibberish from 'gibberish-detector'
declare var require: any;
var gibberish = require('gibberish-detector');


@Component({
  selector: 'app-view-canvas',
  templateUrl: './view-canvas.component.html',
  styleUrls: ['./view-canvas.component.css']
})
export class ViewCanvasComponent implements OnInit {

  userid:any;
  show: boolean = false;
  CanvasData: any;
  bmcForm: FormGroup;
  DescForm: FormGroup;
  KPCol:any;
  KACol:any;
  KRCol:any;
  VPCol:any;
  CRCol:any;
  CHCol:any;
  CSCol:any;
  CostCol:any;
  RevCol:any;
  KPLength:any;
  KALength:any;
  KRLength:any;
  VPLength:any;
  CRLength:any;
  CHLength:any;
  CSLength:any;
  CostLength:any;
  RevLength:any;
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
  mr: NgbModalRef;
  object:any;
  objectType:any;
  objectID:any;
  numEvidences:any;
  numC:any;
  numLC:any;
  numN:any;
  numLD:any;
  numD:any;
  desc:any;
  numAnomV:any;
  numRegV:any;
 valData:any=[];
 titleContent:any;
  CanvasID: any;
  Title:any;
  participantsList;
  isLoggedin:any;
  
    constructor(
      private http: HttpClient,
      private tool: ToolkitService,
      public fb: FormBuilder,
      private router: Router,
      private route: ActivatedRoute,
      public modalService: NgbModal,
      private auth: AuthService,
      
    ) { 
      this.auth.isLoggedin().pipe().subscribe(res => {
        if (res && res.uid) {
          this.isLoggedin = true;
          this.userid = res.uid;
        } else {
          this.isLoggedin = false;
        }
      });;
      // this.http.get<{ip:string}>('https://jsonip.com')
      // .subscribe( data => {
      //   this.ipAddress = data.ip;
      // })
      this.route.params.pipe().subscribe( params => {
        if (params.id) {
        this.CanvasID = params.id;
        this.tool.getCanvasData(params.id).pipe().subscribe(data=>{
          this.CanvasData = data;
          this.participantsList = data['participantsID'].concat([data['userID']])
          this.Title = data['Title']
         
        });
  
      }else {
        this.CanvasID = null;

      }
    });

      this.tool.countVisitor(this.CanvasID, '')
    
    }
  
      ngOnInit() {

        this.tool.getAnomVisitor(this.CanvasID).pipe().subscribe(data=>{
          if (data['length']){
           this.numAnomV = data['length']
          }else{
            this.numAnomV = 0;
          }

          
        })

        this.tool.getRegVisitor(this.CanvasID).pipe().subscribe(data=>{
          if (data['length']){
           this.numRegV = data['length']
          }else{
            this.numRegV = 0;
          }

        })


      // this.http.get('https://newsapi.org/v2/everything?q=bitcoin&apiKey=bc0737a7d3b74732b830963f306e485a')
      // .subscribe(
      //    data => console.log(data)
      // );
      if($(window).width() <= 800){
        this.mobile=true;
      }else{
        this.mobile=false;
      }

      // initiatlise the BMC data per column
      this.tool.getKP(this.CanvasID).pipe().subscribe(data=>{
        this.KPCol = data;
        this.KPLength = data['length'];
        // $(`#KP`).scrollTop(5000);
      });

      this.tool.getKA(this.CanvasID).pipe().subscribe(data=>{
        this.KACol = data;
        this.KALength = data['length'];
        // $(`#KA`).scrollTop(5000);
      });

      this.tool.getKR(this.CanvasID).pipe().subscribe(data=>{
        this.KRCol = data;
        this.KRLength = data['length'];
        // $(`#KR`).scrollTop(5000);
      });

      this.tool.getVP(this.CanvasID).pipe().subscribe(data=>{
        this.VPCol = data;
        this.VPLength = data['length'];
        // $(`#VP`).scrollTop(5000);
      });

      this.tool.getCR(this.CanvasID).pipe().subscribe(data=>{
        this.CRCol = data;
        this.CRLength = data['length'];
        // $(`#CR`).scrollTop(5000);
      });

      this.tool.getCH(this.CanvasID).pipe().subscribe(data=>{
        this.CHCol = data;
        this.CHLength = data['length'];
        // $(`#CH`).scrollTop(5000);
      });

      this.tool.getCS(this.CanvasID).pipe().subscribe(data=>{
        this.CSCol = data;
        this.CSLength = data['length'];
        // $(`#CS`).scrollTop(5000);
      });

      this.tool.getCost(this.CanvasID).pipe().subscribe(data=>{
        this.CostCol = data;
        this.CostLength = data['length'];
        // $(`#Cost`).scrollTop(5000);
      });

      this.tool.getRev(this.CanvasID).pipe().subscribe(data=>{
        this.RevCol = data;
        this.RevLength = data['length'];
        // $(`#Rev`).scrollTop(5000);
      });
  
    }
  
    ngOnChanges(){
      this.CanvasData = this.tool.getCanvasData(this.CanvasID)
     
    }

  
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
  
  inputCol(type){
    event.preventDefault();
    $(`#add-${type}-form`).show();
    $(`textarea[name='${type}']`).focus();
    $(`#add-${type}-btn`).hide();
    $(`textarea[name='${type}']`).focusout(()=>{

    $(`textarea[name='${type}']`).val('');
      $(`#add-${type}-form`).hide();
      $(`#add-${type}-btn`).show();
    });
  }

loginNow(){
  this.router.navigate(['/login', {endpoint: `/canvas/view/${this.CanvasID}`}]).then(()=>{
    this.mr.close();
  });
}

  open(content, object, objectID, type) {
 
    this.numEvidences = 0;
    this.desc = '';
    this.titleContent= '';
    this.tool.totalEvidences(this.CanvasID, objectID, type);
    this.tool.getCardData(this.CanvasID, objectID, type).pipe().subscribe(data=>{
      if(data !== undefined){
        this.desc = data['description'];
        this.numC = data['Confirming'];
        this.numLC = data['Leaning Confirming'];
        this.numN = data['Neutral'];
        this.numLD = data['Leaning Disconfirming'];
        this.numD = data['Disconfirming'];
        this.numEvidences = data['numEvidences'];
        // this.valData= [
        //   data['Disconfirming'],
        //   data['Leaning Disconfirming'],
        //   data['Neutral'],
        //   data['Leaning Confirming'],
        //   data['Confirming']
        //  ]
      }

    })

    this.object = object;
    this.objectType = type;
    this.objectID = objectID;
    this.titleContent = object.content;
    this.mr = this.modalService.open(content);

  
   
  }



  exit(type){
    
    $(`#add-${type}-form`).hide();
    $(`#add-${type}-btn`).show();
    $(`textarea[name='${type}']`).val('').focusout();
 
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



  // showEditIcon(type,id){
  //   $(`#${type}-edit-${id}`).show();
  // }
  
  // hideEditIcon(type,id){
  //   $(`#${type}-edit-${id}`).hide();
  // }


  goWorkspace(){
    this.router.navigate([`/canvas/edit/${this.CanvasID}`]);
  }

  copyLink(){
    const el = document.createElement('textarea');
    el.value = `${window.location.origin}/canvas/view/${this.CanvasID}`;
    document.body.appendChild(el);

    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      var editable = el.contentEditable;
      var readOnly = el.readOnly;
  
      // convert to editable with readonly to stop iOS keyboard opening
      el.contentEditable = 'true';
      el.readOnly = true;

      // create a selectable range
      var range = document.createRange();
      range.selectNodeContents(el);

      // select the range
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      el.setSelectionRange(0, 999999);

      // restore contentEditable/readOnly to original state
      el.contentEditable = editable;
      el.readOnly = readOnly;
    }else{
      el.select();
    }
    
    try {  
      // Now that we've selected the anchor text, execute the copy command 

      document.execCommand('copy');
      document.body.removeChild(el);
      $('#copyClipboard').text(`Copied!`);
    } catch(err) {  
      alert(err)  
    }  
    
 

  }
  
  
  openNav() {
    this.show = true;
        $('#myDiv').animate({
                'width': '20%',
                "opacity": "1",
                'display': 'block',
            },
            ()=>{
    document.getElementById("metric-btn").style.opacity = "0"
            } )
    
  
  }
  
  closeNav(){
    this.show = false;
    // document.getElementById("myDiv").style.width = "0px";
    $('#myDiv').animate({
            'width': '0%',
            "opacity": "0",
            'display': 'none'
        },
        () => {
          document.getElementById("metric-btn").style.opacity = "1"
        })
  }
  
  }